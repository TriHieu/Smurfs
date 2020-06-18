'use strict'

const mqttData = require('./mqtt_data');
const mqtt = new mqttData();
mqtt.subscribe_data("Topic/TempHumi");
mqtt.subscribe_data("Topic/Light");
mqtt.subscribe_data("Topic/Speaker");
module.exports ={
    getLatestTH: (req,res) => {
        async function get(){
            res.send(await mqtt.get_latest("Topic/TempHumi"));
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
            res.send(await mqtt.get_latest("Topic/Light"));
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
    getHistorySpeaker: (req,res) => {
        async function get(){
            res.send(await mqtt.get_history("Topic/Speaker"));
        }
        get();
    },
}
console.log(this.get);
