const express = require('express');
const bodyParser = require('body-parser');
const apiController = require('./apiController');

const app = express();
var path = require('path');

//PORT server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

//Static path
//Hien thi css
app.use(express.static(path.join(__dirname,"..")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


// test route infomation
app.get("/",(req,res)=>{
    filePath = path.join(__dirname,"..","info.html");
    res.sendFile(filePath);
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
    .get(apiController.getHistorySpeaker);
