function dateTimeConvert(timestamp){
    let date = new Date(timestamp);
    return date;
}

async function callAPI() {
    await fetch("/apicall/temphumi/latest")
        .then((res) => res.json())
        .then(data => {
            //console.log(data[0].values[0]); // JSON object
            document.getElementById('Temperature').innerHTML = data[0].values[0] + " C";
            document.getElementById('Humid').innerHTML = data[0].values[1] + " %";
        })
        .catch(err => {
            console.log(err);
        })

    await fetch("/apicall/light/latest")
        .then((res) => res.json())
        .then(data => {
            //light = data[0].values;
            document.getElementById('Light').innerHTML = data[0].values + " lux";
        })
        .catch(err => {
            console.log(err);
        })
}
// }

async function drawChartLight(){
    let arr=[];
    await fetch("/apicall/light")
    .then((res)=> res.json())
    .then(dat => {
        for(let i = dat.length -1;i>0;i--){
            dtime =  dateTimeConvert(dat[i].time_stamp).toLocaleTimeString();
            arr.push([dtime,dat[i][0].values[0]]);
        }
    })
    .catch(err =>{
        console.log(err);
    })
    let notes = `
                <li>
                    <h5><i class="fa fa-circle m-r-5 text-inverse"></i>Light</h5> </li>
                `
    document.getElementById('notes').innerHTML=notes;
    let time =[];
    let light = [];
    for(let i=0;i<8;i++){
        time[i]= arr[8-i][0];
        light[i] = arr[8-i][1];
    }
    console.log(light);
    //ct-visits
    new Chartist.Line('#ct-visits', {
        labels: time,
        series: [light]
    }, {
        top: 0,
        low: 1,
        showPoint: true,
        fullWidth: true,
        plugins: [Chartist.plugins.tooltip()],
        axisY: {
            labelInterpolationFnc: function (value) {
                return (value / 1);
            }
        },
        showArea: true
    });
}

async function drawChartTH(){
    let arr=[];
    await fetch("/apicall/temphumi")
    .then((res)=> res.json())
    .then(dat => {
        for(let i = dat.length -1;i>0;i--){
            if (dat[i][0] == undefined)
                continue;
            dtime =  dateTimeConvert(dat[i].time_stamp).toLocaleTimeString();
            arr.push([dtime,dat[i][0].values[0],dat[i][0].values[1]]);
        }
    })
    .catch(err =>{
        console.log(err);
    })
    let notes = `<li>
                    <h5><i class="fa fa-circle m-r-5 text-info"></i>Humid</h5> </li>
                <li>
                    <h5><i class="fa fa-circle m-r-5 text-inverse"></i>Temperature</h5> </li>
                `
    document.getElementById('notes').innerHTML=notes;
    let time =[];
    let temp = [];
    let humid = []
    for(let i=0;i<8;i++){
        time[i]= arr[8-i][0];
        temp[i] = arr[8-i][1];
        humid[i] = arr[8-i][2];
    }
    //ct-visits
    new Chartist.Line('#ct-visits', {
        labels: time,
        series: [temp,humid]
    }, {
        top: 0,
        low: 1,
        showPoint: true,
        fullWidth: true,
        plugins: [Chartist.plugins.tooltip()],
        axisY: {
            labelInterpolationFnc: function (value) {
                return (value / 1);
            }
        },
        showArea: true
    });
}

$(document).ready(function () {
     "use strict";
     // toat popup js
    drawChartTH();
    callAPI();
    setInterval(callAPI,10000);
    
    
     // counter
     $(".counter").counterUp({
         delay: 100,
         time: 1200
     });

     var sparklineLogin = function () {
         $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7ace4c'
         });
         $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#7460ee'
         });
         $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#11a0f8'
         });
         $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
             type: 'bar',
             height: '30',
             barWidth: '4',
             resize: true,
             barSpacing: '5',
             barColor: '#f33155'
         });
     }
     var sparkResize;
     $(window).on("resize", function (e) {
         clearTimeout(sparkResize);
         sparkResize = setTimeout(sparklineLogin, 500);
     });
     sparklineLogin();
 });
