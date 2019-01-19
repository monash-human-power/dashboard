// Ask server for list of files
fetch('/files')
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        // Display list of files
        console.log(result);
        let files = result.files;
        for(let index=0; index<files.length; index++){
                $("#list-files")
                .append("<a class='list-group-item list-group-item-action' href='/files/" + files[index] + "'>" + files[index] + "</a>");
        }
    })