var express = require('express');
var bodyParser = require('body-parser');
var line = require('@line/bot-sdk');
var myconfig = require('./config.js');
var Promise = require('bluebird');
var dialogManager = require('./dialogManager.js')

var app = express();

var config = {
    channelAccessToken: myconfig.S3DHMQsbJJ8sjZOWBe/S93in3qPu5zo1JhnzofTuchfYEpKRglyqAfxTGWA9aEUtmA3Cy2L9WSnX5Hlq6het+WWkyhZL6F8CaNWG7tdHLZ6X/W1ZtYNK3LlB9/NukAhpxK4G/9Rjg4ETnJ+Wmix+WQdB04t89/1O/w1cDnyilFU=,
    channelSecret: myconfig.7fd7377a87ccc0a85dd4da275c16826d
}
const client = new line.Client(config);
dialogManager.setClient(client);

console.dir("manager from root", dialogManager);
app.use(line.middleware(config));
app.use(bodyParser.json());

app.post('/webhook', function(req, res){
  console.log(req.body);
  Promise
    .all(req.body.events.map(dialogManager.decideAction))
    .then(function(result){
        return res.json(result);
    });
});


function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(3000, function(){
  console.log("server running on port 3000");
});
