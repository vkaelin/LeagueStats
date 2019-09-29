'use strict'

const Match = use('App/Models/Match')
const Jax = use('Jax')
const MatchTransformer = use('App/Transformers/MatchTransformer')

class SummonerController {

  /**
   *  POST Endpoint : get summoner data
   */
  async api({ request, response, transform }) {
    const summoner = request.input('summoner')
    const region = request.input('region')

    const data = await this.getSummonerData(summoner, region, transform)
    response.json(data)
  }

  /**
   *  Get the matchlist of all matches made less than 4 months ago by the Summoner
   * @param today 
   * @param accountId 
   * @param beginIndex 
   * @param allMatches 
   */
  async getMatchList(today, accountId, beginIndex, allMatches) {
    const { matches } = await Jax.Matchlist.accountID(accountId, beginIndex)

    allMatches = [...allMatches, ...matches]

    const lastMatch = matches[matches.length - 1].timestamp
    const diff = today - lastMatch
    console.log(diff)
    // More matches to get from Riot API if they are younger than 4 months
    if (matches.length === 100 && diff < 10368000000) {
      return this.getMatchList(today, accountId, (beginIndex + 100), allMatches)
    } else {
      console.log('return all matches bro')
      return allMatches
    }
  }

  /**
   *  Get all the data about the searched Summoner
   * @param summoner
   * @param region 
   */
  async getSummonerData(summoner, region, transform) {
    console.time('all')

    console.log(summoner, region)

    const regexSummonerName = new RegExp('^[0-9\\p{L} _\\.]+$', 'u')
    if (!regexSummonerName.exec(summoner)) {
      return null
    }

    const finalJSON = {}
    Jax.regionName = region

    try {
      const account = await Jax.Summoner.summonerName(summoner)

      // Check if the summoner is found
      if (!account) return null

      finalJSON.account = account

      const ranked = await Jax.League.summonerID(account.id)
      const soloQ = ranked.filter(e => e.queueType === 'RANKED_SOLO_5x5')
      finalJSON.soloQ = soloQ.length ? soloQ[0] : null;

      console.time('getMatches')
      const today = Date.now()
      const matches = await this.getMatchList(today, account.accountId, 0, [])
      const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)

      let matchesDetails = []
      const matchesToGetFromRiot = []
      for (let i = 0; i < gameIds.length; ++i) {
        // const matchSaved = await Match.where({ gameId: gameIds[i] }).first()
        const matchSaved = await Match.where({ gameId: gameIds[i], puuid: account.puuid }).first()
        if (matchSaved) {
          console.log('match in mongodb')
          matchesDetails.push(matchSaved)
        } else {
          console.log('match to get from api')
          matchesToGetFromRiot.push(gameIds[i])
        }
      }

      const requests = matchesToGetFromRiot.map(Jax.Match.get)
      let matchesFromApi = await Promise.all(requests)

      /* If we have to same some matches in the db */
      if (matchesFromApi.length !== 0) {
        const champions = await Jax.DDragon.Champion.list()
        const runes = await Jax.DDragon.Rune.list()
        const ctx = {
          account,
          champions: champions.data,
          runes
        }
        matchesFromApi = await transform.collection(matchesFromApi)
          .transformWith(MatchTransformer)
          .withContext(ctx)
          .toJSON()

        matchesDetails = [...matchesDetails, ...matchesFromApi]

        /* Save all matches in db */
        for (const match of matchesFromApi) {
          await Match.create(match)
          console.log('match saved')
        }
      }

      /* Sort 10 matches */
      matchesDetails.sort((a, b) => (a.gameCreation < b.gameCreation) ? -1 : 1)

      finalJSON.matchesDetails = matchesDetails
      finalJSON.allMatches = matches

      console.timeEnd('getMatches')
      console.timeEnd('all')
      return finalJSON
    } catch (error) {
      console.log('username not found')
      console.log(error)
      return null
    }
  }
}

module.exports = SummonerController
