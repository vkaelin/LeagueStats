import Jax from './Jax'
import { MatchlistDto } from './Jax/src/Endpoints/MatchlistEndpoint'
import Database from '@ioc:Adonis/Lucid/Database'
import MatchParser from 'App/Parsers/MatchParser'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'
import { SerializedMatch } from 'App/Serializers/SerializedTypes'
import Match from 'App/Models/Match'
import { notEmpty, tutorialQueues } from 'App/helpers'
import SummonerMatchlist from 'App/Models/SummonerMatchlist'

export enum MatchListMode {
  FIRSTIME = 'firstTime',
  UPDATE = 'update',
  LIGHT = 'light',
}

class MatchService {
  /**
   * Add 100 matches at a time to MatchList until the stopFetching condition is true
   * @param puuid of the summoner
   * @param region of the summoner
   * @param stopFetching condition to stop fetching the MatchList
   */
  private async _fetchMatchListUntil(puuid: string, region: string, stopFetching: any) {
    let matchList: MatchlistDto = []
    let alreadyIn = false
    let index = 0
    do {
      console.log('--> CALL TO RIOT MATCHLIST')
      const newMatchList = await Jax.Matchlist.puuid(puuid, region, index)
      // Error while fetching Riot API
      if (!newMatchList) {
        return matchList
      }
      matchList = [...matchList, ...newMatchList]
      alreadyIn = newMatchList.length === 0 || stopFetching(newMatchList)
      // If the match is made in another region : we stop fetching
      if (matchList[matchList.length - 1].split('_')[0].toLowerCase() !== region.toLowerCase()) {
        alreadyIn = true
      }
      index += 100
    } while (!alreadyIn)
    return matchList
  }

  /**
   * Update the MatchList of the summoner
   */
  public async updateMatchList(
    puuid: string,
    region: string,
    fetchMode: MatchListMode
  ): Promise<MatchlistDto> {
    console.time('matchList')

    const currentMatchList = await SummonerMatchlist.query()
      .where('summoner_puuid', puuid)
      .orderBy('matchId', 'asc')
    const currentMatchListIds = currentMatchList.map((m) => m.matchId)

    // Condition to stop fetching the matchlist
    function stopFetching(newMatchList: MatchlistDto) {
      switch (fetchMode) {
        case MatchListMode.FIRSTIME:
          return false
        case MatchListMode.UPDATE:
          return currentMatchListIds.some((id) => id === newMatchList[newMatchList.length - 1])
        case MatchListMode.LIGHT:
        default:
          return true
      }
    }

    console.time('RiotMatchList')
    const newMatchList = await this._fetchMatchListUntil(puuid, region, stopFetching)
    console.timeEnd('RiotMatchList')

    const matchListToSave: MatchlistDto = []
    for (const matchId of newMatchList.reverse()) {
      if (!currentMatchListIds.some((id) => id === matchId)) {
        matchListToSave.push(matchId)
        currentMatchListIds.push(matchId)
      }
    }

    // If there is new matchIds to save in database
    if (matchListToSave.length) {
      await Database.table('summoner_matchlist').multiInsert(
        matchListToSave.map((id) => ({
          match_id: id,
          summoner_puuid: puuid,
        }))
      )
    }

    console.timeEnd('matchList')
    return currentMatchListIds.reverse()
  }

  /**
   * Fetch list of matches for a specific Summoner
   */
  public async getMatches(
    region: string,
    matchIds: string[],
    puuid: string
  ): Promise<SerializedMatch[]> {
    console.time('getMatches')

    const matches: SerializedMatch[] = []
    const matchesToGetFromRiot: MatchlistDto = []
    for (let i = 0; i < matchIds.length; ++i) {
      const matchSaved = await Match.query()
        .where('id', matchIds[i])
        .preload('teams')
        .preload('players')
        .first()

      if (matchSaved) {
        // TODO: Serialize match from DB + put it in Redis + push it in "matches"
        matches.push(BasicMatchSerializer.serializeOneMatch(matchSaved, puuid))
      } else {
        matchesToGetFromRiot.push(matchIds[i])
      }
    }

    const requests = matchesToGetFromRiot.map((gameId) => Jax.Match.get(gameId, region))
    const matchesFromApi = await Promise.all(requests)

    /* If we have to store some matches in the db */
    if (matchesFromApi.length !== 0) {
      // Remove bugged matches from the Riot API + tutorial games
      const filteredMatches = matchesFromApi
        .filter(notEmpty)
        .filter(
          (m) =>
            !tutorialQueues.includes(m.info.queueId) &&
            m.info.teams.length > 0 &&
            m.info.participants.length > 0
        )

      // Transform raw matches data
      const parsedMatches: any = await MatchParser.parse(filteredMatches)

      // TODO: Serialize match from DB + put it in Redis + push it in "matches"
      const serializedMatches = BasicMatchSerializer.serialize(parsedMatches, puuid, true)
      matches.push(...serializedMatches)
    }

    // Todo: check if we need to sort here
    matches.sort((a, b) => (a.date < b.date ? 1 : -1))
    console.timeEnd('getMatches')
    return matches
  }
}

export default new MatchService()
