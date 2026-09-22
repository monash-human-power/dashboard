const { validateTelemetry } = require('./telemetry-store');

function attachT2Telemetry(mqttClient, io, store) {
  const subscribe = () =>
    mqttClient.subscribe('t2/+/telemetry', { qos: 1 }, (error, granted) => {
      if (error || !granted || granted.some((entry) => entry.qos === 128)) {
        console.error(
          'Unable to subscribe to T2 telemetry:',
          error ? error.message : 'subscription rejected',
        );
      } else {
        console.log('Subscribed to T2 telemetry');
      }
    });
  mqttClient.on('connect', subscribe);
  mqttClient.on('message', (topic, payload) => {
    if (!/^t2\/[^/]+\/telemetry$/.test(topic)) return;
    let value;
    try {
      value = validateTelemetry(topic, payload);
    } catch (error) {
      console.error('Rejected T2 telemetry:', error.message);
      return;
    }
    // Broadcast saved event IDs so history/live overlap can be deduplicated.
    console.log('T2 telemetry received:', value);
    store.append(topic, payload).then((record) => {
      io.emit('t2-telemetry', record);
    }).catch((error) => {
      io.emit('t2-telemetry', value);
      console.error('Failed to save T2 telemetry:', error.message);
    });
  });
  if (mqttClient.connected) subscribe();
}

module.exports = attachT2Telemetry;
