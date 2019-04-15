const socket = io();

function resetDistance() {
    console.log('Reset distance');
    socket.emit('reset-calibration');
}