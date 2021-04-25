/*
 * Socket.io (Server-side)
 */
require('dotenv').config();

const sockets = {};
const mqtt = require('mqtt');
const os = require('os');

const { DAS, BOOST, Camera, WirelessModule } = require('./topics');
const { getPropWithPath, setPropWithPath } = require('./util');

// Public MQTT broker
let PUBLISH_ONLINE = false;
let PUBLIC_MQTT_CLIENT;

/**
 * Structure can be found in the MQTT V3 Topics page on Notion
 */
const retained = {
  status: {},
  camera: {},
};

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

function queryStringToJson(payload) {
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
  const message = queryStringToJson(payload);
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
  mqttClient.subscribe(DAS.start);
  mqttClient.subscribe(DAS.stop);
  mqttClient.subscribe(DAS.data);
  mqttClient.subscribe(WirelessModule.all().module);
  mqttClient.subscribe(BOOST.predicted_max_speed);
  mqttClient.subscribe(BOOST.generate_complete);
  mqttClient.subscribe(BOOST.recommended_sp);
  mqttClient.subscribe(BOOST.configs);
  mqttClient.subscribe(Camera.push_overlays);
  // TODO: This subscription should be removed when handling of BOOST.generate.complete
  // is implemented.
  mqttClient.subscribe('power_model/plan_generated');
  // Camera recording status subscription occurs when mqttClient message handler is set
  // Camera video feed status subscription occurs when mqttClient message handler is set
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
    socket.setMaxListeners(20);

    /*
      Must subscribe to these when the mqtt message handler is set
      otherwise the retained payloads will not be handled.
      Alternative implementation:
        Subscribe with the other topics and add a new message handler
        for the topics
    */
    mqttClient.subscribe('status/#');

    mqttClient.on('message', function mqttMessage(topic, payload) {
      const payloadString = payload.toString();

      if (topic.startsWith('status')) {
        try {
          const topicString = topic.split('/');
          // topicString: ["status", "<component>", "<subcomponent>", ...properties]
          const value = JSON.parse(payloadString);
          const path = topicString;

          // Add to global
          retained[path[0]] = setPropWithPath(
            retained[path[0]],
            path.slice(1),
            value,
          );

          // Emit subcomponent
          const component = topicString[1] ?? '';
          const subcomponent = topicString[2] ?? '';
          socket.emit(
            `status-${component}-${subcomponent}`,
            retained.status?.[component]?.[subcomponent],
          );
        } catch (e) {
          console.error(
            `Error in parsing received payload\n\ttopic: ${topic}\n\tpayload: ${payloadString}\n`,
          );
        }
      } else if (topic.startsWith(WirelessModule.base)) {
        // Emit on appropriate channel
        try {
          const [, , id, property] = topic.split('/').slice(1); // Remove leading ""
          // topicString: ["v3", "wireless_module", <id>, <property>]
          const value = JSON.parse(payloadString);

          // Emit parsed payload as is
          socket.emit(`module-${id}-${property}`, value);

          // If needs to be retained, that can be implemented here
        } catch (e) {
          console.error(
            `Error in parsing received payload\n\ttopic: ${topic}\n\tpayload: ${payloadString}\n`,
          );
        }
      } else if (topic.startsWith(Camera.base)) {
        // Emit on appropriate channel
        try {
          const topicString = topic.split('/');
          // topicString: ["camera", device, property]
          const [, device, property] = topicString;
          const value = JSON.parse(payloadString);
          const path = topicString;

          // Add to global
          retained[path[0]] = setPropWithPath(
            retained[path[0]],
            path.slice(1),
            value,
          );

          // Emit parsed payload as is
          socket.emit(`camera-${device}-${property}`, value);

          // If needs to be retained, that can be implemented here
        } catch (e) {
          console.error(
            `Error in parsing received payload\n\ttopic: ${topic}\n\tpayload: ${payloadString}\n`,
          );
        }
      } else {
        switch (topic) {
          case DAS.start:
            socket.emit('start');
            break;
          case DAS.stop:
            socket.emit('stop');
            break;

          // V2 data channel
          case DAS.data:
            mqttDataTopicHandler(socket, payloadString);
            if (sendToPublicMQTTBroker()) {
              PUBLIC_MQTT_CLIENT.publish(DAS.data, payloadString);
            }
            break;

          case BOOST.predicted_max_speed:
            socket.emit('power-model-running');
            socket.emit(
              'power-model-max-speed',
              queryStringToJson(payloadString),
            );
            break;
          case BOOST.recommended_sp:
            socket.emit('power-model-running');
            socket.emit(
              'power-model-recommended-SP',
              queryStringToJson(payloadString),
            );
            socket.emit('boost/recommended_sp', payloadString);
            break;
          case BOOST.configs:
            socket.emit('boost/configs', payloadString);
            break;
          case BOOST.generate_complete:
            socket.emit('boost/generate_complete', payloadString);
            break;
          // TODO: Remove this when handling of
          // BOOST.generate.complete is implemented.
          case 'power_model/plan_generated':
            socket.emit('power-model-running');
            socket.emit('power-plan-generated');
            break;

          case Camera.push_overlays:
            socket.emit('push-overlays', payloadString);
            break;

          default:
            console.error(`Unhandled topic - ${topic}`);
            break;
        }
      }
    });

    socket.on('get-status-payload', (path) => {
      if (path instanceof Array && path.length > 0)
        socket.emit(
          `status-${path.join('-')}`,
          getPropWithPath(retained.status, path),
        );
    });

    // TODO: Fix up below socket.io handlers
    socket.on('start-power-model', () => {
      mqttClient.publish(BOOST.start, 'true');
    });

    socket.on('stop-power-model', () => {
      mqttClient.publish(BOOST.stop, 'true');
    });

    socket.on('reset-calibration', () => {
      mqttClient.publish(BOOST.calibrate_reset, 'true');
    });

    socket.on('send-config', (configContent) => {
      mqttClient.publish('boost/configs/action', configContent);
    });

    socket.on('submit-selected-configs', (selectedConfigs) => {
      mqttClient.publish(BOOST.generate, selectedConfigs);
    });

    socket.on('submit-calibration', (calibratedDistance) => {
      mqttClient.publish(BOOST.calibrate, `calibrate=${calibratedDistance}`);
    });

    socket.on('send-message', (message) => {
      const payload = JSON.stringify({ message });
      mqttClient.publish(Camera.overlay_message, payload);
    });

    socket.on('create-power-plan', (inputPowerPlan) => {
      mqttClient.publish(
        'power_model/generate_power_plan',
        JSON.stringify(inputPowerPlan),
      );
    });

    socket.on('get-overlays', () => {
      mqttClient.publish(Camera.get_overlays, 'true');
    });

    socket.on('set-overlays', (selectedOverlays) => {
      mqttClient.publish(Camera.set_overlay, selectedOverlays);
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

    socket.on('start-camera-recording', () => {
      mqttClient.publish(Camera.recording_start);
    });

    socket.on('stop-camera-recording', () => {
      mqttClient.publish(Camera.recording_stop);
    });

    socket.on('start-das-recording', () => {
      [1, 2, 3, 4].forEach((n) =>
        mqttClient.publish(WirelessModule.id(n).start),
      );
    });

    socket.on('stop-das-recording', () => {
      [1, 2, 3, 4].forEach((n) =>
        mqttClient.publish(WirelessModule.id(n).stop),
      );
    });
  });
};

module.exports = sockets;
