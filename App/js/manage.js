async function fsensor(){
await fetch("/user")
    .then((res) => res.json())
    .then(data => {
      document.getElementById("hidden_input").value = data.uid;
      document.getElementById("username").innerHTML = data.name;
      uid= data.uid;
      let div = "";
      fetch("users/"+uid)
        .then(res=>res.json())
        .then(sensors=>{
          sensorsTH = [];
          sensorsLight=[];
          try{ 
              sensorsTH = sensors[0]['TempHumi'].devices.device_id;
              sensorsLight = sensors[0]['Light'].devices.device_id;
          }
          catch(e){}
          if(!sensorsTH.length == 0){
            for(let i=0;i<sensorsTH.length;i++){
              div += `<li>TH:   `+sensorsTH[i]+`</li>`
            }

          }
          if(!sensorsLight.length == 0){
            for(let i=0;i<sensorsLight.length;i++){
              div += `<li>Light: `+sensorsLight[i]+`</li>`
            }
          }
          
          document.getElementById("rlist").innerHTML = div;
        }) 
})
}

var formAdd = document.getElementById('add');

formAdd.addEventListener('submit', function(event) {
  var headers = {
    "Content-Type": "application/json",                                                                                                
    "Access-Control-Origin": "*"
  }

  var data = {
      'uid': document.getElementById("hidden_input").value,
      'type' : document.getElementById("select_input").value,
      'device_id': document.getElementById("did_input").value
  }
  var url = '/manage/add';

  var fetchOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };
  
  fetch(url, fetchOptions)
    .then((res) => {
      console.log(res);
      switch(res.status){
        case 200:
          fsensor();
          alert('Add Successfully');
          break;
        case 409:
          alert('Sensor is already added');
          break;
      }

      
    })
  

  event.preventDefault();
});

fsensor();