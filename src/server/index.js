var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
let result = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

console.log(__dirname)

app.get('/',function (req,res) {
    res.status(200).sendFile('dist/index.html');
});

app.post('/postData',function (req,res){
    result['destname'] = req.body.destname;
    result['temperature'] = req.body.temperature;
    result['weather'] = req.body.weather;
    result['daystotrip'] = req.body.daystotrip;
    result['cityImage1']  = req.body.cityImage1;
    result['cityImage2']  = req.body.cityImage2;
    result['cityImage3']  = req.body.cityImage3;
    result['destdate'] = req.body.destdate;

	console.log('Travel to: ' + req.body.destname);
	console.log('Temp: ' + req.body.temperature);

    res.send(result);
});


// designates what port the app will listen to for incoming requests
app.listen(3002, function () {
    console.log('Example app listening on port 3002!')
})


app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

module.exports = app;
