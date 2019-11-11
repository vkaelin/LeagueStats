'use strict'

const Jax = use('Jax')
const MatchHelper = use('App/Helpers/MatchHelper')
const Summoner = use('App/Models/Summoner')
const Match = use('App/Models/Match')

class SummonerController {
  /**
   *  POST Endpoint : get summoner data
   */
  async api({ request, response }) {
    console.time('all')
    const summoner = request.input('summoner')
    const region = request.input('region')
    console.log(summoner, region)

    const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
    if (!regexSummonerName.exec(summoner)) {
      return response.json(null)
    }

    const finalJSON = {}
    Jax.regionName = region

    try {
      const account = await Jax.Summoner.summonerName(summoner)
      // Check if the summoner is found
      if (!account) return response.json(null)
      account.region = region
      finalJSON.account = account

      // Summoner in DB
      const summonerDB = await Summoner.findOrCreate(
        { puuid: account.puuid },
        { puuid: account.puuid }
      )

      // CURRENT GAME
      const currentGame = await Jax.Spectator.summonerID(account.id)
      finalJSON.playing = !!currentGame

      // RANKED STATS
      const ranked = await Jax.League.summonerID(account.id)
      finalJSON.ranked = {
        soloQ: ranked.find(e => e.queueType === 'RANKED_SOLO_5x5') || null,
        flex5v5: ranked.find(e => e.queueType === 'RANKED_FLEX_SR') || null,
        flex3v3: ranked.find(e => e.queueType === 'RANKED_FLEX_TT') || null
      }

      // MATCH LIST
      await MatchHelper.updateMatchList(account, summonerDB)
      const matchList = summonerDB.matchList
      finalJSON.allMatches = matchList

      // MATCHES BASIC
      const gameIds = matchList.slice(0, 10).map(({ gameId }) => gameId)
      finalJSON.matchesDetails = await MatchHelper.getMatches(account, gameIds, summonerDB)

      // PATCH VERSION
      finalJSON.version = Jax.DDragon.Version

      // STATS
      console.time('STATS')
      const globalStats = await Match.globalStats(account.puuid)
      const gamemodeStats = await Match.gamemodeStats(account.puuid)
      const roleStats = await Match.roleStats(account.puuid)
      // Check if all roles are in the array
      const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
      for (const role of roles) {
        if (!roleStats.find(r => r.role === role)) {
          roleStats.push({
            count: 0,
            losses: 0,
            role,
            wins: 0
          })
        }
      }
      const championClassStats = await Match.championClassStats(account.puuid)
      const mates = await Match.mates(account.puuid, account.name)

      finalJSON.stats = {
        global: globalStats[0],
        league: gamemodeStats,
        role: roleStats.sort(MatchHelper.sortTeamByRole),
        class: championClassStats,
        mates,
      }
      console.timeEnd('STATS')

      // SAVE IN DB
      await summonerDB.save()
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return response.json(null)
    }

    console.timeEnd('all')
    return response.json(finalJSON)
  }
}

module.exports = SummonerController
