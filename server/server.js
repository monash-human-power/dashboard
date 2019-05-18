// Initialise server
const express = require('express');

const app = express();
const server = require('http').Server(app);

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// csv file stuff
const csv = require('csv-write-stream');

const csv_headers = [
  'time',
  'gps_location',
  'gps_course',
  'gps_speed',
  'gps_satellites',
  'aX',
  'aY',
  'aZ',
  'gX',
  'gY',
  'gZ',
  'thermoC',
  'thermoF',
  'pot',
  'power',
  'cadence',
];

// Set port to whatever the environment variable for PORT is, else use port 5000
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', '/client')));

// Create a data folder if it is not created already
const dataDirectory = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirectory)) {
  console.log('data folder does not exist, creating folder...');
  fs.mkdirSync(dataDirectory);
}

/*
 *  Initialise socket.io
 */
const sockets = require(path.join(__dirname, 'js', 'sockets.js'));
sockets.init(server);

/*
 * Start the server
 */

server.listen(PORT, () => {
  console.log('Example app listening at', server.address().port);
});

/*
 * Server endpoints
 */

app.get('/', (req, res) => {
  // Send back the index.html document
  res.sendFile(path.join(`${__dirname}/../client/index.html`));
});

// Endpoint to get a list of files stored on the server
app.get('/files', (req, res) => {
  console.log('Query files stored on server');
  const data_folder_path = path.join(__dirname, '/data');
  const file_array = [];
  const output_json = { files: file_array };
  fs.readdir(data_folder_path, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error!');
    }
    if (files.length != 0) {
      files.forEach(file => {
        file_array.push(file);
      });
      output_json.files = file_array;
    }
    res.status(200).send(output_json);
  });
});

// Endpoint to download most recent file from server
// FIXME: The getNewestFile function does not work
app.get('/files/recent', (req, res) => {
  newest_filepath = getNewestFile();
  if (newest_filepath == null) {
    console.error('No files stored');
    res.status(404).send('No files stored');
  }
  res.download(newest_filepath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
    console.log(`Downloading most recent file: ${newest_filepath}`);
  });
});

// Endpoint to download file from server
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, `/data/${filename}`);
  res.download(filepath, err => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    console.log(`Downloading: ${filename}`);
  });
});

// Endpoint to delete file from server
app.delete('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, `/data/${filename}`);
  fs.unlink(filepath, err => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }
    console.log(`Deleting: ${filepath}`);
  });
});

// Endpoint to tell client that the server is online
// This endpoint is here so that the client script (DAS.py) can continue to query an endpoint until the RPi is online
app.get('/server/status', (req, res) => {
  const output_json = { status: 'True' };
  res.status(200).send(output_json);
});

// Returns a date time string of the format YYYY_MM_DD_HH_MM_SS
function getDateTime() {
  const date = new Date();

  // Get date
  const year = date.getFullYear();
  let month = date.getMonth();
  month = (month < 10 ? '0' : '') + month;
  let day = date.getDate();
  day = (day < 10 ? '0' : '') + day;

  // Get time
  let hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;
  let minute = date.getMinutes();
  minute = (minute < 10 ? '0' : '') + minute;
  let seconds = date.getSeconds();
  seconds = (seconds < 10 ? '0' : '') + seconds;
  const milliseconds = date.getMilliseconds();

  output_string = `${year}_${month}_${day}_${hour}_${minute}_${seconds}_${milliseconds}`;
  return output_string;
}

// Returns the newest file from the data folder
// Currently finds newest file in O(N) time complexity
function getNewestFile() {
  const data_filepath = path.join(__dirname, 'data');
  const files = fs.readdirSync(data_filepath);

  // Check if there are no files stored
  if (files.length == 0) {
    return null;
    // Check if only one file stored
  }
  if (files.length == 1) {
    if (path.extname(files[0]) != '.csv') {
      return null;
    }
    return path.join(data_filepath, files[0]);
  }

  let newest = null;
  for (let i = 0; i < files.length; i++) {
    // Check if the file is a csv file
    const current_file_name = files[i];
    if (path.extname(current_file_name) != '.csv') {
      continue;
    }

    if (newest == null) {
      newest = files[i];
      continue;
    }

    // Compare current file time with stored file time
    const current_file_time = fs
      .statSync(path.join(data_filepath, current_file_name))
      .mtime.getTime();
    const newest_file_time = fs
      .statSync(path.join(data_filepath, newest))
      .mtime.getTime();
    if (current_file_time > newest_file_time) newest = current_file_name;
  }

  if (newest == null) {
    return null;
  }
  return path.join(data_filepath, newest);
}
