'use strict'

const mqttData = require('./mqtt_data');
const mqtt = new mqttData();
mqtt.subscribe_data("Topic/TempHumi");
mqtt.subscribe_data("Topic/Light");
mqtt.subscribe_data("Topic/Speaker");

module.exports ={
    getLatestTH: (req,res) => {
        async function get(){
            res.send(await mqtt.get_latest_test("Topic/TempHumi"));
        }
        get();
    },
    getHistoryTH: (req,res) => {
        async function get(){
            res.send(await mqtt.get_history("Topic/TempHumi"));
        }
        get();
    },
    getLatestLight: (req,res) => {
        async function get(){
            res.send(await mqtt.get_latest_test("Topic/Light"));
        }
        get();
    },
    getHistoryLight: (req,res) => {
        async function get(){
            res.send(await mqtt.get_history("Topic/Light"));
        }
        get();
    },
    publish: (req,res) => {
        async function get(){
            res.send(await mqtt.publish_data("Topic/Speaker",req.body));
        }
        get();
    },
    // test
    getLastestSpeaker: (req,res) => {
        async function get(){
            res.send(await mqtt.get_latest("Topic/Speaker"));
        }
        get();
    },

    getUser: (req,res) => {
        async function get(){
            res.send(await mqtt.get_user(req.params.uid))
        }
        get();
    },
    publishSpeaker: (req,res) => {
        async function get(){
            res.send(await mqtt.publish_data("Topic/Speaker",req.body));
        }
        get();
    }
}
console.log(this.get);
