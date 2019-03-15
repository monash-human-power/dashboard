/*
 * Socket.io (Server-side)
 */
let sockets = {};

function mqttConnected() {
    console.log("Connected to mqtt broker");
}

function mqttDataTopicHandler(socket, payload) {
    let message ={};
    let dataArray = payload.split('&');
    for (let index = 0; index < dataArray.length; index++) {
        data = dataArray[index].split('=');
        message[data[0]] = data[1];
    }
    socket.emit('data', message);
}

sockets.init = function(server) {
    const mqtt = require('mqtt');
    const mqttOptions = {
        reconnectPeriod: 1000,
        connectTimeout: 5000,
      };
    const mqttClient = mqtt.connect('mqtt://localhost:1883', mqttOptions);
    mqttClient.subscribe('data');
    mqttClient.on('connect', mqttConnected);

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
                mqttDataTopicHandler(socket, payload);
            }
        });
    });
}

module.exports = sockets;
