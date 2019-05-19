/* global io */
const socket = io();
// eslint-disable-next-line no-unused-vars
function resetDistance() {
  console.log('Reset distance');
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
  console.log(`Submit calibration distance: ${calibratedDistance}`);
  socket.emit('submit-calibration', calibratedDistance);
  document.getElementById('input-calibration').value = '';
  document.getElementById('invalid-distance-message').style.display = 'none';
  document.getElementById('valid-distance-message').style.display = 'block';
}
