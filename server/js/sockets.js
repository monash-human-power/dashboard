/*
 * Socket.io (Server-side)
 */
require('dotenv').config();

const sockets = {};
const mqtt = require('mqtt');
const os = require('os');

function publicMqttConnected() {
  console.log('Connected to public mqtt broker');
}

function mqttConnected() {
  console.log('Connected to mqtt broker');
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
  const publicMqttOptions = {
    reconnectPeriod: 1000,
    connectTimeout: 5000,
    clientId: `publicMqttClient-${os.hostname()}`,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    host: process.env.MQTT_SERVER,
    port: process.env.MQTT_PORT,
  };

  let mqttClient = null;
  if (process.env.HEROKU) {
    console.log('I am using a Heroku instance');
    publicMqttOptions.clientId += '-HEROKU';
    mqttClient = mqtt.connect(publicMqttOptions);
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
  mqttClient.on('connect', mqttConnected);

  // Not a heroku instance
  let publicMqttClient = null;
  if (process.env.HEROKU === undefined) {
    console.log('Not a heroku instance');
    publicMqttClient = mqtt.connect(publicMqttOptions);
    publicMqttClient.on('connect', publicMqttConnected);
  }

  // eslint-disable-next-line global-require
  const io = require('socket.io').listen(server);
  io.on('connection', function ioConnection(socket) {
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
            if (process.env.HEROKU === undefined) {
              publicMqttClient.publish('data', payloadString);
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
      } else {
        console.error(`Unhandled topic - ${topic}`);
      }
    });

    socket.on('start-power-model', () => {
      mqttClient.publish('power_model/start', 'true');
    });

    socket.on('stop-power-model', () => {
      mqttClient.publish('power_model/stop', 'true');
    });

    socket.on('reset-calibration', () => {
      mqttClient.publish('power_model/calibrate/reset', 'true');
    });

    socket.on('submit-calibration', calibratedDistance => {
      mqttClient.publish(
        'power_model/calibrate',
        `calibrate=${calibratedDistance}`,
      );
    });

    socket.on('create-power-plan', inputPowerPlan => {
      console.log(
        `Generated new power plan - ${inputPowerPlan.inputs.fileName}.pkl`,
      );
      mqttClient.publish(
        'power_model/generate_power_plan',
        JSON.stringify(inputPowerPlan),
      );
    });

    socket.on('get-overlays', () => {
      mqttClient.publish('camera/get_overlays', 'true');
    });

    socket.on('set-overlays', selectedOverlays => {
      mqttClient.publish('camera/set_overlays', selectedOverlays);
    });
  });
};

module.exports = sockets;
