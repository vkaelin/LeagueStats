import { getSeasonNumber } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import MatchSerializer from './MatchSerializer'
import { SerializedMatch, SerializedMatchChampion } from './SerializedTypes'

class BasicMatchSerializer extends MatchSerializer {
  /**
   * Get champion specific data
   * @param id of the champion
   */
  protected getChampion(id: number): SerializedMatchChampion {
    const originalChampionData = this.champions.find((c) => c.id === id)
    const icon =
      'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/' +
      originalChampionData!.squarePortraitPath.split('/assets/')[1].toLowerCase()

    return {
      icon,
      id: originalChampionData!.id,
      name: originalChampionData!.name,
      alias: originalChampionData!.alias,
      roles: originalChampionData!.roles,
    }
  }

  public async serializeOneMatch(match: Match, puuid: string) {
    // : Promise<SerializedMatch>

    const players = await match.related('players').query()
    const identity = players.find((p) => p.summonerPuuid === puuid)!

    // TODO: keep going here
    return {
      allyTeam: null,
      champion: this.getChampion(identity.championId),
      date: match.date,
      enemyTeam: null,
      firstSum: identity.summoner1Id,
      matchId: match.id,
      gamemode: match.gamemode,
      items: null,
      level: identity.champLevel,
      map: match.map,
      name: identity.summonerName,
      perks: null,
      region: match.region,
      result: null,
      role: identity.teamPosition,
      season: getSeasonNumber(match.date),
      secondSum: identity.summoner2Id,
      stats: null,
      summonerId: identity.summonerId,
      summonerPuuid: puuid,
      time: match.gameDuration,
    }
  }
  public async serialize(matches: Match[], puuid: string) {
    // : Promise<SerializedMatch[]>

    await super.getContext()

    return matches.map((match) => this.serializeOneMatch(match, puuid))
  }
}

export default new BasicMatchSerializer()
