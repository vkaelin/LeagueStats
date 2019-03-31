require('dotenv').config()
const express = require('express')
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const Promise = require("bluebird");
const app = express()
const history = require('connect-history-api-fallback');

/* Global Variables */
const key = process.env.API_KEY;
let summonerID;
let accountID;
let username;
let JSONMatches;
let finalJSON = [];

/* Set Port */
app.set('port', (process.env.PORT || 5000))

/* DEV */
var cors = require('cors');
app.use(cors({origin: '*'}));

/* PRODUCTION */
/*const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));
app.use(staticFileMiddleware);
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(staticFileMiddleware);

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/dist/index.html'));
});*/

/* To retrieve data of post request */
app.use(bodyParser.json());    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
 extended: true
}));

/* Launch app */
app.listen(app.get('port'), () => console.log(`RiotAPI app listening on port ${app.get('port')}!`))

// Send data of a summoner
app.post('/api', function (req, res) {
  console.log('API Request');
  console.log(req.body.summoner);
  //console.log(req.body.playerName);
  console.time('all')
  username = req.body.summoner;
  finalJSON = [];
  getAccountInfos(res);
});

// Get account infos of an username
const getAccountInfos = function (res) {
  request('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(username) + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let JSONBody = JSON.parse(body);
      summonerID = JSONBody.id;
      accountID = JSONBody.accountId;
      finalJSON.push(JSONBody)
      getRanked(res);
    }
    else {
      console.log(response.statusCode);
      console.log('username not found');
      res.send(null);
    }
  });
}

// Get data of rankeds stats
const getRanked = function (res) {
  request('https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/' + summonerID + '?api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let JSONBody = JSON.parse(body);
      if (JSONBody.length > 0) {
        finalJSON.push(...JSONBody);
        if (JSONBody.length === 1) finalJSON.push(null);
      } else {
        console.log('empty rank stats')
        finalJSON.push(null, null);
      }
      getMatches(res);
    }
  })
}

// Get 10 matches of an accountID
const getMatches = function (res) {
  console.time('getMatches');

  request('https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountID + '?endIndex=10&api_key=' + key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      JSONMatches = JSON.parse(body);
      const matchsId = JSONMatches.matches.map(x => x.gameId)

      Promise.map(matchsId, function (id) {
        return getMatch('match/v4/matches/' + id);
      }).then(() => {
        console.timeEnd('getMatches');
        console.log('Finished - Data sent to front');
        finalJSON.push(JSONMatches)
        res.send(finalJSON);
        console.timeEnd('all')
      }).catch(err => {
        console.log('Error Promise');
        console.log(err);
      });
    }
  });
}

// Get data of one match
const getMatch = async function (urlApi) {
  //console.log(urlApi);
  return rp({ url: 'https://euw1.api.riotgames.com/lol/' + urlApi + '?api_key=' + key, json: true }).then(function (obj) {
    JSONMatches.matches = JSONMatches.matches.map((match) => match.gameId === obj.gameId ? obj : match);
  });
}
