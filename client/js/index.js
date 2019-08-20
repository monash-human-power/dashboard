/* global io,
  setupCadenceTimeChart,
  setupVelocityTimeChart,
  setupPowerTimeChart,
  addData,
  ol,
  */
const socket = io();
let cadenceTimeChart = setupCadenceTimeChart();
let velocityTimeChart = setupVelocityTimeChart();
let powerTimeChart = setupPowerTimeChart();

let dataCount = 0;
let storedData = {};
let isInitialData = true;

let mapVectorSource;
const bikePath = new ol.geom.LineString([]);
const bikePositionFeature = new ol.Feature({ type: 'point' });

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

function updateFigures() {
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

  // Update map
  if (data.gps_long !== undefined && data.gps_lat !== undefined) {
    bikePositionFeature.setGeometry(
      new ol.geom.Point(ol.proj.fromLonLat([data.gps_long, data.gps_lat])),
    );
    bikePath.appendCoordinate(
      ol.proj.fromLonLat([data.gps_long, data.gps_lat]),
    );
  }
}
setInterval(updateFigures, 1000);

// Set the value of a sensor
function setSensorValue(elementId, value, decimalPlaces = -1) {
  const inputElement = document.getElementById(elementId);
  if (decimalPlaces === -1) inputElement.innerHTML = value;
  else inputElement.innerHTML = Number(value).toFixed(decimalPlaces);
}

// Set the value of a sensor with 3 components - e.g. accelerometer
// Appends X, Y, and Z to the supplied element ID
function setSensorValueVector(
  elementIdPrefix,
  valueX,
  valueY,
  valueZ,
  decimalPlaces = -1,
) {
  setSensorValue(`${elementIdPrefix}X`, valueX, decimalPlaces);
  setSensorValue(`${elementIdPrefix}Y`, valueY, decimalPlaces);
  setSensorValue(`${elementIdPrefix}Z`, valueZ, decimalPlaces);
}

function dataHandler(inputData) {
  // Update graphs
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
    updateFigures();
  }

  // Update text mode
  setSensorValue('timeValue', inputData.time / 1000, 0);
  setSensorValue('velocityValue', inputData.gps_speed, 2);
  setSensorValue('powerValue', inputData.power);
  setSensorValue('cadenceValue', inputData.cadence);
  setSensorValueVector(
    'gpsValue',
    inputData.gps_lat,
    inputData.gps_long,
    inputData.gps_alt,
  );
  setSensorValueVector(
    'accelerometerValue',
    inputData.aX,
    inputData.aY,
    inputData.aZ,
    2,
  );
  setSensorValueVector(
    'gyroscopeValue',
    inputData.gX,
    inputData.gY,
    inputData.gZ,
    1,
  );
  setSensorValue('potentiometerValue', inputData.pot);
  setSensorValue('thermometerValue', inputData.thermoC, 1);
}

function stopHandler() {
  // eslint-disable-next-line no-console
  console.log('stop');
}

socket.on('start', startHandler);
socket.on('data', dataHandler);
socket.on('stop', stopHandler);

function updateTextMode() {
  const textDiv = document.getElementById('textDiv');
  const chartDiv = document.getElementById('chartDiv');
  if (document.getElementById('textModeToggle').checked) {
    chartDiv.classList.add('d-none');
    textDiv.classList.remove('d-none');
  } else {
    chartDiv.classList.remove('d-none');
    textDiv.classList.add('d-none');
  }
}
updateTextMode(); // State of switch is kept after refresh, so check on page load

function setupMap() {
  // .nav-link.active from common.css
  const highlightColor = '#007bff';
  const styles = {
    point: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: highlightColor }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }),
    path: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: highlightColor,
        width: 4,
      }),
    }),
  };

  const bikePathFeature = new ol.Feature({ type: 'path', geometry: bikePath });

  const mapSource = new ol.source.OSM();
  const mapLayer = new ol.layer.Tile({ source: mapSource });

  mapVectorSource = new ol.source.Vector({
    features: [bikePathFeature, bikePositionFeature],
  });
  const vectorLayer = new ol.layer.Vector({
    source: mapVectorSource,
    style: feature => {
      return styles[feature.get('type')];
    },
  });

  // eslint-disable-next-line no-unused-vars
  const map = new ol.Map({
    target: 'map',
    layers: [mapLayer, vectorLayer],
    view: new ol.View({
      center: ol.proj.fromLonLat([144.4104, -37.8898]),
      zoom: 15,
    }),
    controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
  });
}
setupMap();
