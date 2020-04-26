const RiotRateLimiter = require('riot-ratelimiter')
const LeagueEndpoint = require('./Endpoints/LeagueEndpoint')
const MatchEndpoint = require('./Endpoints/MatchEndpoint')
const MatchlistEndpoint = require('./Endpoints/MatchlistEndpoint')
const SpectatorEndpoint = require('./Endpoints/SpectatorEndpoint')
const SummonerEndpoint = require('./Endpoints/SummonerEndpoint')

const CDragonEndpoint = require('./Endpoints/CDragonEndpoint')

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

    this.CDragon = new CDragonEndpoint()
  }

  set regionName(regionName) {
    this.config.region = regionName
    const blacklistedProperties = ['key', 'limiter', 'config', 'version', 'CDragon']

    for (const key of Object.getOwnPropertyNames(this)) {
      if(blacklistedProperties.includes(key)) continue

      this[key].region = regionName
    }
  }
}

module.exports = Jax
