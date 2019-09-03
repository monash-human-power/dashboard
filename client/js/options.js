/* global io,
  $
  */
const socket = io();

// Get DAS web server settings
socket.emit('get-server-settings');

socket.on('server-settings', settings => {
  switch (settings.publishOnline) {
    case true:
      $('#turnOnPublishDatabutton').click();
      break;
    case false:
      $('#turnOffPublishDatabutton').click();
      break;
    default:
      console.error(
        `Unhandled publish online setting: ${settings.publishOnline}`,
      );
  }
});
// eslint-disable-next-line no-unused-vars
function turnOnPublishData() {
  socket.emit('publish-data-on');
}

// eslint-disable-next-line no-unused-vars
function turnOffPublishData() {
  socket.emit('publish-data-off');
}
