require('dotenv').config()
const express = require('express')
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const Promise = require("bluebird");
const app = express()

/* Global Variables */
const key = process.env.API_KEY;
let summonerID;
let accountID;
let username;
let JSONMatches;

/* Set Port */
app.set('port', (process.env.PORT || 5000))

/* To retrieve data of post request */
app.use(bodyParser.json());    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}));

/* Homepage */
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'home.html'));
});

/* Summoners pages */
app.get('/summoners', function (request, response) {
  response.sendFile(path.join(__dirname, 'summoner.html'));
});

/* Public assets folder */
app.use('/public', express.static(__dirname + '/public'));

/* Launch app */
app.listen(app.get('port'), () => console.log(`RiotAPI test app listening on port ${app.get('port')}!`))

// Get data of one match
async function apicall(urlApi) {
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
  console.time('all')
  username = req.body.playerName;

  getAccountInfos(function (account) {
    if (!account)
      res.send(null)
    getRanked(function (ranked) {
      getMatches(function (matches) {
        let finalJSON = [];
        finalJSON.push(account);
        finalJSON.push(ranked);
        finalJSON.push(matches);
        console.log('Data sent to front');
        res.send(finalJSON);
        console.timeEnd('all')
      });
    });
  });

});


// Get account infos of an username
function getAccountInfos(callback) {
  request('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(username) + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let JSONBody = JSON.parse(body);
      //console.log(JSONBody);
      summonerID = JSONBody.id;
      accountID = JSONBody.accountId;
      callback(JSONBody);
    }
    else {
      console.log(response.statusCode);
      console.log('username not found');
      callback(null);
    }
  });
}


// Get matches of an accountID
function getMatches(callback) {
  console.time('getMatches');
  request('https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountID + '?endIndex=10&api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      JSONMatches = JSON.parse(body);

      let matchsId = [];
      for (let i = 0; i < JSONMatches.matches.length; i++) {
        matchsId[i] = JSONMatches.matches[i].gameId;
      }

      Promise.map(matchsId, function (item) { // old: .mapSeries
        return apicall(item);
      }).then(() => {
        console.timeEnd('getMatches');
        console.log('Finished');
        callback(JSONMatches);
      }).catch(err => {
        console.log('Error');
        console.log(err.statusCode);
      });

    }
  });
}

// Add match to global JSON
function addMatchToJSON(obj) {
  //console.log(obj.gameId);
  for (let i = 0; i < JSONMatches.matches.length; i++) {
    if (JSONMatches.matches[i].gameId == obj.gameId) {
      //console.log('yes');
      JSONMatches.matches[i] = obj;
    }
  }
}