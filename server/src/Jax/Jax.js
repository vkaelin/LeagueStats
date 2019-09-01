import RiotRateLimiter from 'riot-ratelimiter'
import { STRATEGY } from 'riot-ratelimiter/dist/RateLimiter'


import LeagueEndpoint from './Endpoints/LeagueEndpoint'
import MatchEndpoint from './Endpoints/MatchEndpoint'
import MatchlistEndpoint from './Endpoints/MatchlistEndpoint'
import SummonerEndpoint from './Endpoints/SummonerEndpoint'

import DDragonVersionEndpoint from './Endpoints/DDragonEndpoints/DDragonVersionEndpoint'
import DDragonChampionEndpoint from './Endpoints/DDragonEndpoints/DDragonChampionEndpoint'

class Jax {
  constructor(key = process.env.API_KEY, region = 'euw1') {
    return (async () => {
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

      this.version = (await new DDragonVersionEndpoint().list())[0]

      this.DDragon = {
        Champion: new DDragonChampionEndpoint(this.version),
        Version: this.version
      }

      return this
    })()

  }

  set regionName(regionName) {
    this.region = regionName
  }
}

module.exports = {
  Jax
}
