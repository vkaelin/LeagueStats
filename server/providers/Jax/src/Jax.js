const RiotRateLimiter = require('riot-ratelimiter')
const LeagueEndpoint = require('./Endpoints/LeagueEndpoint')
const MatchEndpoint = require('./Endpoints/MatchEndpoint')
const MatchlistEndpoint = require('./Endpoints/MatchlistEndpoint')
const SpectatorEndpoint = require('./Endpoints/SpectatorEndpoint')
const SummonerEndpoint = require('./Endpoints/SummonerEndpoint')

const DDragonVersionEndpoint = require('./Endpoints/DDragonEndpoints/DDragonVersionEndpoint')
const DDragonChampionEndpoint = require('./Endpoints/DDragonEndpoints/DDragonChampionEndpoint')
const DDragonRuneEndpoint = require('./Endpoints/DDragonEndpoints/DDragonRuneEndpoint')
const DDragonItemEndpoint = require('./Endpoints/DDragonEndpoints/DDragonItemEndpoint')

class Jax {
  constructor(config) {
    this.key = config.key
    const limiterOptions = {
      strategy: config.requestOptions.strategy
    }
    this.limiter = new RiotRateLimiter(limiterOptions)
    this.config = config

    this.League = new LeagueEndpoint(this.config, this.limiter)
    this.Match = new MatchEndpoint(this.config, this.limiter)
    this.Matchlist = new MatchlistEndpoint(this.config, this.limiter)
    this.Spectator = new SpectatorEndpoint(this.config, this.limiter)
    this.Summoner = new SummonerEndpoint(this.config, this.limiter)

    this.initDDragon()
  }

  async initDDragon() {
    this.version = (await new DDragonVersionEndpoint().list())[0]

    this.DDragon = {
      Champion: new DDragonChampionEndpoint(this.version),
      Item: new DDragonItemEndpoint(this.version),
      Rune: new DDragonRuneEndpoint(this.version),
      Version: this.version
    }
  }

  set regionName(regionName) {
    this.config.region = regionName
    const blacklistedProperties = ['key', 'limiter', 'config', 'version', 'DDragon']

    for (const key of Object.getOwnPropertyNames(this)) {
      if(blacklistedProperties.includes(key)) continue

      this[key].region = regionName
    }
  }
}

module.exports = Jax
