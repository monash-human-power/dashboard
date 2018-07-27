// Initialise server 
const express = require('express');
const app = express();
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');

// Set port to whatever the environment variable for PORT is, else use port 5000
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:true}));

// Start the server
var server = app.listen(PORT, () => {
	console.log("Example app listening at", server.address().port);
});

// Endpoint for main page
app.get('/', (req, res) => {
	// Send back the index.html document
	res.sendFile(path.join(__dirname + '/../client/index.html'));
});

// Endpoint to start recording data
app.post('/start', (req, res) => {
	var data = req.body;

	// Check if client sent the name of the file within the body of the POST request
	if (!data.filename) {
		console.error('Invalid request');
		res.status(400).send();
		return;
	}

	// TODO: Check filename is of valid format
	// should be data_YEAR_MONTH_DATE_HOUR_MIN
	// eg. 2018_07_25_17_07

	// Create csv file
	var filepath = 'data/' + data.filename + '.csv'

	// Check if file already exists
	if (fs.existsSync(filepath)) {
		console.error("File name exists");
		res.status(400).send("File name exists");
		return;
	}

	// Create an empty csv file (Open then close immediately)
	fs.open(filepath, 'a', (err, file_data) => {
		if (err) {
			console.error(err);
			res.status(400).send(err);
			return;
		}
		fs.close(file_data, (err) => {
			console.log(req.body);
			res.status(200).send("YES");
			res.end();
		});
	})
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

// Endpoint to upload data to server
app.post('/result', (req, res)=>{
	var data = req.body;
	console.log(data)
	res.status(200)
});

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