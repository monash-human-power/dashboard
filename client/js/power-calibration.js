/* global io */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const socket = io();
// eslint-disable-next-line no-unused-vars
function resetDistance() {
  socket.emit('reset-calibration');
}

// eslint-disable-next-line no-unused-vars
function submitActualDistance() {
  const calibratedDistance = document.getElementById('input-calibration').value;
  if (calibratedDistance < 0 || calibratedDistance === '') {
    console.error('Invalid distance');
    document.getElementById('invalid-distance-message').style.display = 'block';
    document.getElementById('valid-distance-message').style.display = 'none';
    return;
  }

  socket.emit('submit-calibration', calibratedDistance);
  document.getElementById('input-calibration').value = '';
  document.getElementById('invalid-distance-message').style.display = 'none';
  document.getElementById('valid-distance-message').style.display = 'block';
}
