var firebase = require("firebase-admin");
var mqtt = require("mqtt");
var serviceAccount = require("./key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://database-349e2.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("server");

client = mqtt.connect('mqtt://23.97.58.41',{clientId:"mqtt-nhom2-BT"})
client.subscribe(['Topic/TempHumi','Topic/Light']);
console.log("Connected to MQTT Broker");

client.on("error",(error)=>{
    console.log("Can't connect:"+error);
});

client.on("message",(topic,message,packet)=>{
    console.log( message.toString());
    console.log(Array.isArray(JSON.parse(message.toString())));
    var json_message=JSON.parse(message.toString());
    json_message["time_stamp"] = new Date().getTime();
    console.log(topic);
    if (topic.localeCompare("Topic/TempHumi")==0) {
        // console.log("TempHumi: "+json_message.toString());
        ref.child("Topic/TempHumi/latest").set(json_message);
        ref.child("Topic/TempHumi/history").push(json_message);
    }else if(topic.localeCompare("Topic/Light")==0){
        // console.log("Light: "+json_message.toString());
        ref.child("Topic/Light/latest").set(json_message);
        ref.child("Topic/Light/history").push(json_message);
    }else{
        throw "Subscribe wrong topic!";
    }
});

ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
//
// var usersRef = ref.child("users");
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: "June 23, 1912",
//     full_name: "Alan Turing"
//   },
//   gracehop: {
//     date_of_birth: "December 9, 1906",
//     full_name: "Grace Hopper"
//   }
// });
// var user = ref.child("users/gracehop")
// user.remove()
