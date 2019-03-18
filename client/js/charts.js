// TODO: Make this into a module
function setupCadenceTimeChart() {
    let cadenceTimeChartElement = document.getElementById("cadenceTimeChart");

    const cadenceTimeOptions = {
        title:{
            display:true,
            text:'Cadence-Time',
            maintainAspectRatio: true,
            fontSize:14
        },
        
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                display: true,
                labelString: 'Time (s)'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                display: true,
                labelString: 'Cadence'
                },
                ticks: {
                    beginAtZero: true,
                    max: 175
                    }
                }]
            }
    };
    const cadenceTimeChart = new Chart(cadenceTimeChartElement, {
        type:'scatter',
        data:{
            label:'Scatter Dataset',
            datasets:[{
                data:[],
                backgroundColor:['rgba(88, 214, 141, 0.6)'],
                showLine: true
                }]
            },
        options: cadenceTimeOptions
    });
    return cadenceTimeChart;
}

function setupVelocityTimeChart() {
    let velocityTimeChartElement = document.getElementById("velocityTimeChart");

    const velocityTimeOptions = {
        title:{
        display:true,
        text:'Velocity-Time',
        maintainAspectRatio: true,
        fontSize:14
        },        
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                display: true,
                labelString: 'Time (s)'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Velocity (km/h)'
                },
                ticks: {
                    beginAtZero: true,
                    max: 175
                    }
                }]
            }
        };

    const velocityTimeChart = new Chart(velocityTimeChartElement, {
        type:'scatter',
        data:{
            label:'Scatter Dataset',
            datasets:[{
                data:[],
                backgroundColor:['rgba(165, 105, 189, 0.6)'],
                showLine: true
                }]
            },
        options: velocityTimeOptions
    });

    return velocityTimeChart;
}
function setupPowerTimeChart() {
    let powerTimeChartElement = document.getElementById("powerTimeChart");

    const powerTimeOptions = {
                        title:{
                            display:true,
                            text:'Power-Time',
                            maintainAspectRatio: true,
                            fontSize:14
                        },

                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                display: true,
                                labelString: 'Time (s)'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                display: true,
                                labelString: 'Power (W)'
                                },
                                ticks: {
                                    beginAtZero: true,
                                    max: 175
                                    }
                                }]
                            }
                };

    const powerTimeChart = new Chart(powerTimeChartElement, {
                    type:'scatter',
                    data:{
                        label:'Scatter Dataset',
                        datasets:[{
                            data:[],
                            backgroundColor:['rgba(93, 173, 226, 0.6)'],
                            showLine: true
                            }]
                        },
                    options: powerTimeOptions
                });
    return powerTimeChart;
}

function addData(chart, data) {
    // let lastValue = chart.data.datasets[0].data.length - 1;
    // chart.data.datasets[0].data[lastValue] = dataInput;
    // chart.data.datasets[0].data.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
