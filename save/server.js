const express = require('express')
const request = require('request');
const path = require('path');
const bodyParser = require("body-parser");

const app = express()
const port = 3000

const key = 'RGAPI-0db7bf7a-c8a7-40d1-927b-2cd33e22d873';
var id = 65362306;
var pseudo = 'Chil';

var dataAPI;

/* Homepage */
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.listen(port, () => console.log(`RiotAPI test app listening on port ${port}!`))


// Get data of rankeds
function getRanked(callback) {
  request('https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + id + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  })
}

getRanked(function (body) {
  dataAPI = body;
});


// send data of rankeds and of username
app.get('/api', function (req, res) {
  var name = req.url.split('?')[1];
  if (name != undefined) {
    pseudo = name;
  }
  getAccountID(function (JSONBody) {
    id = JSONBody.id;
    getRanked(function (body) {
      dataAPI = body;
      var finalJSON = new Array();
      finalJSON.push(JSONBody);
      finalJSON.push(dataAPI);
      //console.log(finalJSON);
      res.send(finalJSON);
      //res.send(dataAPI);
    });
  });
  
});


// Get accountId of username
function getAccountID(callback) {
  request('https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + pseudo + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      dataAPI = body;
      var JSONBody = JSON.parse(body);
      //console.log(JSONBody);
      id = JSONBody.id;
      callback(JSONBody);
    }
  });
}
