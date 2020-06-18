
// call latest api
// return JSON object
function getLatestTH(){
    fetch("http://localhost:3000/apicall/temphumi/latest")
    .then((res)=> res.json())
    .then(data => {
        console.log(data); // JSON object
        dateTimeConvert(data.time_stamp);
    })
    .catch(err =>{
        console.log(err);
    })
}

function getLatestLight(){
    fetch("http://localhost:3000/apicall/light/latest")
    .then((res)=> res.json())
    .then(data => {
        console.log(data); // JSON object
        dateTimeConvert(data.time_stamp);
        

    })
    .catch(err =>{
        console.log(err);
    })
}

function dateTimeConvert(timestamp){
    let date = new Date(timestamp);
    console.log(date);
}