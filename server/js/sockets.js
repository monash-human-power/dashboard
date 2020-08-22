/*
 * Socket.io (Server-side)
 */
require('dotenv').config();

const sockets = {};
const mqtt = require('mqtt');
const os = require('os');

// Public MQTT broker
let PUBLISH_ONLINE = false;
let PUBLIC_MQTT_CLIENT;

// global vars
global.lastRecordingPayloads = {};

function connectToPublicMQTTBroker(clientID = '') {
  const publicMqttOptions = {
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    clientId: `publicMqttClient-${clientID}-${Math.random()
      .toString(16)
      .substr(2, 8)}`,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    host: process.env.MQTT_SERVER,
    port: process.env.MQTT_PORT,
  };
  const mqttInstance = mqtt.connect(publicMqttOptions);
  mqttInstance.on('connect', function publicMqttConnected(connack) {
    console.log(`Connected to public mqtt broker - ${JSON.stringify(connack)}`);
  });
  mqttInstance.on('error', function publicMqttError(error) {
    console.error(`Public MQTT Error: ${error}`);
  });
  mqttInstance.on('reconnect', function publicMqttError() {
    console.log('Reconnecting to public MQTT broker...');
  });
  return mqttInstance;
}

function sendToPublicMQTTBroker() {
  return process.env.HEROKU === undefined && PUBLISH_ONLINE;
}

function mqttConnected() {
  console.log('Connected to mqtt broker');
}

function mqttError(error) {
  console.error(`MQTT Error: ${error}`);
}

function mqttDataConverter(payload) {
  const message = {};
  const dataArray = payload.split('&');
  for (let index = 0; index < dataArray.length; index += 1) {
    const data = dataArray[index].split('=');
    const key = data[0];
    const value = data[1];
    // No need to average filename value
    if (key === 'filename') {
      message[key] = value;
    } else {
      message[key] = Number(value);
    }
  }
  return message;
}

function mqttDataTopicHandler(socket, payload) {
  const message = mqttDataConverter(payload);
  socket.emit('data', message);
}

