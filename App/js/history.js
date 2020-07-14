function dateTimeConvert(timestamp){
  let date = new Date(timestamp);
  return date;
}

async function drawTableTH() {
    let html = "";
    let tbheader='';
    await fetch("/apicall/temphumi")
    .then((res)=> res.json())
    .then(dat => {
      for(let i = dat.length -1;i>0;i--){
        var e = dat[i];
        if (e[0]==undefined) // check error
          continue; //skip
        dtime =  dateTimeConvert(e.time_stamp).toString();
        var ts =  dateTimeConvert(e.time_stamp);
        var t = ts.getFullYear()+"-"+((ts.getMonth()+1)<10?'0' + (ts.getMonth()+1):ts.getMonth()+1)+"-"+ts.getDate();
        let tdstyle0 = "";
        let tdstyle1 = "";
        if(t==document.getElementById("date-input").value || document.getElementById("date-input").value==""){
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
      }
        
    })
    .catch(err =>{
        console.log(err);
    })
    document.querySelector(".table").innerHTML = tbheader;
    document.getElementById('tbody').innerHTML = html;
  }

  async function drawTableLight() {
    let html = "";
    let tbheader='';
    await fetch("/apicall/light")
    .then((res)=> res.json())
    .then(dat => {
      for(let i = dat.length -1;i>0;i--){
        e = dat[i];
        dtime =  dateTimeConvert(e.time_stamp).toString();
        var ts =  dateTimeConvert(e.time_stamp);
        var timeFormat = ts.getFullYear() + "-" + ((ts.getMonth()+1)<10 ? '0' + (ts.getMonth()+1) : ts.getMonth()+1) + "-" + ts.getDate();
        if(timeFormat==document.getElementById("date-input").value || document.getElementById("date-input").value==""){
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
      }
    })
    .catch(err =>{
        console.log(err);
    })
    document.querySelector(".table").innerHTML = tbheader;
    document.getElementById('tbody').innerHTML=html;
}