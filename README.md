# Monash Human Power - Data Acquisition System Web Server
[![Build Status](https://www.travis-ci.org/Monash-Human-Power/MHP-DAS-Web-Server.svg?branch=master)](https://www.travis-ci.org/Monash-Human-Power/MHP-DAS-Web-Server)

A web server for the Data Acquisition System (DAS) for Monash Human Power.

The node.js + Express HTTP REST server is used to host the real-time dashboard whilst the MQTT broker is used to transfer data from the sensors to all the necessary scripts that need it.

## Getting Started
You will need to set up `MQTT_USERNAME` and `MQTT_PASSWORD` environment variables. Credentials can be found on the google drive.

1. `npm install` to install all dependencies and libraries
2. `npm run build` when it's your first time running the application
3. `npm run start` to start the server

## Documentation
|Endpoint|Method|Body|Description|
|--------|------|----|-----------|
|/files|GET||Returns an array of files that are stored on the server|
|/files/recent|GET||Download most recent file edited from server|
|/files/*filename*|GET||Download specified file from server|
|/files/*filename*|DELETE||Delete specified file from server|
|/server/status|GET||Status of the server|

## TODO

- [ ] Add Map display
- [ ] Add power model graph/output
- [ ] Options page that saves options to browser storage
