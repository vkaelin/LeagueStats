require('dotenv').config({ path: __dirname + '/./../.env' })
const express = require('express')
const bodyParser = require('body-parser')
const responseTime = require('response-time')
const cors = require('cors')
const app = express()
import { Jax } from "./Jax"

/* Set Port */
app.set('port', (process.env.PORT || 5000))

/* Setup Cors */
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://leaguestats-gg.netlify.com',
    'https://leaguestats.valentinkaelin.ch/'
  ]
}))

/* To retrieve data of post request */
app.use(bodyParser.json())    // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  // to support URL-encoded bodies
  extended: true
}))

// Create a middleware that adds a X-Response-Time header to responses
app.use(responseTime())

// Setup Jax
let jax

/* Launch app */
app.listen(app.get('port'), async () => {
  console.log(`RiotAPI app listening on port ${app.get('port')}!`)
  jax = await new Jax()
})

// Send data of a summoner
app.post('/api', async function (req, res) {
  console.log('API Request')
  console.log(req.body.summoner, req.body.region)
  console.time('all')

  /* Check if the summonerName is correct before fetching Riot API */
  const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
  if (!regexSummonerName.exec(req.body.summoner)) {
    return res.send(null)
  }

  const finalJSON = {}
  jax.regionName = req.body.region

  try {
    const account = await jax.Summoner.summonerName(req.body.summoner)

    // Check if the summoner is found
    if (!account) return res.send(null)

    finalJSON.account = account

    const ranked = await jax.League.summonerID(account.id)
    const soloQ = ranked.filter(e => e.queueType === 'RANKED_SOLO_5x5')
    finalJSON.soloQ = soloQ.length ? soloQ[0] : null;

    console.time('getMatches')
    const { matches } = await jax.Matchlist.accountID(account.accountId)
    const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)
    const requests = gameIds.map(jax.Match.get)
    const results = await Promise.all(requests)
    finalJSON.matchesDetails = results
    finalJSON.allMatches = matches

    res.send(finalJSON)
    console.timeEnd('getMatches')
    console.timeEnd('all')
  } catch (error) {
    console.log('username not found')
    res.send(null)
  }
})

/* Get static file from Riot API */
app.post('/ddragon', async function (req, res) {
  console.log('DDragon Request')
  const endpoint = req.body.endpoint
  const result = await jax.DDragon[endpoint].list()
  res.send(result)
})
