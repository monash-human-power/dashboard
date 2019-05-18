const socket = io();

// TODO: Prevent users from spamming the start/stop buttons
// TODO: Check if power model is already running
function startPowerModel() {
  console.log('Starting power model');
  socket.emit('start-power-model');
  document.getElementById('start-button').disabled = true;
  document.getElementById('status-success').style.display = 'block';
  document.getElementById('status-success-message').innerHTML =
    'Started power model!';
}

function stopPowerModel() {
  console.log('Stopping power model');
  socket.emit('stop-power-model');
  document.getElementById('start-button').disabled = false;
  document.getElementById('status-success').style.display = 'block';
  document.getElementById('status-success-message').innerHTML =
    'Stopping power model!';
}

socket.on('power-model-running', function() {
  console.log('Power model running');
  // Disable start button if power model is currently running
  document.getElementById('start-button').disabled = true;
});
