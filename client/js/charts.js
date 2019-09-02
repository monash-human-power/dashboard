/* global Chart */

// TODO: Make this into a module
// eslint-disable-next-line no-unused-vars
let chartLabels = {
  cadence: [],
  velocity: [],
  power: [],
};

function setupCadenceTimeChart() {
  const cadenceTimeChartElement = document.getElementById('cadenceTimeChart');

  const cadenceTimeOptions = {
    title: {
      display: true,
      text: 'Cadence-Time',
      maintainAspectRatio: true,
      fontSize: 14,
    },

    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (s)',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Cadence',
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    annotation: {
      drawTime: 'afterDraw',
      annotations: [
        {
          type: 'line',
          id: 'max-cadence-annotation',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 0,
          borderColor: '#57606f',
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: 'Max Cadence',
            yAdjust: 15,
          },
        },
      ],
    },
  };
  const cadenceTimeChart = new Chart(cadenceTimeChartElement, {
    type: 'scatter',
    data: {
      label: 'Scatter Dataset',
      datasets: [
        {
          data: [],
          backgroundColor: ['rgba(88, 214, 141, 0.6)'],
          showLine: true,
        },
      ],
    },
    options: cadenceTimeOptions,
  });
  return cadenceTimeChart;
}

// eslint-disable-next-line no-unused-vars
function setupVelocityTimeChart() {
  const velocityTimeChartElement = document.getElementById('velocityTimeChart');

  const velocityTimeOptions = {
    title: {
      display: true,
      text: 'Velocity-Time',
      maintainAspectRatio: true,
      fontSize: 14,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (s)',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Velocity (km/h)',
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    annotation: {
      drawTime: 'afterDraw',
      annotations: [
        {
          type: 'line',
          id: 'max-velocity-annotation',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 0,
          borderColor: '#57606f',
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: 'Max Velocity',
            yAdjust: 15,
          },
        },
      ],
    },
  };

  const velocityTimeChart = new Chart(velocityTimeChartElement, {
    type: 'scatter',
    data: {
      label: 'Scatter Dataset',
      datasets: [
        {
          data: [],
          backgroundColor: ['rgba(165, 105, 189, 0.6)'],
          showLine: true,
        },
      ],
    },
    options: velocityTimeOptions,
  });

  return velocityTimeChart;
}

// eslint-disable-next-line no-unused-vars
function setupPowerTimeChart() {
  const powerTimeChartElement = document.getElementById('powerTimeChart');

  const powerTimeOptions = {
    title: {
      display: true,
      text: 'Power-Time',
      maintainAspectRatio: true,
      fontSize: 14,
    },

    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (s)',
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Power (W)',
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    annotation: {
      drawTime: 'afterDraw',
      annotations: [
        {
          type: 'line',
          id: 'max-power-annotation',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 0,
          borderColor: '#57606f',
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: 'Max Power',
            yAdjust: 15,
          },
        },
      ],
    },
  };

  const powerTimeChart = new Chart(powerTimeChartElement, {
    type: 'scatter',
    data: {
      label: 'Scatter Dataset',
      datasets: [
        {
          data: [],
          backgroundColor: ['rgba(93, 173, 226, 0.6)'],
          showLine: true,
        },
      ],
    },
    options: powerTimeOptions,
  });
  return powerTimeChart;
}

// eslint-disable-next-line no-unused-vars
function addData(chart, data) {
  // let lastValue = chart.data.datasets[0].data.length - 1;
  // chart.data.datasets[0].data[lastValue] = dataInput;
  // chart.data.datasets[0].data.shift();
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  chart.update();
}

// eslint-disable-next-line no-unused-vars
function setHorizontalLabel(chart, chartType, value) {
  let chartID = '';
  let label = '';
  switch (chartType) {
    case 'cadence':
      chartID = 'max-cadence-annotation';
      label = `${value} RPM`;
      break;
    case 'velocity':
      chartID = 'max-velocity-annotation';
      label = `${value} km/h`;
      break;
    case 'power':
      chartID = 'max-power-annotation';
      label = `${value} W`;
      break;
    default:
      throw Error('Invalid chart type.');
  }
  chart.annotation.elements[chartID].options.value = value;
  chart.annotation.elements[chartID].options.label.content = label;
  chart.update();
}
