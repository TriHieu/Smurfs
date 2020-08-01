const firebase = require("firebase-admin");
const firebaseClient = require("firebase");
var serviceAccount = require("./key.json");

const firebaseConfig = {
    apiKey: "AIzaSyDfQpViD6pSaWyJkjqaxg6CS7o3s65_I68",
    authDomain: "smurf-280413.firebaseapp.com",
    databaseURL: "https://smurf-280413.firebaseio.com",
    projectId: "smurf-280413",
    storageBucket: "smurf-280413.appspot.com",
    messagingSenderId: "108580976867",
    appId: "1:108580976867:web:65ff8b55d58c4f9bf36dd6",
    measurementId: "G-ZK96J8TY9Q"
  };

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://smurf-280413.firebaseio.com"
});

firebaseClient.initializeApp(firebaseConfig);

module.exports.firebase = firebase
module.exports.firebaseClient = firebaseClient