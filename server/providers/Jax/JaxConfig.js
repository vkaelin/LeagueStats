require('dotenv').config()
const { STRATEGY } = require('riot-ratelimiter/dist/RateLimiter')

const JAX_CONFIG = {
  key: process.env.API_KEY,
  region: 'euw1',
  requestOptions: {
    retriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    // strategy: process.env.NODE_ENV === 'production' ? STRATEGY.SPREAD : STRATEGY.BURST,
    strategy: STRATEGY.SPREAD,
  }
}

module.exports = JAX_CONFIG
