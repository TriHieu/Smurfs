function dateTimeConvert(timestamp){
    let date = new Date(timestamp);
    return date;
}

var slider = document.getElementById("myRange");
var output = document.getElementById("Speaker");
var inpnum = document.getElementById("inp_number");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
    inpnum.value = this.value;
}
inpnum.oninput = function () {
    output.innerHTML = this.value;
    slider.value = this.value;
}
async function fun(value) {
    if (parseInt(value) >= 5000) { value = "5000"; }
    if (parseInt(value) == 0){
        values = ["0","0"];
    }
    else{
        values = ["1",value];
    }
    await fetch("apicall/publishSpeaker", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify([{ "device_id": "Speaker", "values": values }]) // body data type must match "Content-Type" header
    });

}

async function getData(action) {
    uid = document.getElementById('hid').value;
    await fetch("users/"+uid)
        .then(res=>res.json())
        .then(sensors=>{
            switch(action){
                case 'drawChartTH':
                    drawChartTH(sensors);
                    break;
                case 'drawChartLight':
                    drawChartLight(sensors);
                    break;
                case 'callAPI':
                    callAPI(sensors);
                    break;
            }

    })   
}

async function callAPI(sensors){
    sensorsTH = [];
    sensorsLight=[];
    try{ 
        sensorsTH = sensors[0]['TempHumi'].devices.device_id;
        sensorsLight = sensors[0]['Light'].devices.device_id;
    }
    catch(e){}

    await fetch("apicall/getspeaker")
        .then((res) => res.json())
        .then(data => {
            //console.log("Speaker", data[0].values[1]); // JSON object
            status = data[0].values[0];
            speak = data[0].values[1];
            document.getElementById('Speaker').innerHTML = speak;
        })
        .catch(err => {
            console.log(err);
        })
    val = document.getElementById("myRange").value;
    

    if((sensorsTH.length==0&&sensorsLight.length==0)){
        document.getElementById('data-display').innerHTML= "Nothing to Display. Go Register some Sensors !!"
        return;
    }
    else{
        await fetch("/apicall/temphumi/latest")
        .then((res) => res.json())
        .then(data => {
            let div = '';
            for (e in data){
                try{
                    if(data[e][0]["device_id"]==sensorsTH.find(i=>i==data[e][0]["device_id"])){
                        let tdstyle0 = "";
                        let tdstyle1 = "";
                        (data[e][0].values[0]>28||data[e][0].values[0]<22)?tdstyle0 = "color: red":"";
                        (data[e][0].values[1]>75||data[e][0].values[1]<70)?tdstyle1 = "color: red":"";

                        div += `<div class="card"">
                                    <div class="card-body" style="width:120px;">
                                    <p>DeviceID: </p>
                                    <label>`+data[e][0]['device_id']+`</label>
                                    <p>Temperature: </p>
                                    <label style = '`+tdstyle0+`'>`+data[e][0].values[0]+`</label>
                                    <p>Humid: </p>
                                    <label style = '`+tdstyle1+`'>`+data[e][0].values[1]+`</label>
                                    </div>
                                </div>`
                        // console.log(data[e][0]['device_id']); // JSON object
                        if (parseInt(speak) <= 1000 && parseInt(data[e][0].values[0]) >= 40 && parseInt(status)!=0) {
                            console.log('running')
                            fetch("apicall/publishSpeaker", {
                                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                mode: 'cors', // no-cors, *cors, same-origin
                                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                                credentials: 'same-origin', // include, *same-origin, omit
                                headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                redirect: 'follow', // manual, *follow, error
                                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                                body: JSON.stringify([{ "device_id": "Speaker", "values": ["1", "3000"] }]) // body data type must match "Content-Type" header
                            });
                        }
                    }
                }
                catch(err){
                }
            }
            document.getElementById('th').innerHTML = div;
        })
        .catch(err => {
            console.log(err);
        })

    await fetch("/apicall/light/latest")
        .then((res) => res.json())
        .then(data => {
            let div = '';
            for (e in data){
                try{
                    if(data[e][0]["device_id"]==sensorsLight.find(i=>i==data[e][0]["device_id"])){
                        let tdstyle = "";
                        (data[e][0].values[0]>60||data[e][0].values[0]<15)?tdstyle = "color: red":"";
                        div += `<div class="card">
                                    <div class="card-body" style="width:120px;">
                                    <p>DeviceID: </p>
                                    <label>`+data[e][0]['device_id']+`</label>
                                    <p>Light: </p>
                                    <label style = '`+tdstyle+`'>`+data[e][0].values+`</label>
                                    </div>
                                </div>`
                    }
                }
                catch(err){
                }
            }
            document.getElementById('lg').innerHTML = div;
        })
        .catch(err => {
            console.log(err);
        })
    }
    
}
// }

async function drawChartLight(sensors){
    let notes = `
                <li>
                    <h5><i class="fa fa-circle m-r-5 text-inverse"></i>Light</h5> </li>
                `
    document.getElementById('notes').innerHTML=notes;
    sensorsLight=[];
    try{ 
        sensorsLight = sensors[0]['Light'].devices.device_id;
    }
    catch(e){}

    if(sensorsLight.length==0){
        new Chartist.Line('#ct-visits', {
            labels: '',
            series: [[]]
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
        return;
    }

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
    let time =[];
    let light = [];
    for(let i=0;i<8;i++){
        time[i]= arr[8-i][0];
        light[i] = arr[8-i][1];
    }
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

async function drawChartTH(sensors){
    let notes = `<li>
                    <h5><i class="fa fa-circle m-r-5 text-info"></i>Humid</h5> </li>
                <li>
                    <h5><i class="fa fa-circle m-r-5 text-inverse"></i>Temperature</h5> </li>
                `
    document.getElementById('notes').innerHTML=notes;

    sensorsTH = [];
    try{ 
        sensorsTH = sensors[0]['TempHumi'].devices.device_id;
    }
    catch(e){}
    console.log(sensorsTH);
    if(sensorsTH.length==0){
        new Chartist.Line('#ct-visits', {
            labels: "",
            series: [[],[]]
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
        return;
    }

    let arr=[];
    await fetch("/apicall/temphumi")
    .then((res)=> res.json())
    .then(dat => {
        // console.log(sensorsTH);
        for(let i = dat.length -1;i>1;i--){
            if (dat[i][0] == undefined)
                continue;
            if(dat[i][0]["device_id"]==sensorsTH.find(e=>e==dat[i][0]["device_id"])){
                dtime =  dateTimeConvert(dat[i].time_stamp).toLocaleTimeString();
                arr.push([dtime,dat[i][0].values[0],dat[i][0].values[1]]);
            }
        }
    })
    .catch(err =>{
        console.log(err);
    })
    let time =[];
    let temp = [];
    let humid = [];
    count = 0;
    l = arr.length;
    for(let i=0;i<arr.length-1;i++){
        time[i]= arr[l-i-1][0];
        temp[i] = arr[l-i-1][1];
        humid[i] = arr[l-i-1][2];
        count++;
        if (count == 8) break;
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


setTimeout(()=>getData('callAPI'), 100);
setInterval(()=>getData('callAPI'),10000);
setTimeout(()=>getData('drawChartTH'),100);

$(document).ready(function () {
     "use strict";
     // toat popup js
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
