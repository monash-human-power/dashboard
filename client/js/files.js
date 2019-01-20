function deleteFile(e) {
    $("#deleteModal").modal('show');
    $("#modal-text").text("Are you sure you want to delete " + e.parentNode.textContent.slice(0,-6) + "?");
    $("#modalDeleteButton").click(() => {
        let fileEndpoint = e.parentNode.toString();
        // Delete file from server
        fetch(fileEndpoint, { method: "DELETE"});
        // TODO: Alert to show that you've delete something?
        $("#deleteModal").modal('hide');
        e.parentNode.remove();
    })
    event.stopPropagation();
    event.preventDefault();
}

function loadFiles(){
    // Ask server for list of files
    fetch('/files')
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // Display list of files
        let files = result.files;
        for(let index=0; index<files.length; index++){
            $("<a class='list-group-item list-group-item-action' href='/files/" + files[index] + "'>" + files[index] + "</a>")
                .appendTo($("#list-files"))
                .append("<span class='btn btn-danger btn-sm float-right delete-button' onclick='deleteFile(this)'>Delete</span")
        }
    })
}

$( document ).ready(function() {
    loadFiles();
});