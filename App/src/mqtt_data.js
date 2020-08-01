/********************************************************/
//Code hiện đang được hardcode để sử dụng dữ liệu từ MQTT của server Azure
//Server ko có gửi dữ liệu về cho user subscribe theo interval đâu
//Tự publish data lên để server gửi về nhá :v
//Nhóm chỉ publish và subscribe 2 topic là Topic/TempHumi và Topic/Light thôi nhá
/********************************************************/
const {firebase} = require('./firebaseConfig')
class MqttData{
    constructor(){
        this.mqtt=require('mqtt');
        //Địa chỉ server Azure
        
        this.client = this.mqtt.connect('mqtt://23.97.58.41',{clientId:"mqtt-nhom2-BT"}/*{clientId:"mqtt01",username:"BKvm2",password:"Hcmut_CSE_2020"}*/);
        // this.client = this.mqtt.connect('mqtt://52.230.1.253',{clientId:"mqtt-nhom2-BT",username:"BKvm",password:"Hcmut_CSE_2020"});
        this.client.on("connect",()=>{
            console.log("Connected to MQTT Broker");
        });
        this.client.on("error",(error)=>{
            console.log("Can't connect:"+error);
        });
        
        this.firebase = firebase;
        
        this.database=this.firebase.database();
        
        this.client.on("message",(topic,message,packet)=>{
                var json_message = JSON.parse(message.toString());
                // console.log(json_message[0].device_id);
                json_message["time_stamp"] = new Date().getTime();
                if (topic.localeCompare("Topic/TempHumi")==0) {
                    this.database.ref("Topic/TempHumi/latest").child(json_message[0].device_id).set(json_message);
                    //this.database.ref("Topic/TempHumi/latest").set(json_message);
                    this.database.ref("Topic/TempHumi/history").push(json_message);
                }else if(topic.localeCompare("Topic/Light")==0){
                    this.database.ref("Topic/Light/latest").child(json_message[0].device_id).set(json_message);
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

    async get_history_test(topic,dID=["Light"]){
        let history=[];
        await this.database.ref(topic+"/history").once("value",(snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                let childData=childSnapshot.val();
                if(childSnapshot.val()[0]["device_id"]==dID.find(e=>e==childSnapshot.val()[0]["device_id"])){
                    history.push(childData);
                }
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
    async get_latest_test(topic){
        let latest=[];
        await this.database.ref(topic+"/latest").once("value",(snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                try {
                    let childData=childSnapshot.val();
                        latest.push(childData);
                }
                catch(err){
                }
            });
        });
        return latest;
    }

    async get_user(uid=[]){
        let register=[];
        await this.database.ref("Acc/"+uid).once("value",(snapshot)=>{
            snapshot.forEach((childSnapshot)=>{
                register.push(childSnapshot.val())
            });
        });
        return register;
    }

}

module.exports=MqttData;