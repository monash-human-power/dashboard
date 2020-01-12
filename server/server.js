// Initialise server
const express = require('express');

const app = express();
const server = require('http').Server(app);

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// Set port to whatever the environment variable for PORT is, else use port 5000
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Create a data folder if it is not created already
const dataDirectory = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirectory)) {
  console.log('data folder does not exist, creating folder...');
  fs.mkdirSync(dataDirectory);
}

/*
 *  Initialise socket.io
 */
// eslint-disable-next-line import/no-dynamic-require
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

// Endpoint to get a list of files stored on the server
app.get('/files', (req, res) => {
  const dataFolderPath = path.join(__dirname, '/data');
  const fileArray = [];
  const outputJson = { files: fileArray };
  fs.readdir(dataFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error!');
    }
    if (files.length !== 0) {
      files.forEach(file => {
        fileArray.push(file);
      });
      outputJson.files = fileArray;
    }
    res.status(200).send(outputJson);
  });
});

// Endpoint to download file from server
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, `/data/${filename}`);
  res.download(filepath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Endpoint to delete file from server
app.delete('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, `/data/${filename}`);
  fs.unlink(filepath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
    res.status(200).send();
  });
});

// Endpoint to tell client that the server is online
// This endpoint is here so that the client script (DAS.py) can continue to query an endpoint until the RPi is online
app.get('/server/status', (req, res) => {
  const outputJson = { status: 'True' };
  res.status(200).send(outputJson);
});

app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
