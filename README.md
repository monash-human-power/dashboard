# Monash Human Power - Data Acquisition System Web Server 

A web server for the Data Acquisition System (DAS) for Monash Human Power.

## Getting Started
After you clone the repository, make sure you run `npm install` to install all of the necessary libraries for node.js

## Documentation
Base URL: http://das-web-server.herokuapp.com

|Endpoint|Method|Description|
|--------|------|-----------|
|/result|GET|Returns current sensor data|
|/result/all|GET|Returns all sensor data|

## Heroku Files
Files to remove once ported to a Raspberry Pi
Procfile - Can delete this if not using Heroku