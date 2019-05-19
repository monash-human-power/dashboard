/* global io,
  setupCadenceTimeChart,
  setupVelocityTimeChart,
  setupPowerTimeChart,
  addData,
  */
const socket = io();
let cadenceTimeChart = setupCadenceTimeChart();
let velocityTimeChart = setupVelocityTimeChart();
let powerTimeChart = setupPowerTimeChart();

let dataCount = 0;
let storedData = {};
let isInitialData = true;

function startHandler() {
  // eslint-disable-next-line no-console
  console.log('start');
  isInitialData = true;

  // Refresh graphs
  cadenceTimeChart.destroy();
  cadenceTimeChart = setupCadenceTimeChart();

  velocityTimeChart.destroy();
  velocityTimeChart = setupVelocityTimeChart();

  powerTimeChart.destroy();
  powerTimeChart = setupPowerTimeChart();
}

function updateGraphs() {
  // Do nothing if there is no data
  if (dataCount === 0) {
    return;
  }

  // Average data
  const data = {};
  const keys = Object.keys(storedData);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (key === 'filename') {
      data[key] = storedData[key];
    } else {
      data[key] = Number(storedData[key] / dataCount);
    }
  }

  // Reset variables
  dataCount = 0;
  storedData = {};

  // Show filename that is being written to
  document.getElementById('filenameText').innerHTML = data.filename;
  document.getElementById('filenameElement').style.display = 'block';

  const time = data.time / 1000;
  const cadenceData = {
    x: time,
    y: data.cadence,
  };
  addData(cadenceTimeChart, cadenceData);

  const velocityData = {
    x: time,
    y: data.gps_speed,
  };
  addData(velocityTimeChart, velocityData);

  const powerData = {
    x: time,
    y: data.power,
  };
  addData(powerTimeChart, powerData);
}
setInterval(updateGraphs, 1000);

function dataHandler(inputData) {
  dataCount += 1;
  const keys = Object.keys(inputData);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (key === 'filename') {
      storedData[key] = inputData[key];
    } else if (Object.prototype.hasOwnProperty.call(storedData, key)) {
      storedData[key] += Number(inputData[key]);
    } else {
      storedData[key] = Number(inputData[key]);
    }
  }
  if (isInitialData) {
    isInitialData = false;
    updateGraphs();
  }
}

function stopHandler() {
  // eslint-disable-next-line no-console
  console.log('stop');
}

socket.on('start', startHandler);
socket.on('data', dataHandler);
socket.on('stop', stopHandler);
