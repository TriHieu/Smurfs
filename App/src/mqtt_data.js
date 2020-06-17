
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
        this.client = this.mqtt.connect('mqtt://23.97.58.41',{clientId:"mqtt-nhom2-BT"}/*{clientId:"mqtt01",username:"BKvm2",password:"Hcmut_CSE_2020"}*/);
        //this.client = this.mqtt.connect('mqtt://23.97.58.41',{clientId:"mqtt01"}/*{clientId:"mqtt01",username:"BKvm2",password:"Hcmut_CSE_2020"}*/);
        this.client.on("connect",()=>{
            console.log("Connected to MQTT Broker");
        });
        this.client.on("error",(error)=>{
            console.log("Can't connect:"+error);
        });
        require('firebase');
        this.firebase=require('firebase/app');
        require('firebase/auth');
        require('firebase/firestore');

        var firebaseConfig = {
            apiKey: "AIzaSyDnc5DMc9UPChWyaFC8UN8JkXOUjnimkQE",
            authDomain: "iot-do-an.firebaseapp.com",
            databaseURL: "https://iot-do-an.firebaseio.com",
            projectId: "iot-do-an",
            storageBucket: "iot-do-an.appspot.com",
            messagingSenderId: "548303299356",
            appId: "1:548303299356:web:5c19c82bdf7e63ddc910d9",
            measurementId: "G-XCZCPHTM9R"
        };

        this.firebase.initializeApp(firebaseConfig);
        this.database=this.firebase.database();
        this.client.on("message",(topic,message,packet)=>{
            console.log(Array.isArray(JSON.parse(message.toString())));
            if (Array.isArray(JSON.parse(message.toString()))){
                var json_message=JSON.parse(message.toString())[0];
                json_message.time_stamp=new Date().getTime();
                console.log(topic);
                if (topic.localeCompare("Topic/TempHumi")==0) {
                    console.log("TempHumi: "+json_message.toString());
                    this.database.ref("Topic/TempHumi/latest").set(json_message);
                    this.database.ref("Topic/TempHumi/history").push(json_message);
                }else if(topic.localeCompare("Topic/Light")==0){
                    console.log("Light: "+json_message.toString());
                    this.database.ref("Topic/Light/latest").set(json_message);
                    this.database.ref("Topic/Light/history").push(json_message);
                }else{
                    throw "Subscribe wrong topic!";
                }
            }
        });
    }

    //Publish data len server
    //Input:
    //topic: topic cần publish
    //message: message JSON cần publish đến topic (phải đúng định dạng của server)
    publish_data(topic,message){
        this.client.on("connect",()=>{
            console.log("Publish to topic:"+topic);
            console.log("Message:"+JSON.stringify(message));
            this.client.publish(topic,message.toString());
        })
    }

    //Subscribe topic can lay du lieu
    //Input:
    //topic: topic cần subscribe ( group chỉ subscribe 2 topic là Topic/TempHumi và Topic/Light )
    subscribe_data(topic){
        this.client.on("connect",()=>{
            this.client.subscribe(topic,{qos:1});
            console.log("Subscribe to topic:"+topic)
        })
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

