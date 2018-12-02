const express = require('express')
const request = require('request');
const path = require('path');

const app = express()
app.set('port', (process.env.PORT || 5000))

const key = 'RGAPI-79f2b14e-a46e-4520-b7d8-475b8b89b9bc';
//var id = 65362306;
var summonerID = 'HMOiIUvzYtfgPk5X53zWTeOZo52T-HYJQhwvhkPNh0BWxZ0';
var accountID = 'V1xNS14bjVeP54hg03JeMxkXJB29K4TfUMvijDB85nxbD4Y';
var pseudo = 'Chil';

/* Homepage */
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

/* Public assets folder */
app.use('/public', express.static(__dirname + '/public'));

/* Launch app */
app.listen(app.get('port'), () => console.log(`RiotAPI test app listening on port ${app.get('port')}!`))


// Get data of rankeds
function getRanked(callback) {
  request('https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/' + summonerID + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  })
}


// send data of rankeds and of username
app.get('/api', function (req, res) {
  var name = req.url.split('?')[1];
  if (name != undefined) {
    pseudo = name;
  }
  getAccountInfos(function (account) {
    getRanked(function (ranked) {
      getMatches(function(matches) {
        var finalJSON = new Array();
        finalJSON.push(account);
        finalJSON.push(ranked);
        finalJSON.push(matches);
        res.send(finalJSON);
      });
    });
  });
});


/*
app.get('/api', function (req, res) {
  var name = req.url.split('?')[1];
  if (name != undefined) {
    pseudo = name;
  }
  getAccountInfos(function (JSONBody) {
    getRanked(function (body) {
      dataAPI = body;
      var finalJSON = new Array();
      finalJSON.push(JSONBody);
      finalJSON.push(dataAPI);
      res.send(finalJSON);
    });
  });
});*/



// Get account infos of an username
function getAccountInfos(callback) {
  request('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + pseudo + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var JSONBody = JSON.parse(body);
      console.log(JSONBody);
      summonerID = JSONBody.id;
      accountID = JSONBody.accountId;
      callback(JSONBody);
    }
  });
}


// Get matches of an accountID
function getMatches(callback) {
  request('https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountID + '?endIndex=10&api_key=' + key, function (error, response, body) { 
    if (!error && response.statusCode == 200) {
      var JSONMatches = JSON.parse(body);
      //console.log(JSONMatches);
      callback(JSONMatches);
    }
  });
}
