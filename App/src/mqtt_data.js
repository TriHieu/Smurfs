/********************************************************/
//Code hiện đang được hardcode để sử dụng dữ liệu từ MQTT của server Azure
//Server ko có gửi dữ liệu về cho user subscribe theo interval đâu
//Tự publish data lên để server gửi về nhá :v
//Nhóm chỉ publish và subscribe 2 topic là Topic/TempHumi và Topic/Light thôi nhá
/********************************************************/

class MqttData{
    constructor(){
        this.mqtt=require('mqtt');
        //Địa chỉ server Azure
        this.client = this.mqtt.connect('mqtt://52.187.125.59',{clientId:"mqtt01",username:"BKvm",password:"Hcmut_CSE_2020"});
        this.client.on("connect",()=>{
            console.log("Connected to MQTT Broker");
        });
        this.client.on("error",(error)=>{
            console.log("Can't connect:"+error);
        });
        
        this.firebase = require("firebase-admin");
        var serviceAccount = require("./key.json");

        this.firebase.initializeApp({
          credential: this.firebase.credential.cert(serviceAccount),
          databaseURL: "https://smurf-280413.firebaseio.com"
        });

        this.database=this.firebase.database();
        this.client.on("message",(topic,message,packet)=>{
                var json_message = JSON.parse(message.toString());
                json_message["time_stamp"] = new Date().getTime();
                if (topic.localeCompare("Topic/TempHumi")==0) {
                    this.database.ref("Topic/TempHumi/latest").set(json_message);
                    this.database.ref("Topic/TempHumi/history").push(json_message);
                }else if(topic.localeCompare("Topic/Light")==0){
                    this.database.ref("Topic/Light/latest").set(json_message);
                    this.database.ref("Topic/Light/history").push(json_message);
                }else if(topic.localeCompare("Topic/Speaker")==0){
                  this.database.ref("Topic/Speaker/latest").set(json_message);
                  this.database.ref("Topic/Speaker/history").push(json_message);
                }
                else{
                    throw "Subscribe wrong topic!";
                }
        });
    }

    //Publish data len server
    //Input:
    //topic: topic cần publish
    //message: message JSON cần publish đến topic (phải đúng định dạng của server)
    publish_data(topic,message){
        this.client.publish(topic,JSON.stringify(message));
    }

    //Subscribe topic can lay du lieu
    //Input:
    //topic: topic cần subscribe ( group chỉ subscribe 2 topic là Topic/TempHumi và Topic/Light )
    subscribe_data(topic){
        this.client.subscribe(topic,{qos:1});
        console.log("Subscribe to topic:"+topic)
    }

    //Lay du lieu lich su cua topic
    //Input :
    //topic : topic cần lấy lịch sử
    //Output: array các json
    async get_history(topic){
        let history=[];
        await this.database.ref(topic+"/history").once("value",(snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                let childData=childSnapshot.val();
                history.push(childData);
            });
        });
        return history;
    }

    //Lay du lieu moi nhat cua topic
    //Input:
    //topic: topic cần lấy dữ liệu
    //Output: json của dữ liệu mới nhất của topic
    async get_latest(topic){
        var latest;
        await this.database.ref(topic+"/latest").once("value",(snapshot)=>{
            latest=snapshot.val();
        });
        return latest;
    }
}

module.exports=MqttData;