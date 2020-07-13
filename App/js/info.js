
// call latest api
// return JSON object
function getLatestTH(){
    fetch("/apicall/temphumi/latest")
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
    fetch("/apicall/light/latest")
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