# Monash Human Power - Data Acquisition System Web Server 

A web server for the Data Acquisition System (DAS) for Monash Human Power.

## Getting Started
After you clone the repository, make sure you run `npm install` to install all of the necessary libraries for node.js

## Documentation
Base URL: http://das-web-server.herokuapp.com

|Endpoint|Method|Body|Description|
|--------|------|----|-----------|
|/start|POST|{"filename" : *data_YYYY_MM_DD_HH_MM_SS* }|Notify server that a new data recording session has started|
|/result|GET||Returns current sensor data|
|/result|POST|TODO|Data to be stored within the specified csv file|
|/result/all|GET||Returns all sensor data|
|/files|GET||Returns an array of files that are stored on the server|
|/files/recent|GET||Download most recent file edited from server|
|/files/*filename*|GET||Download specified file from server|
|/files/*filename*|DELETE||Delete specified file from server|
|/server/status|GET||Status of the server|

## Heroku Files
Files to remove once ported to a Raspberry Pi
Procfile - Can delete this if not using Heroku