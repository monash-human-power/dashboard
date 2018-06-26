// Initialise server 
const express = require('express');
const app = express();
var path = require('path');

// Set port to whatever the environment variable for PORT is, else use port 5000
const PORT = process.env.PORT || 5000;

// Start the server
var server = app.listen(PORT, () => {
	console.log("Example app listening at", server.address().port);
});

// Endpoint for main page
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../client/index.html'));
});