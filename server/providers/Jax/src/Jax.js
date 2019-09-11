const RiotRateLimiter = require('riot-ratelimiter')
const { STRATEGY } = require('riot-ratelimiter/dist/RateLimiter')
const LeagueEndpoint = require('./Endpoints/LeagueEndpoint')
const MatchEndpoint = require('./Endpoints/MatchEndpoint')
const MatchlistEndpoint = require('./Endpoints/MatchlistEndpoint')
const SummonerEndpoint = require('./Endpoints/SummonerEndpoint')

const DDragonVersionEndpoint = require('./Endpoints/DDragonEndpoints/DDragonVersionEndpoint')
const DDragonChampionEndpoint = require('./Endpoints/DDragonEndpoints/DDragonChampionEndpoint')

class Jax {
  constructor(key, region = 'euw1') {
    this.key = key
    const limiterOptions = {
      strategy: STRATEGY.BURST
    }
    this.limiter = new RiotRateLimiter(limiterOptions)
    this.region = region

    this.League = new LeagueEndpoint(this.limiter, this.region)
    this.Match = new MatchEndpoint(this.limiter, this.region)
    this.Matchlist = new MatchlistEndpoint(this.limiter, this.region)
    this.Summoner = new SummonerEndpoint(this.limiter, this.region)

    this.initDDragon()
  }

  async initDDragon() {
    this.version = (await new DDragonVersionEndpoint().list())[0]

    this.DDragon = {
      Champion: new DDragonChampionEndpoint(this.version),
      Version: this.version
    }
  }

  set regionName(regionName) {
    this.region = regionName
    const blacklistedProperties = ['key', 'limiter', 'region', 'version', 'DDragon']

    for (const key of Object.getOwnPropertyNames(this)) {
      if(blacklistedProperties.includes(key)) continue

      this[key].region = regionName
    }
  }
}

module.exports = Jax
