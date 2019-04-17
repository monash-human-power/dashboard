const socket = io();

function startPowerModel() {
    console.log('Starting power model');
    socket.emit('start-power-model');
}

function stopPowerModel() {
    console.log('Stopping power model');
    socket.emit('stop-power-model');
}