require('dotenv').config()
const express = require('express')
const request = require('request');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const Promise = require("bluebird");
const responseTime = require('response-time')
const cors = require('cors');
const app = express()

/* Global Variables */
const data = {
  key: process.env.API_KEY,
  region: 'euw1',
  summonerID: '',
  accountID: '',
  username: '',
  JSONMatches: [],
  finalJSON: []
}

/* Set Port */
app.set('port', (process.env.PORT || 5000))

/* Setup Cors */
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://leaguestats-gg.netlify.com',
    'https://leaguestats.valentinkaelin.ch/'
  ]
}));

/* Setup Production */
if (process.env.NODE_ENV !== 'development') {
  const path = require('path');
  const history = require('connect-history-api-fallback');
  const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));
  app.use(staticFileMiddleware);
  app.use(history({
    disableDotRule: true,
    verbose: true
  }));
  app.use(staticFileMiddleware);

  app.get('/', function (req, res) {
    res.render(path.join(__dirname + '/dist/index.html'));
  });
}

/* To retrieve data of post request */
app.use(bodyParser.json());    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}));

// Create a middleware that adds a X-Response-Time header to responses
app.use(responseTime());

/* Launch app */
app.listen(app.get('port'), () => console.log(`RiotAPI app listening on port ${app.get('port')}!`))

// Send data of a summoner
app.post('/api', function (req, res) {
  console.log('API Request');
  console.log(req.body.summoner);
  console.log(req.body.region);
  //console.log(req.body.playerName);
  console.time('all')
  data.region = req.body.region;
  data.username = req.body.summoner;
  data.finalJSON = [];
  getAccountInfos(res);
});

// Get account infos of an username
const getAccountInfos = function (res) {
  request(`https://${data.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(data.username)}?api_key=${data.key}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let JSONBody = JSON.parse(body);
      data.summonerID = JSONBody.id;
      data.accountID = JSONBody.accountId;
      data.finalJSON.push(JSONBody)
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
  request(`https://${data.region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.summonerID}?api_key=${data.key}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let JSONBody = JSON.parse(body);
      if (JSONBody.length > 0) {
        data.finalJSON.push(...JSONBody);
        if (JSONBody.length === 1) data.finalJSON.push(null);
      } else {
        console.log('empty rank stats')
        data.finalJSON.push(null, null);
      }
      getMatches(res);
    }
  })
}

// Get 100 matches basic infos and 10 matches details of an accountID
const getMatches = function (res) {
  console.time('getMatches');

  request(`https://${data.region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${data.accountID}?endIndex=100&api_key=${data.key}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const allMatches = JSON.parse(body)
      data.JSONMatches = allMatches.matches.slice(0, 10)
      const matchsId = data.JSONMatches.map(x => x.gameId)

      Promise.map(matchsId, function (id) {
        return getMatch('match/v4/matches/' + id);
      }).then(() => {
        console.timeEnd('getMatches');
        console.log('Finished - Data sent to front');
        data.finalJSON.push(data.JSONMatches)
        data.finalJSON.push(allMatches)
        res.send(data.finalJSON);
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
  return rp({ url: `https://${data.region}.api.riotgames.com/lol/${urlApi}?api_key=${data.key}`, json: true }).then(function (obj) {
    data.JSONMatches = data.JSONMatches.map((match) => match.gameId === obj.gameId ? obj : match);
  });
}
