
// call latest api
// return JSON object
function getLatestTH(){
    fetch("http://localhost:3000/apicall/temphumi/latest")
    .then((res)=> res.json())
    .then(data => {
        console.log(data); // JSON object

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

    })
    .catch(err =>{
        console.log(err);
    })
}