import Jax from './Jax'
import { getSeasonNumber, notEmpty } from 'App/helpers'
import { V4MatchReferenceDto } from './Jax/src/Endpoints/MatchlistV4Endpoint'
import { SummonerDTO } from './Jax/src/Endpoints/SummonerEndpoint'
import MatchV4Parser from 'App/Parsers/MatchV4Parser'
import Match from 'App/Models/Match'

class MatchService {
  private async _fetchMatchListUntil(account: SummonerDTO, region: string) {
    let matchList: V4MatchReferenceDto[] = []
    let alreadyIn = false
    let index = 0
    do {
      let newMatchList = await Jax.MatchlistV4.accountID(account.accountId, region, index)
      // Error while fetching Riot API
      if (!newMatchList) {
        matchList = matchList.map((m) => {
          m.seasonMatch = getSeasonNumber(m.timestamp)
          return m
        })
        return matchList
      }
      matchList = [...matchList, ...newMatchList.matches]
      alreadyIn = newMatchList.matches.length === 0
      // If the match is made in another region : we stop fetching
      if (matchList[matchList.length - 1].platformId.toLowerCase() !== region) {
        alreadyIn = true
      }
      index += 100
    } while (!alreadyIn)

    // Remove matches from MatchList made in another region, tutorial games, 3v3 games, Coop vs IA games
    const tutorialModes = [2000, 2010, 2020, 460, 470, 800, 810, 820, 830, 840, 850]
    matchList = matchList
      .filter((m) => {
        const sameRegion = m.platformId.toLowerCase() === region
        const notATutorialGame = !tutorialModes.includes(m.queue)

        return sameRegion && notATutorialGame
      })
      .map((m) => {
        m.seasonMatch = getSeasonNumber(m.timestamp)
        return m
      })

    return matchList
  }

  public async updateMatchList(account: SummonerDTO, region: string) {
    return this._fetchMatchListUntil(account, region)
  }

  public async getMatches(region: string, matchlist: V4MatchReferenceDto[]) {
    const matchesToGetFromRiot: number[] = []
    for (const match of matchlist) {
      const matchSaved = await Match.query()
        .where('id', MatchV4Parser.createMatchId(match.gameId, region))
        .first()
      if (!matchSaved) {
        matchesToGetFromRiot.push(match.gameId)
      }
    }

    const requests = matchesToGetFromRiot.map((gameId) => Jax.MatchV4.get(gameId, region))
    const matchesFromApi = await Promise.all(requests)
    const filteredMatches = matchesFromApi.filter(notEmpty)

    return filteredMatches.length ? await MatchV4Parser.parse(filteredMatches) : 0
  }
}

export default new MatchService()
