# Monash Human Power - Data Acquisition System Web Server 

A web server for the Data Acquisition System (DAS) for Monash Human Power.

## Documentation
Base URL: http://das-web-server.herokuapp.com

|Endpoint|Method|Description|
|--------|------|-----------|
|/result|GET|Returns current sensor data|
|/result/all|GET|Returns all sensor data|

## Heroku Files
Files to remove once ported to a Raspberry Pi
Procfile - Can delete this if not using Heroku