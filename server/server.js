var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var upload = multer();
var mqtt = require('mqtt');

var app = express();

var options = {
    port: 19244,
    host: 'mqtt://m13.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'cbxsmzwh',
    password: 'KoMgGSp8AnVm',
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: false,
    encoding: 'utf8'
};

var sensorServerData= {"Payload":{}};

app.use(express.static(__dirname + '/public'));
//app.use('/scripts', express.static('./node_modules/'));
// register new sensor server to handle request from client
var sensorServerCallback = require('./routes/sensorServer');

var client = mqtt.connect('mqtt://m13.cloudmqtt.com', options);
client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe('test', function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, message, packet) {
            console.log("Received '" + message + "' on '" + topic + "'");
            sensorServerData.Payload = message;
        });
    });

    // publish a message to a topic
    client.publish('test', 'Hello Py', function() {
        console.log("Message is published");
        //client.end(); // Close the connection when published
    });
});

client.on('error', function(err) { // When connected
    console.log(err);
});



// API sessor data: return sensor data to client view
app.get('/sensorData', sensorServerCallback.returnCurrentSensorData(sensorServerData));

app.get('/', function(req, res) {
	res.send('available APIs are:')
});

app.listen(3000);