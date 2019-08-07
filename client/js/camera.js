/* global io, $ */
const socket = io();

function pushOverlayHandler(data) {
  const json = JSON.parse(data);
  const { device, activeOverlay, overlays } = json;

  let radioButtonHtml = '';
  overlays.forEach(overlay => {
    const checkedString = activeOverlay === overlay.file ? 'checked' : '';
    radioButtonHtml += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="${device}-overlay" id="${device}-${overlay}" value="${overlay}" ${checkedString}>
        <label class="form-check-label" for="${device}-${overlay}">${overlay}</label>
      </div>
    `;
  });

  $(`div#${device}-overlay`).html(radioButtonHtml);
  $('h6#overlay-loading').addClass('d-none');
  $('div#overlay-form').removeClass('d-none');
}
socket.on('push-overlays', pushOverlayHandler);
socket.emit('get-overlays');

function hideSaveIndicator() {
  $('p#overlay-save-indicator').addClass('d-none');
}

// eslint-disable-next-line no-unused-vars
function setOverlays() {
  socket.emit(
    'set-overlays',
    JSON.stringify({
      primary: $('input[name=primary-overlay]:checked').val(),
      secondary: $('input[name=secondary-overlay]:checked').val(),
    }),
  );
  $('p#overlay-save-indicator').removeClass('d-none');
  setTimeout(hideSaveIndicator, 5000);
}