sockets.init = function socketInit(server) {
  const mqttOptions = {
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    clientId: 'mqttClient',
  };

  let mqttClient = null;
  if (process.env.HEROKU) {
    console.log('I am using a Heroku instance');
    mqttClient = connectToPublicMQTTBroker(`${os.hostname()}-HEROKU`);
  } else {
    mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOptions);
  }
  mqttClient.subscribe('start');
  mqttClient.subscribe('stop');
  mqttClient.subscribe('data');
  mqttClient.subscribe('power_model/predicted_max_speed');
  mqttClient.subscribe('power_model/recommended_SP');
  mqttClient.subscribe('power_model/plan_generated');
  mqttClient.subscribe('camera/push_overlays');
  // Camera recording status subscription occurs when mqttClient message handler is set
  mqttClient.on('connect', mqttConnected);
  mqttClient.on('error', mqttError);
  // Not a heroku instance
  if (sendToPublicMQTTBroker()) {
    console.log('Not a heroku instance');
    PUBLIC_MQTT_CLIENT = connectToPublicMQTTBroker(os.hostname());
  }

  // eslint-disable-next-line global-require
  const io = require('socket.io').listen(server);
  io.on('connection', function ioConnection(socket) {
    /*
      Must subscribe to these when the mqtt message handler is set
      otherwise the retained payloads will not be handled.
      Alternative implementation:
        Subscribe with the other topics and add a new message handler
        for the topics
    */
    mqttClient.subscribe('/v3/camera/recording/status/primary');
    mqttClient.subscribe('/v3/camera/recording/status/secondary');

    mqttClient.on('message', function mqttMessage(topic, payload) {
      const payloadString = payload.toString();
      const topicString = topic.split('/');
      if (topicString.length === 1) {
        switch (topic) {
          case 'start':
            socket.emit('start');
            break;
          case 'stop':
            socket.emit('stop');
            break;
          case 'data':
            mqttDataTopicHandler(socket, payloadString);
            if (sendToPublicMQTTBroker()) {
              PUBLIC_MQTT_CLIENT.publish('data', payloadString);
            }
            break;
          default:
            console.error(`Unhandled topic - ${topic}`);
            break;
        }
      } else if (topicString[0] === 'power_model') {
        socket.emit('power-model-running');
        const message = mqttDataConverter(payloadString);
        switch (topicString[1]) {
          case 'predicted_max_speed':
            socket.emit('power-model-max-speed', message);
            break;
          case 'recommended_SP':
            socket.emit('power-model-recommended-SP', message);
            break;
          case 'plan_generated':
            socket.emit('power-plan-generated');
            break;
          default:
            console.error(`Unhandled topic - ${topic}`);
            break;
        }
      } else if (topicString[0] === 'camera') {
        switch (topicString[1]) {
          case 'push_overlays':
            socket.emit('push-overlays', payloadString);
            break;
          default:
            console.error(`Unhandled topic - ${topic}`);
            break;
        }
      } else if (
        topicString.slice(0, -1).join('/') === '/v3/camera/recording/status'
      ) {
        // Send mqtt payload on corresponding channel
        socket.emit(
          `camera-recording-status-${topicString[topicString.length - 1]}`,
          payloadString,
        );

        // store last received payload for device globally
        global.lastRecordingPayloads[
          topicString[topicString.length - 1]
        ] = payloadString;
      } else {
        console.error(`Unhandled topic - ${topic}`);
      }
    });

    // TODO: Fix up below socket.io handlers
    socket.on('start-power-model', () => {
      mqttClient.publish('power_model/start', 'true');
    });

    socket.on('stop-power-model', () => {
      mqttClient.publish('power_model/stop', 'true');
    });

    socket.on('reset-calibration', () => {
      mqttClient.publish('power_model/calibrate/reset', 'true');
    });

    socket.on('submit-calibration', (calibratedDistance) => {
      mqttClient.publish(
        'power_model/calibrate',
        `calibrate=${calibratedDistance}`,
      );
    });

    socket.on('send-message', (message) => {
      const payload = JSON.stringify({ message });
      mqttClient.publish('/v3/camera/message', payload);
      socket.emit('send-message-received');
    });

    socket.on('create-power-plan', (inputPowerPlan) => {
      console.log(
        `Generated new power plan - ${inputPowerPlan.inputs.fileName}.json`,
      );
      mqttClient.publish(
        'power_model/generate_power_plan',
        JSON.stringify(inputPowerPlan),
      );
    });

    socket.on('get-overlays', () => {
      mqttClient.publish('camera/get_overlays', 'true');
    });

    socket.on('set-overlays', (selectedOverlays) => {
      mqttClient.publish('camera/set_overlay', selectedOverlays);
    });

    socket.on('publish-data-on', () => {
      PUBLISH_ONLINE = true;
      // Connect to public MQTT broker if not connected already
      if (PUBLIC_MQTT_CLIENT === undefined) {
        PUBLIC_MQTT_CLIENT = connectToPublicMQTTBroker(os.hostname());
      }
    });

    socket.on('publish-data-off', () => {
      PUBLISH_ONLINE = false;
      // Disconnect from public MQTT broker
      if (PUBLIC_MQTT_CLIENT !== undefined) {
        PUBLIC_MQTT_CLIENT.end();
        PUBLIC_MQTT_CLIENT = undefined;
      }
    });

    socket.on('get-server-settings', () => {
      socket.emit('server-settings', { publishOnline: PUBLISH_ONLINE });
    });

    socket.on('send-last-received-camera-recording-payloads', () => {
      // Send mqtt payload on corresponding channel for each device
      Object.keys(global.lastRecordingPayloads).forEach((device) => {
        socket.emit(
          `camera-recording-status-${device}`,
          global.lastRecordingPayloads[device],
        );
      });
    });

    socket.on('start-camera-recording', () => {
      mqttClient.publish('/v3/camera/recording/start');
    });

    socket.on('stop-camera-recording', () => {
      mqttClient.publish('/v3/camera/recording/stop');
    });
  });
};

module.exports = sockets;
