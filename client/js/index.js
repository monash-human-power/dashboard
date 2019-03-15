var socket = io();

function startHandler() {
    console.log('start');
}

function dataHandler(data) {
    console.log(data);
}

function stopHandler() {
    console.log('stop');
}

socket.on('start', startHandler);
socket.on('data', dataHandler);
socket.on('stop', stopHandler);