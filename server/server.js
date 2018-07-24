// Initialise server 
const express = require('express');
const app = express();
var path = require('path');
const fs = require('fs');

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

// Endpoint to get the last result from sensors
app.get('/result', (req, res) => {
	// Read json file
	var json_path = path.join(__dirname, '/data/sample_data_18_3_31_9_39.json')
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
	output_result['result'] = json_contents[random_index];
	res.send(output_result);
});

// Endpoint to upload data to server?
// app.post('/result', (req, res)=>{});

// Endpoint to get all results
app.get('/result/all', (req, res) => {
	// Read json file
	var json_path = path.join(__dirname, '/data/sample_data_18_3_30_9_52.json')
	var contents = fs.readFileSync(json_path);
	var json_contents = JSON.parse(contents);

	// Output data to correct format
	output_result = {}
	output_result['results'] = json_contents
	res.send(output_result);
});