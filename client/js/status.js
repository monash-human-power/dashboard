const socket = io();

function turnOffStatus(inputElement) {
    inputElement.innerHTML = 'OFF';
    inputElement.classList.remove('badge-success');
    inputElement.classList.add('badge-danger');
}
function turnOnStatus(inputElement) {
    inputElement.innerHTML = 'ON';
    inputElement.classList.remove('badge-danger');
    inputElement.classList.add('badge-success');
}

function dataHandler(inputData) {
    console.log(inputData)
    // GPS
    let gpsStatusElement = document.getElementById('gpsStatus');
    if (inputData.gps == 0) {
        turnOffStatus(gpsStatusElement);
    } else {
        turnOnStatus(gpsStatusElement);
    }

    // Power
    let powerStatusElement = document.getElementById('powerStatus');
    if (inputData.power == 0) {
        turnOffStatus(powerStatusElement);
    } else {
        turnOnStatus(powerStatusElement);
    }

    // Cadence
    let cadenceStatusElement = document.getElementById('cadenceStatus');
    if (inputData.cadence == 0) {
        turnOffStatus(cadenceStatusElement);
    } else {
        turnOnStatus(cadenceStatusElement);
    }

    // Reed
    let reedStatusElement = document.getElementById('reedStatus');
    if ((inputData.reed_velocity == 0) || (inputData.reed_distance == 0)) {
        turnOffStatus(reedStatusElement);
    } else {
        turnOnStatus(reedStatusElement);
    }

    // Accelerometer
    let accelerometerStatusElement = document.getElementById('accelerometerStatus');
    // Check if all axis exhibit zeros
    if ((inputData.aX == 0) && (inputData.aY == 0) && (inputData.aZ == 0)) {
        turnOffStatus(accelerometerStatusElement);
    } else {
        turnOnStatus(accelerometerStatusElement);
    }

    // Gyroscope
    let gyroscopeStatusElement = document.getElementById('gyroscopeStatus');
    if ((inputData.gX == 0) && (inputData.gY == 0) && (inputData.gZ == 0)) {
        turnOffStatus(gyroscopeStatusElement);
    } else {
        turnOnStatus(gyroscopeStatusElement);
    }

    // Potentiometer
    let potentiometerStatusElement = document.getElementById('potentiometerStatus');
    if (inputData.pot == 0) {
        turnOffStatus(potentiometerStatusElement);
    } else {
        turnOnStatus(potentiometerStatusElement);
    }

    // Thermometer
    let thermometerStatusElement = document.getElementById('thermometerStatus');
    if (inputData.thermoC == 0) {
        turnOffStatus(thermometerStatusElement);
    } else {
        turnOnStatus(thermometerStatusElement);
    }
}

function stopHandler() {
    console.log('stop');
}
socket.on('data', dataHandler);
socket.on('stop', stopHandler);