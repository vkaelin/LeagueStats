'use strict'

const Jax = use('Jax')
const Redis = use('Redis')

class SummonerService {
  async getRanked(account) {
    const rankedCache = await Redis.get(`ranked-${account.puuid}`)
    if (rankedCache) {
      console.log('RANKED CACHED')
      return JSON.parse(rankedCache)
    } else {
      const ranked = await Jax.League.summonerID(account.id)
      const result = {
        soloQ: ranked.find(e => e.queueType === 'RANKED_SOLO_5x5') || null,
        flex5v5: ranked.find(e => e.queueType === 'RANKED_FLEX_SR') || null,
        flex3v3: ranked.find(e => e.queueType === 'RANKED_FLEX_TT') || null
      }
      await Redis.set(`ranked-${account.puuid}`, JSON.stringify(result), 'EX', 10)
      return result
    }
  }
}

module.exports = new SummonerService()
