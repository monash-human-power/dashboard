/*
 * Socket.io (Server-side)
 */
let sockets = {};

function publicMqttConnected() {
    console.log('Connected to public mqtt broker');
}

function mqttConnected() {
    console.log('Connected to mqtt broker');
}

function mqttDataTopicHandler(socket, payload) {
    // Parse data
    let message ={};
    let dataArray = payload.split('&');
    for (let index = 0; index < dataArray.length; index++) {
        data = dataArray[index].split('=');
        // No need to average filename value
        if (data[0] === 'filename') {
            message[data[0]] = data[1];
        } else {
            message[data[0]] = Number(data[1]);
        }
    }
    socket.emit('data', message);
    return message;
}

sockets.init = function(server) {
    const mqtt = require('mqtt');
    const mqttOptions = {
        reconnectPeriod: 1000,
        connectTimeout: 5000,
        clientId: 'mqttClient',
      };
    const mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOptions);
    mqttClient.subscribe('start');
    mqttClient.subscribe('stop');
    mqttClient.subscribe('data');
    mqttClient.on('connect', mqttConnected);

    const publicMqttOptions = {
        reconnectPeriod: 1000,
        connectTimeout: 5000,
        clientId: 'publicMqttClient',
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
    };
    const publicMqttClient = mqtt.connect('mqtt://m16.cloudmqtt.com:10421', publicMqttOptions);
    publicMqttClient.on('connect', publicMqttConnected);

    const io = require('socket.io').listen(server);
    io.on('connection', function(socket){
        console.log('A user connected');
        mqttClient.on('message', function(topic, payload) {
            payload = payload.toString();
            if (topic == 'start') {
                socket.emit('start');
            } else if (topic == 'stop') {
                socket.emit('stop');
            } else if (topic == 'data') {
                let message = mqttDataTopicHandler(socket, payload);
                publicMqttClient.publish('data', message.toString());
            }
        });

        socket.on('reset-calibration', () => {
            console.log('Reset calibration');
            mqttClient.publish('power_model/calibrate/reset', 'true');
        });

        socket.on('submit-calibration', (calibratedDistance) => {
            console.log('Calibrate distance');
            mqttClient.publish('power_model/calibrate', 'calibrate=' + calibratedDistance);
        })
    });
}

module.exports = sockets;
