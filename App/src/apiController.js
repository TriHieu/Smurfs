'use strict'

const mqttData = require('./mqtt_data');
const mqtt = new mqttData();
mqtt.subscribe_data("Topic/TempHumi");

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
}

console.log(this.get);