// Initialise server
const express = require("express");
const app = express();
const server = require('http').Server(app);

var path = require("path");
const fs = require("fs");
var bodyParser = require("body-parser");

// csv file stuff
var csv = require("csv-write-stream");
const csv_headers = ["time", "gps_location" , "gps_course", "gps_speed", "gps_satellites", "aX", "aY", "aZ", "gX", "gY", "gZ", "thermoC", "thermoF", "pot", "power", "cadence"];

// Set port to whatever the environment variable for PORT is, else use port 5000
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', '/client')));

// Create a data folder if it is not created already
const dataDirectory = path.join(__dirname, "data");
if (!fs.existsSync(dataDirectory)) {
    console.log("data folder does not exist, creating folder...");
    fs.mkdirSync(dataDirectory);
}

/*
 *  Initialise socket.io
 */
const sockets = require(path.join(__dirname, "js", "sockets.js"));
sockets.init(server);


/*
 * Start the server
 */

server.listen(PORT, () => {
    console.log("Example app listening at", server.address().port);
});


/*
 * Server endpoints
 */

app.get("/", (req, res) => {
    // Send back the index.html document
    res.sendFile(path.join(__dirname + "/../client/index.html"));
});

// Endpoint to start recording data
app.post("/start", (req, res) => {
    var data = req.body;

    // Check if client sent the name of the file within the body of the POST request
    if (!data.filename) {
        console.error("Invalid request");
        res.status(400).send();
        return;
    }

    // TODO: Check filename is of valid format
    // should be data_YEAR_MONTH_DATE_HOUR_MIN
    // eg. data_2018_07_25_17_07

    // Create csv file
    var filepath = path.join(__dirname, "data/" + data.filename + ".csv");

    // Check if file already exists
    if (fs.existsSync(filepath)) {
        console.error("File name exists");
        res.status(400).send("File name exists");
        return;
    }

    // Create an empty csv file (Open then close immediately)	
    fs.writeFile(filepath, csv_headers.join(",") + "\n", (err) => {
        if (err) {
            console.error(err);
            res.status(400).send(err);
            return;
        }
        console.log("New file: " + filepath + " created");
        res.status(200).send("Start of new data entry");
    });
});

// Endpoint to get the last result from sensors
app.get("/result", (req, res) => {
    // Read json file
    var json_path = path.join(__dirname, "/data/sample_data_18_3_31_9_39.json");
    var contents = fs.readFileSync(json_path);
    var json_contents = JSON.parse(contents);

    /*
        TODO: REMOVE BELOW ONCE WE GET REAL DATA STORED
    */
    // Will return an entry based on the current time
    var number_of_items = json_contents.length;
    var date = new Date();
    var current_time = date.getTime();
    var seconds = Math.round(current_time/1000);
    var random_index = seconds % number_of_items;
    /*
        TODO: REMOVE ABOVE ONCE WE GET REAL DATA STORED
    */

    // Output data to correct format
    output_result = {}
    output_result["result"] = json_contents[random_index];
    res.send(output_result);
});

// Endpoint to upload data to server
app.post("/result", (req, res) => {
    // Get data from the body of the request
    var data = req.body;
    
    // Check if user sent all the required data to the server
    var body_keys = ["filename", "time", "gps", "aX", "aY", "aZ", "gX", "gY", "gZ", "thermoC", "thermoF", "pot", "power", "cadence"];
    for (var i = 0; i < body_keys.length; i++) {
        var current_key = body_keys[i]
        if (!(current_key in data)){
            console.error("Missing keys in POST request: " + current_key);
            res.status(400).send("Invalid data");
            return;
        }
    }

    // If GPS is enabled, check existence of GPS specific keys
    var gps_body_keys = ["gps_location", "gps_course", "gps_speed", "gps_satellites"];
    if (data["gps"] == "1") {
        for (var i = 0; i < gps_body_keys.length; i++) {
            var current_key = gps_body_keys[i];
            if (!(current_key in data)){
                console.error("Missing keys in POST request: " + current_key);
                res.status(400).send("Invalid data");
                return;
            }
        }
    } else if (data["gps"] == "0") {
        for (var i = 0; i < gps_body_keys.length; i++) {
            var current_key = gps_body_keys[i];
            data[current_key] = "";
        }
    }

    // If all keys are present, add data into csv file
    var filepath = path.join(__dirname,  "data/" + data.filename + ".csv");

    // Remove filename from the body of the data
    delete data["filename"];
    delete data["gps"];

    // Write to csv file
    var writer = csv({headers: csv_headers, sendHeaders : false });
    var writableStream = fs.createWriteStream(filepath, {"flags" : "a"});
    writer.pipe(writableStream);
    writer.write(data);
    writer.end();

    console.log(data);
    res.status(200).send("Data uploaded");
});

