/*
 * Socket.io (Server-side)
 */
require('dotenv').config();

const sockets = {};
const mqtt = require('mqtt');
const os = require('os');

const { DAS, BOOST, Camera, WirelessModule, V3 } = require('mhp');
const { getPropWithPath, setPropWithPath } = require('./util');

// Public MQTT broker
let PUBLISH_ONLINE = false;
let PUBLIC_MQTT_CLIENT;

// TODO: Add this to the topics.yml file in 'mhp' package
Camera["base"] = "camera";

/**
 * Structure can be found in the MQTT V3 Topics page on Notion
 */
const retained = {
  status: {},
  camera: {},
  wireless_module: {
    1: { online: null },
    2: { online: null },
    3: { online: null },
    4: { online: null },
    5: { online: null },
  },
  boost: {
    configs: null,
    results: null,
  },
  max_speed_achieved: null,
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
          const device = topicString[3] ?? '';
          // if there is a third part to the component
          const channel = device
            ? `status-${component}-${subcomponent}-${device}`
            : `status-${component}-${subcomponent}`;
          const retainedStatus = device
            ? retained.status?.[component]?.[subcomponent]?.[device]
            : retained.status?.[component]?.[subcomponent];
          socket.emit(channel, retainedStatus);
        } catch (e) {
          console.error(
            `Error in parsing received payload\n\ttopic: ${topic}\n\tpayload: ${payloadString}\n`,
          );
        }
      } else if (topic.startsWith(WirelessModule.base)) {
        // Emit on appropriate channel
        try {
          const topicString = topic.split('/').slice(1); // Remove leading ""
          const [, , id, property] = topicString;
          // topicString: ["v3", "wireless_module", <id>, <property>]
          const value = JSON.parse(payloadString);
          const path = topicString.slice(1); // Path is from "wireless_module"
          // Module's online
          if (property === 'start') {
            socket.emit(`wireless_module-${id}-start`, true);
          }
          else if (property === 'stop') {
            socket.emit(`wireless_module-${id}-stop`, true);
          }
          // Module's offline
          // change to make it look at the status topic of WM
          else if (property === 'status') {
            retained[path[0]][id].online = value['online'];
            socket.emit(`wireless_module-${id}-online`, value['online']);
          }

          // Add to global
          else {
            retained[path[0]] = setPropWithPath(
              retained[path[0]],
              path.slice(1),
              value,
            );

            // Emit parsed payload as is
            socket.emit(`wireless_module-${id}-${property}`, value);

          }
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
          case V3.start:
            const msg = JSON.parse(payload);
            if (msg.start){
                [1, 2, 3, 4, 5].forEach((id) =>
                socket.emit(`wireless_module-${id}-start`, true),
              );
              }
            else{
              [1, 2, 3, 4, 5].forEach((id) =>
                socket.emit(`wireless_module-${id}-stop`, true),
              );
            }
            break;

          // V2 data channel
          case DAS.data:
            mqttDataTopicHandler(socket, payloadString);
            if (sendToPublicMQTTBroker()) {
              PUBLIC_MQTT_CLIENT.publish(DAS.data, payloadString);
            }
            break;
          case BOOST.predicted_max_speed:
            // FIXME: Not sure why we send this currently?
            socket.emit('boost-running');
            socket.emit(BOOST.predicted_max_speed, JSON.parse(payloadString));
            break;
          case BOOST.max_speed_achieved:
            const max_speed = payloadString ? JSON.parse(payloadString)["speed"] : null;
            retained.max_speed_achieved = max_speed;
            socket.emit(BOOST.max_speed_achieved, max_speed);
            break;
          case BOOST.recommended_sp:
            socket.emit('boost-running');
            socket.emit(BOOST.recommended_sp, JSON.parse(payloadString));
            break;
          case BOOST.prev_trap_speed:
            socket.emit('boost_running');
            socket.emit(BOOST.prev_trap_speed, JSON.parse(payloadString));
            break;
          case BOOST.configs:
            retained.boost.configs = payloadString;
            socket.emit('boost/configs', payloadString);
            break;
          case BOOST.generate_complete:
            retained.boost.results = payloadString;
            socket.emit('boost/generate_complete', payloadString);
            break;
          case Camera.push_overlays:
            socket.emit('push-overlays', payloadString);
            break;
          case 'lap/topic':
            socket.emit('lap-recieved');
            break;
          default:
            console.error(`Unhandled topic - ${topic}`);
            break;
        }
      }
    });

    // Subscribe to topics after defining the 'on' method to ensure we catch any message sent immediately upon subscribing (e.g. retained messages)
    mqttClient.subscribe(DAS.start);
    mqttClient.subscribe(DAS.stop);
    mqttClient.subscribe(V3.start);
    mqttClient.subscribe(DAS.data);
    mqttClient.subscribe(WirelessModule.all().module);
    mqttClient.subscribe(BOOST.prev_trap_speed);
    mqttClient.subscribe(BOOST.predicted_max_speed);
    mqttClient.subscribe(BOOST.max_speed_achieved);
    mqttClient.subscribe(BOOST.generate_complete);
    mqttClient.subscribe(BOOST.recommended_sp);
    mqttClient.subscribe(BOOST.configs);
    mqttClient.subscribe(Camera.push_overlays);
    mqttClient.subscribe(`${Camera.base}/#`);
    mqttClient.subscribe('status/#');
    mqttClient.subscribe('trike/lap/trigger');
    // TODO: Remove in refactor, kept here for backwards compatability
    socket.on('get-status-payload', (path) => {
      if (path instanceof Array && path.length > 0)
        socket.emit(
          `status-${path.join('-')}`,
          getPropWithPath(retained.status, path),
        );
    });
    // for wireless-module
    socket.on('get-payload', (path) => {
      if (path instanceof Array && path.length > 0)
        socket.emit(path.join('-'), getPropWithPath(retained, path));
    });
    socket.on('get-max-speed-achieved', (path) => {
      if (retained.max_speed_achieved) socket.emit(path, retained.max_speed_achieved);
    })

    socket.on('get-boost-configs', (path) => {
      if (retained.boost.configs) socket.emit(path, retained.boost.configs);
    });

    socket.on('get-boost-results', (path) => {
      if (retained.boost.results) socket.emit(path, retained.boost.results);
    });

    // TODO: Fix up below socket.io handlers
    socket.on('start-boost', () => {
      mqttClient.publish(BOOST.start);
    });

    socket.on('stop-boost', () => {
      mqttClient.publish(BOOST.stop);
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

    socket.on('flip-video-feed', (device) => {
      // device is the name of the camera system, i.e. primary/secondary
      mqttClient.publish(`${Camera.flip_video_feed}/${device}`);
    });

    socket.on('start-das-recording', () => {
      [1, 2, 3, 4, 5].forEach((n) =>
        mqttClient.publish(WirelessModule.id(n).start),
      );
    });

    socket.on('stop-das-recording', () => {
      [1, 2, 3, 4, 5].forEach((n) =>
        mqttClient.publish(WirelessModule.id(n).stop),
      );
    });
    
    socket.on('start-V3', ()=>{
      mqttClient.publish(V3.start, JSON.stringify({"start": true}));      
    })

    socket.on('stop-V3', ()=>{
      mqttClient.publish(V3.start, JSON.stringify({"start": false}));
    })

    socket.on('lap-send', () => {
      mqttClient.publish('trike/lap/trigger', 'lap'); 
    });

  });
};

module.exports = sockets;
