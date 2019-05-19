/*
 * Socket.io (Server-side)
 */
const sockets = {};
const mqtt = require('mqtt');
const io = require('socket.io');
const os = require('os');

function publicMqttConnected() {
  console.log('Connected to public mqtt broker');
}

function mqttConnected() {
  console.log('Connected to mqtt broker');
}

function mqttDataTopicHandler(socket, payload) {
  // Parse data
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
  };

  let mqttClient = null;
  if (process.env.HEROKU) {
    console.log('I am using a Heroku instance');
    publicMqttOptions.clientId += '-HEROKU';
    mqttClient = mqtt.connect(
      'mqtt://m16.cloudmqtt.com:10421',
      publicMqttOptions,
    );
  } else {
    mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOptions);
  }
  mqttClient.subscribe('start');
  mqttClient.subscribe('stop');
  mqttClient.subscribe('data');
  mqttClient.subscribe('power_model/max_speed');
  mqttClient.subscribe('power_model/recommended_SP');
  mqttClient.on('connect', mqttConnected);

  // Not a heroku instance
  let publicMqttClient = null;
  if (process.env.HEROKU === undefined) {
    console.log('Not a heroku instance');
    publicMqttClient = mqtt.connect(
      'mqtt://m16.cloudmqtt.com:10421',
      publicMqttOptions,
    );
    publicMqttClient.on('connect', publicMqttConnected);
  }

  io.listen(server);
  io.on('connection', function ioConnection(socket) {
    console.log('A user connected');
    mqttClient.on('message', function mqttMessage(topic, payload) {
      const payloadString = payload.toString();
      if (topic === 'start') {
        socket.emit('start');
      } else if (topic === 'stop') {
        socket.emit('stop');
      } else if (topic === 'data') {
        mqttDataTopicHandler(socket, payloadString);
        if (process.env.HEROKU === undefined) {
          publicMqttClient.publish('data', payloadString);
        }
      } else if (
        topic === 'power_model/max_speed' ||
        topic === 'power_model/recommended_SP'
      ) {
        socket.emit('power-model-running');
      }
    });

    socket.on('start-power-model', () => {
      console.log('Start power model');
      mqttClient.publish('power_model/start', 'true');
    });

    socket.on('stop-power-model', () => {
      console.log('Stop power model');
      mqttClient.publish('power_model/stop', 'true');
    });

    socket.on('reset-calibration', () => {
      console.log('Reset calibration');
      mqttClient.publish('power_model/calibrate/reset', 'true');
    });

    socket.on('submit-calibration', calibratedDistance => {
      console.log('Calibrate distance');
      mqttClient.publish(
        'power_model/calibrate',
        `calibrate=${calibratedDistance}`,
      );
    });

    socket.on('create-power-plan', inputPowerPlan => {
      console.log(
        `Generated new power plan - ${inputPowerPlan.inputs.FileName}.pkl`,
      );
      mqttClient.publish(
        'power_model/generate_power_plan',
        JSON.stringify(inputPowerPlan),
      );
    });
  });
};

module.exports = sockets;
