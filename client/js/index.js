const socket = io();
const cadenceTimeChart = setupCadenceTimeChart();
const velocityTimeChart = setupVelocityTimeChart();
const powerTimeChart = setupPowerTimeChart();

function startHandler() {
    console.log('start');
}

function dataHandler(data) {
    console.log(data);
    // Show filename that is being written to
    document.getElementById('filenameText').innerHTML = data.filename;
    document.getElementById('filenameElement').style.display = 'block';

    const time = data.time / 1000
    const cadenceData = {
        x: time,
        y: data.cadence
    };
    addData(cadenceTimeChart, cadenceData);

    const velocityData = {
        x: time,
        y: data.gps_speed
    }
    addData(velocityTimeChart, velocityData);
    
    const powerData = {
        x: time,
        y: data.power
    }
    addData(powerTimeChart, powerData);
}

function stopHandler() {
    console.log('stop');
}

socket.on('start', startHandler);
socket.on('data', dataHandler);
socket.on('stop', stopHandler);
