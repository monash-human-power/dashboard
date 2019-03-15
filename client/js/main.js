let velocityTimeChart = document.getElementById("velocityTimeChart");
let velocityChartDiv= document.getElementById("velocityChartDiv");
let powerTimeChart = document.getElementById("powerTimeChart");
let powerChartDiv= document.getElementById("powerChartDiv");
let cadenceTimeChart = document.getElementById("cadenceTimeChart");
let cadenceChartDiv= document.getElementById("cadenceChartDiv");

cadenceTimeChart.width = cadenceChartDiv.offsetWidth;
cadenceTimeChart.width = cadenceChartDiv.offsetHeight;
powerTimeChart.width = powerChartDiv.offsetWidth;
powerTimeChart.width = powerChartDiv.offsetHeight;
velocityTimeChart.width = velocityChartDiv.offsetWidth;
velocityTimeChart.width = velocityChartDiv.offsetHeight;

var velocityTimeOptions = {
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
var powerTimeOptions = {
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
var cadenceTimeOptions = {
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


new Chart(velocityTimeChart, {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                        data:[{x:0, y:0},{x:5, y:2},{x:10, y:22},{x:15, y:40},{x:20, y:56},{x:25, y:70},{x:30, y:82},{x:35, y:92},{x:40, y:100}],
                        backgroundColor:['rgba(165, 105, 189, 0.6)']
                        }]
                    },
                options: velocityTimeOptions
            });

new Chart(powerTimeChart, {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                        data:[{x:0, y:0},{x:5, y:12},{x:10, y:53},{x:15, y:25},{x:20, y:46},{x:25, y:28},{x:30, y:18},{x:35, y:89},{x:40, y:153}],
                        backgroundColor:['rgba(93, 173, 226, 0.6)']
                        }]
                    },
                options: powerTimeOptions
            });

new Chart(cadenceTimeChart, {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                        data:[{x:0, y:10},{x:5, y:45},{x:10, y:53},{x:15, y:25},{x:20, y:85},{x:25, y:53},{x:30, y:47},{x:35, y:13},{x:40, y:43}],
                        backgroundColor:['rgba(88, 214, 141, 0.6)']
                        }]
                    },
                options: cadenceTimeOptions
            });




function addData(dataInput, chart) {
    
    let lastValue = chart.data.datasets[0].data.length - 1;
    chart.data.datasets[0].data[lastValue] = dataInput;
    chart.data.datasets[0].data.shift();
    chart.update();
}




