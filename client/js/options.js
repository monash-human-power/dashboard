/* global io */
const socket = io();

// eslint-disable-next-line no-unused-vars
function turnOnPublishData() {
  socket.emit('publish-data-on');
}

// eslint-disable-next-line no-unused-vars
function turnOffPublishData() {
  socket.emit('publish-data-off');
}
