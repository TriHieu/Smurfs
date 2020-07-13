function dateTimeConvert(timestamp){
  let date = new Date(timestamp);
  return date;
}
async function drawTableTH() {
    let html = "";
    let arr = [];
    let tbheader='';
    await fetch("/apicall/temphumi")
    .then((res)=> res.json())
    .then(dat => {
      for(let i = dat.length -1;i>0;i--){
        var e = dat[i];
        if (e[0]==undefined)
          continue;
        dtime =  dateTimeConvert(e.time_stamp).toString();
        let tdstyle0 = "";
        let tdstyle1 = "";
        console.log(e[0]);
        (e[0].values[0]>26||e[0].values[0]<22)?tdstyle0 = "color: red":"";
        (e[0].values[1]>75||e[0].values[1]<70)?tdstyle1 = "color: red":"";
        tbheader = `<thead>
                        <tr>
                            <th>Time</th>
                            <th>SensorID</th>
                            <th>Temperature (C)</th>
                            <th>Humidity (%)</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                    </tbody>`
        html += `<tr><td>`+dtime+`</td>
                    <td>`+e[0].device_id+`</td>
                    <td style = '`+tdstyle0+`'>`+e[0].values[0]+`</td>
                    <td style = '`+tdstyle1+`'>`+e[0].values[1]+`</td>
                </tr>`
      }
    })
    .catch(err =>{
        console.log(err);
    })
    document.querySelector(".table").innerHTML = tbheader;
    document.getElementById('tbody').innerHTML=html;
  }

  async function drawTableLight() {
    let html = "";
    let arr = [];
    let tbheader='';
    await fetch("/apicall/light")
    .then((res)=> res.json())
    .then(dat => {
      for(let i = dat.length -1;i>0;i--){
        e = dat[i];
        dtime =  dateTimeConvert(e.time_stamp).toString();
        arr.push([dtime,e[0].values[0]]);
        let tdstyle = "";
        (e[0].values[0]>60||e[0].values[0]<15)?tdstyle = "color: red":"";
        tbheader = `<thead>
                        <tr>
                            <th>Time</th>
                            <th>SensorID</th>
                            <th>Light</th>
                        </tr>
                    </thead>
                    <tbody id="tbody">
                        
                    </tbody>`
        html += `<tr><td>`+dtime+`</td>
                    <td>`+e[0].device_id+`</td>
                    <td style = '`+tdstyle+`'>`+e[0].values[0]+`</td>
                </tr>`
      }
    })
    .catch(err =>{
        console.log(err);
    })
    document.querySelector(".table").innerHTML = tbheader;
    document.getElementById('tbody').innerHTML=html;
}

function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Tháng', 'Nhiệt độ', 'Expenses'],
      ['Tháng 1',  1000,      400],
      ['Tháng 2',  1170,      460],
      ['Tháng 3',  660,       1120],
      ['Tháng 4',  1030,      540]
    ]);

    var options = {
      title: 'Biểu đồ các chỉ số của trang trại',
      curveType: 'function',
      legend: { position: 'bottom' },
      width: '500px',
      height: '300px'
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}
