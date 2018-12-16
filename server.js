const express = require('express')
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const rp = require('request-promise');
var Promise = require("bluebird");

const app = express()
app.set('port', (process.env.PORT || 5000))

const key = 'RGAPI-9b6b2a68-995a-45fe-b0f0-c437c2730751';
var summonerID = 'HMOiIUvzYtfgPk5X53zWTeOZo52T-HYJQhwvhkPNh0BWxZ0';
var accountID = 'V1xNS14bjVeP54hg03JeMxkXJB29K4TfUMvijDB85nxbD4Y';
var pseudo = 'Chil';
var JSONMatches;

/* To retrieve data of post request */
app.use(bodyParser.json());    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}));

/* Homepage */
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

/* Public assets folder */
app.use('/public', express.static(__dirname + '/public'));

/* Launch app */
app.listen(app.get('port'), () => console.log(`RiotAPI test app listening on port ${app.get('port')}!`))



function apicall(urlApi) {
  //console.log(urlApi);
  return rp({ url: 'https://euw1.api.riotgames.com/lol/match/v4/matches/' + urlApi + '?api_key=' + key, json: true }).then(function (obj) {
    return addMatchToJSON(obj);
  });
}


// Get data of rankeds
function getRanked(callback) {
  request('https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/' + summonerID + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  })
}


// send data of rankeds and of username
app.post('/api', function (req, res) {
  //console.log(req.body.playerName);
  pseudo = req.body.playerName;

  getAccountInfos(function (account) {
    if (!account)
      res.send(null)
    getRanked(function (ranked) {
      getMatches(function (matches) {
        var finalJSON = new Array();
        finalJSON.push(account);
        finalJSON.push(ranked);
        finalJSON.push(matches);
        res.send(finalJSON);
      });
    });
  });

});


// Get account infos of an username
function getAccountInfos(callback) {
  request('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + pseudo + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var JSONBody = JSON.parse(body);
      //console.log(JSONBody);
      summonerID = JSONBody.id;
      accountID = JSONBody.accountId;
      callback(JSONBody);
    }
    else {
      console.log('username not found');
      callback(null);
    }
  });
}


// Get matches of an accountID
function getMatches(callback) {
  request('https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountID + '?endIndex=10&api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      JSONMatches = JSON.parse(body);

      var matchsId = new Array();
      for (var i = 0; i < JSONMatches.matches.length; i++) {
        matchsId[i] = JSONMatches.matches[i].gameId;
      }

      Promise.mapSeries(matchsId, function (item) {
        return apicall(item);
      }).then(() => {
        console.log('Finished');
        callback(JSONMatches);
      }).catch(err => {
        console.log('Error');
      });

    }
  });
}


function addMatchToJSON(obj) {
  //console.log(obj.gameId);

  for (var i = 0; i < JSONMatches.matches.length; i++) {
    if (JSONMatches.matches[i].gameId == obj.gameId) {
      //console.log('yes');
      JSONMatches.matches[i] = obj;
    }
  }
}