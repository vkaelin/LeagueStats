import RiotRateLimiter from 'riot-ratelimiter'

import SummonerEndpoint from './Endpoints/SummonerEndpoint'

import DDragonVersionEndpoint from './Endpoints/DDragonEndpoints/DDragonVersionEndpoint'
import DDragonChampionEndpoint from './Endpoints/DDragonEndpoints/DDragonChampionEndpoint'

class Jax {
  constructor(key = process.env.API_KEY, region = 'euw1') {
    return (async () => {
      this.key = key
      this.limiter = new RiotRateLimiter()
      this.region = region

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
