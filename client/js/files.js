/* eslint-env jquery */

// eslint-disable-next-line no-unused-vars
function deleteFile(e) {
  $('#deleteModal').modal('show');
  $('#modal-text').text(
    `Are you sure you want to delete ${e.parentNode.textContent.slice(0, -6)}?`,
  );
  $('#modalDeleteButton').click(() => {
    const fileEndpoint = e.parentNode.toString();
    // Delete file from server
    fetch(fileEndpoint, { method: 'DELETE' });
    // TODO: Alert to show that you've delete something?
    $('#deleteModal').modal('hide');
    e.parentNode.remove();
  });
  e.stopPropagation();
  e.preventDefault();
}

function loadFiles() {
  // Ask server for list of files
  fetch('/files')
    .then(response => {
      return response.json();
    })
    .then(result => {
      // Display list of files
      const { files } = result;
      // TODO: Account for no files found on the server
      for (let index = 0; index < files.length; index += 1) {
        $(
          `<a class='list-group-item list-group-item-action' href='/files/${files[index]}'>${files[index]}</a>`,
        )
          .appendTo($('#list-files'))
          .append(
            "<span class='btn btn-danger btn-sm float-right delete-button' onclick='deleteFile(this)'>Delete</span",
          );
      }
    });
}

// TODO: Server-side rendering of webpage
$(document).ready(loadFiles());