// Endpoint to get all results
app.get("/result/all", (req, res) => {
    // Read json file
    var json_path = path.join(__dirname, "/data/sample_data_18_3_30_9_52.json");
    var contents = fs.readFileSync(json_path);
    var json_contents = JSON.parse(contents);

    // Output data to correct format
    output_result = {};
    output_result["results"] = json_contents
    res.send(output_result);
});

// Endpoint to get a list of files stored on the server
app.get("/files", (req, res) => {
    console.log("Query files stored on server");
    var data_folder_path = path.join(__dirname, "/data");
    var file_array = [];
    var output_json = {"files":file_array};
    fs.readdir(data_folder_path, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error!');
        }
        if (files.length != 0) {
            files.forEach(file => {
              file_array.push(file);
            });
            output_json["files"] = file_array;
        }
        res.status(200).send(output_json);
      });
});

// Endpoint to download most recent file from server
app.get("/files/recent", (req, res) => {
    newest_filepath = getNewestFile();
    if (newest_filepath == null) {
        console.error("No files stored");
        res.status(404).send("No files stored");
    }
    res.download(newest_filepath, (err) => {
        if (err) {
            res.status(404).send("File not found");
        }
        console.log("Downloading most recent file: " + newest_filepath);
    });
});

// Endpoint to download file from server
app.get("/files/:filename", (req, res) => {
    var filename = req.params.filename;
    var filepath = path.join(__dirname, "/data/" + filename);
    res.download(filepath, (err) => {
        if (err) {
            res.status(404).send("File not found");
            return;
        }
        console.log("Downloading: " + filename);
    });
});

// Endpoint to delete file from server
app.delete('/files/:filename', (req, res) => {
	var filename = req.params.filename;
	var filepath = path.join(__dirname, '/data/' + filename);
	fs.unlink(filepath, (err) => {
		if (err) {
			res.status(404).send('File not found');
			return;
		}
		console.log('Deleting: ' + filepath);
	});
});

// Endpoint to tell client that the server is online
// This endpoint is here so that the client script (DAS.py) can continue to query an endpoint until the RPi is online
app.get("/server/status", (req, res) => {
    var output_json = {"status":"True"};
    res.status(200).send(output_json);
})

// Returns a date time string of the format YYYY_MM_DD_HH_MM_SS
function getDateTime(){
    var date = new Date();

    // Get date
    var year = date.getFullYear();
    var month = date.getMonth();
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    // Get time
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var minute = date.getMinutes();
    minute = (minute < 10 ? "0" : "") + minute;
    var seconds = date.getSeconds();
    seconds = (seconds < 10 ? "0" : "") + seconds;
    var milliseconds = date.getMilliseconds();

    output_string = year + "_" + month + "_" + day + "_" + hour + "_" + minute + "_" + seconds + "_" + milliseconds;
    return output_string
}

// Returns the newest file from the data folder
// Currently finds newest file in O(N) time complexity
function getNewestFile() {
    var data_filepath = path.join(__dirname, "data");
    var files = fs.readdirSync(data_filepath);

    // Check if there are no files stored
    if (files.length == 0) {
        return null;
    // Check if only one file stored
    } else if (files.length == 1) {
        if (path.extname(files[0]) != ".csv") {
            return null;
        }
        return path.join(data_filepath, files[0]);
    }

    var newest = null;
    for (var i = 0; i < files.length; i++) {
        // Check if the file is a csv file
        var current_file_name = files[i];
        if (path.extname(current_file_name) != ".csv") {
            continue;
        }

        if (newest == null) {
            newest = files[i];
            continue;
        }

        // Compare current file time with stored file time
        var current_file_time = fs.statSync(path.join(data_filepath, current_file_name)).mtime.getTime()
        var newest_file_time = fs.statSync(path.join(data_filepath, newest)).mtime.getTime()
        if (current_file_time > newest_file_time)
            newest = current_file_name;
    }

    if (newest == null) {
        return null;
    }
    return path.join(data_filepath, newest);
}