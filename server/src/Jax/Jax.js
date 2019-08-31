const RiotRateLimiter = require('riot-ratelimiter')

import SummonerEndpoint from './Endpoints/SummonerEndpoint'

class Jax {
  constructor(key = process.env.API_KEY, region = 'euw1') {
    this.key = key
    this.limiter = new RiotRateLimiter()
    this.region = region

    this.Summoner = new SummonerEndpoint(this.limiter, this.region)
  }
  
  set regionName(regionName) {
    this.region = regionName
  }
}

module.exports = {
  Jax
}
