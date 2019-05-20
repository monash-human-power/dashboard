/* global io */
const socket = io();

// TODO: Prevent users from spamming the start/stop buttons
// TODO: Check if power model is already running
// eslint-disable-next-line no-unused-vars
function startPowerModel() {
  socket.emit('start-power-model');
  document.getElementById('start-button').disabled = true;
  document.getElementById('status-success').style.display = 'block';
  document.getElementById('status-success-message').innerHTML =
    'Started power model!';
}

// eslint-disable-next-line no-unused-vars
function stopPowerModel() {
  socket.emit('stop-power-model');
  document.getElementById('start-button').disabled = false;
  document.getElementById('status-success').style.display = 'block';
  document.getElementById('status-success-message').innerHTML =
    'Stopping power model!';
}

socket.on('power-model-running', function runPowerModel() {
  // Disable start button if power model is currently running
  document.getElementById('start-button').disabled = true;
});
