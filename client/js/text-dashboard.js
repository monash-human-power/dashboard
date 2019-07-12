/* global io */
const socket = io();

function setSensorValue(elementId, value) {
  inputElement = document.getElementById(elementId);
  inputElement.innerHTML = value;
}

function setSensorValueVector(elementIdPrefix, valueX, valueY, valueZ) {
  inputElementX = document.getElementById(elementIdPrefix + "X");
  inputElementX.innerHTML = valueX;
  inputElementY = document.getElementById(elementIdPrefix + "Y");
  inputElementY.innerHTML = valueY;
  inputElementZ = document.getElementById(elementIdPrefix + "Z");
  inputElementZ.innerHTML = valueZ;
}


function dataHandler(inputData) {
  // Power
  setSensorValue('timeValue', inputData.time / 1000);
  setSensorValue('velocityValue', inputData.gps_speed);
  setSensorValue('powerValue', inputData.power);
  setSensorValue('cadenceValue', inputData.cadence);
  setSensorValueVector('gpsValue', inputData.gps_lat, inputData.gps_long, inputData.gps_alt);
  setSensorValueVector('accelerometerValue', inputData.aX, inputData.aY, inputData.aZ);
  setSensorValueVector('gyroscopeValue', inputData.gX, inputData.gY, inputData.gZ);
  setSensorValue('potentiometerValue', inputData.pot);
  setSensorValue('thermometerValue', inputData.thermoC);
}

socket.on('data', dataHandler);
