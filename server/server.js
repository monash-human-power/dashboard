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
	// Send back the index.html document
	res.sendFile(path.join(__dirname + '/../client/index.html'));
});

// Endpoint to get the last result
app.get('/result', (req, res) => {
	output_result = {}
	output_result['result'] = ""
	res.send(output_result);
});

// Endpoint to upload data to server?
// app.post('/result', (req, res)=>{});

// Endpoint to get all results
app.get('/all_results', (req, res) => {
	output_result = {}
	output_result['result'] = []
	res.send(output_result);
});