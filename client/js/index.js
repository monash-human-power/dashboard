document.getElementById("velocity-time").width = document.getElementById("chart1").offsetWidth;
document.getElementById("velocity-time").height = document.getElementById("chart1").offsetHeight;

new Chart(document.getElementById("velocity-time"), {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                    data:[{x:0, y:0},{x:5, y:2},{x:10, y:22},{x:15, y:40},{x:20, y:56},{x:25, y:70},{x:30, y:82},{x:35, y:92},{x:40, y:100}],
                    backgroundColor:['rgba(165, 105, 189, 0.6)']
                    }]
                    },

                options:{
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 175
                                }
                            }]
                        }
              }
            });


document.getElementById("power-time").width = document.getElementById("chart2").offsetWidth;
document.getElementById("power-time").height = document.getElementById("chart2").offsetHeight;

new Chart(document.getElementById("power-time"), {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                    data:[{x:0, y:0},{x:5, y:12},{x:10, y:53},{x:15, y:25},{x:20, y:46},{x:25, y:28},{x:30, y:18},{x:35, y:89},{x:40, y:153}],
                    backgroundColor:['rgba(93, 173, 226, 0.6)']
                    }]
                    },

                options:{
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 175
                                }
                            }]
                        }
              }
            });

document.getElementById("cadence-time").width = document.getElementById("chart3").offsetWidth;
document.getElementById("cadence-time").height = document.getElementById("chart3").offsetHeight;

new Chart(document.getElementById("cadence-time"), {
                type:'scatter',
                data:{
                    label:'Scatter Dataset',
                    datasets:[{
                    data:[{x:0, y:10},{x:5, y:45},{x:10, y:53},{x:15, y:25},{x:20, y:85},{x:25, y:53},{x:30, y:47},{x:35, y:13},{x:40, y:43}],
                    backgroundColor:['rgba(88, 214, 141, 0.6)']
                    }]
                    },

                options:{
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
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                max: 175
                                }
                            }]
                        }
              }
            });




function addData(dataInput, chart) {
    
    let lastValue = chart.data.datasets[0].data.length - 1;
    chart.data.datasets[0].data[lastValue] = dataInput;
    chart.data.datasets[0].data.shift();
    chart.update();
}




