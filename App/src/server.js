const express = require('express');
const bodyParser = require('body-parser');
const apiController = require('./apiController');

const app = express();
var path = require('path');
const session = require('express-session');

const Auth = require("./auth");
const { type } = require('os');
const auth = new Auth();

//PORT server
const PORT = process.env.PORT || 3000;
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    maxAge  : new Date(Date.now() + 3600000), //1 Hour
    expires : new Date(Date.now() + 3600000),
    cookie: { maxAge: 3600000 }
}));

authMid = function (req, res, next) {
    if(!req.session.User){
        try{  
            return res.redirect("/auth")
        }
        catch(e){

        }
    }
    next();
}

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

//Static path
//Hien thi css
app.use(express.static(path.join(__dirname,"..")));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.set('view engine', 'html');

// test route infomation
app.get("/",authMid,(req,res)=>{
    filePath = path.join(__dirname,"..","info.html");
    res.sendFile(filePath,{session: req.session.User.uid});
})

app.get("/user",authMid,(req,res)=>{
    res.send(req.session.User);
})

app.get("/history",authMid,(req,res)=>{
    filePath = path.join(__dirname,"..","history.html");
    res.sendFile(filePath);
})

app.get("/auth",(req,res)=>{
    filePath = path.join(__dirname,"..","auth.html");
    res.sendFile(filePath);
})

app.get("/manage",authMid,(req,res)=>{
    filePath = path.join(__dirname,"..","manage.html");
    res.sendFile(filePath);
})

app.get("/report",authMid,(req,res)=>{
    filePath = path.join(__dirname,"..","report.html");
    res.sendFile(filePath);
})

//auth route
app.route('/auth/signup')
    .post((req,res) => {
        console.log(req.body);
        auth.firebaseClient.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
            .then(data =>{

                var user = auth.firebaseClient.auth().currentUser;
                user.updateProfile({
                    displayName: req.body.displayName
                }).then(function() {
                    console.log('update successful');
                })

                req.session.User = {
                    'uid' : data.user.uid,
                    'name' : req.body.displayName,
                    'email': data.user.email
                }

                res.redirect('/');

            })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                
            } else {
                console.log(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
    })


app.route('/auth/signin')
    .post((req,res) => {
        // console.log(req.body);
        auth.firebaseClient.auth().signInWithEmailAndPassword(req.body.email, req.body.pass)
            .then(data =>{
                req.session.User = {
                    'uid' : data.user.uid,
                    'name' : data.user.displayName,
                    'email': data.user.email
                }
                
                return res.status(201).redirect("/");
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              // [START_EXCLUDE]
              if (errorCode === 'auth/wrong-password') {
                res.status(401).send("Invalid User or Wrong Password");
                console.log('Wrong password.');
              } else {
                res.status(401).send("Invalid User or Wrong Password");
                console.log(errorMessage);
              }
              console.log(error);
              // document.getElementById('quickstart-sign-in').disabled = false;
            })
    })

app.route('/users/:uid')
    .get(apiController.getUser)

//manage route
app.route('/manage/add')
    .post((req,res) => {
        console.log(req.body);
        uid = req.body.uid;
        type1 = req.body.type;
        device_id = req.body.device_id;
        db = auth.firebaseAdmin.database();

        db.ref("Acc/"+uid+"/register/"+type1+"/devices/device_id").once("value",snapshot => {
            console.log(snapshot.val());
            if (Array.isArray(snapshot.val())){
                if(snapshot.val().includes(device_id)){
                    return res.status(409).send("existed")
                }else{
                    devices = snapshot.val();
                    devices.push(device_id);
                    data = {
                        device_id : devices
                    }
                    db.ref("Acc/"+uid+"/register/"+type1+"/devices/").set(data);
                }
            }
            else if(snapshot.val()!=null){
                if(snapshot.val()==device_id){
                    return res.status(409).send("existed");
                }
                else{
                    devices = [snapshot.val()];
                    devices.push(device_id);
                    data = {
                        device_id : devices
                    }
                    db.ref("Acc/"+uid+"/register/"+type1+"/devices/").set(data);
                }
            }
            else{
                data = {
                    device_id : [device_id]
                };
                db.ref("Acc/"+uid+"/register/"+type1+"/devices/").set(data);
            }
            return res.status(200).send("success");
            
            // db.ref("Acc/"+uid+"/register/"+type+"/devices/").set(data);
        });
    })


// route to call API
// route apicall TenpHumid
app.route('/apicall/temphumi')
    .get(apiController.getHistoryTH);

app.route('/apicall/temphumi/latest')
    .get(apiController.getLatestTH);

// route apicall TenpHumid
app.route('/apicall/light')
    .get(apiController.getHistoryLight);

app.route('/apicall/light/latest')
    .get(apiController.getLatestLight);

app.route('/apicall/speaker')
    .post(apiController.publish);

app.route('/apicall/getspeaker')
    .get(apiController.getLastestSpeaker);

app.route('/apicall/publishSpeaker')
    .post(apiController.publishSpeaker);

//logout
app.get('/logout',authMid, function(req, res, next) {
    if (req.session.User) {
        // delete session object
        req.session.destroy(function(err) {
        if(err) {
            return next(err);
        } else {
            return res.redirect('/auth');
        }
        });
    }
});