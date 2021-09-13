import { getSeasonNumber, sortTeamByRole } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import MatchSerializer from './MatchSerializer'
import {
  SerializedMatch,
  SerializedMatchChampion,
  SerializedMatchItem,
  SerializedMatchPerks,
  SerializedMatchStats,
  SerializedMatchTeamPlayer,
} from './SerializedTypes'

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

  protected getPlayerSummary(player: MatchPlayer): SerializedMatchTeamPlayer {
    return {
      puuid: player.summonerPuuid,
      champion: this.getChampion(player.championId),
      name: player.summonerName,
      role: player.teamPosition,
    }
  }

  protected getTeamSummary(players: MatchPlayer[]): SerializedMatchTeamPlayer[] {
    return players.map((p) => this.getPlayerSummary(p)).sort(sortTeamByRole)
  }

  protected getItems(player: MatchPlayer): Array<SerializedMatchItem | null> {
    const items: (SerializedMatchItem | null)[] = []
    for (let i = 0; i < 6; i++) {
      const id = player['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }

      const item = this.items.find((i) => i.id === id)
      if (!item) {
        items.push(null)
        continue
      }

      const itemUrl = item.iconPath.split('/assets/')[1].toLowerCase()
      items.push({
        image: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${itemUrl}`,
        name: item.name,
        description: item.description,
        price: item.priceTotal,
      })
    }
    return items
  }

  protected getPerks(player: MatchPlayer): SerializedMatchPerks {
    return {
      primaryStyle: player.perksPrimaryStyle,
      secondaryStyle: player.perksSecondaryStyle,
      selected: player.perksSelected,
    }
  }

  protected getStats(player: MatchPlayer): SerializedMatchStats {
    return {
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      minions: player.minions,
      vision: player.visionScore,
      gold: player.gold,
      dmgChamp: player.damageDealtChampions,
      dmgObj: player.damageDealtObjectives,
      dmgTaken: player.damageTaken,
      kp: player.kp,
      kda: player.kills + player.assists !== 0 && player.deaths === 0 ? '∞' : player.kda,
      realKda: player.kda,
      criticalStrike: player.criticalStrike,
      killingSpree: player.killingSpree,
      doubleKills: player.doubleKills,
      tripleKills: player.tripleKills,
      quadraKills: player.quadraKills,
      pentaKills: player.pentaKills,
      heal: player.heal,
      towers: player.turretKills,
      longestLiving: player.timeSpentLiving,
    }
  }

  public async serializeOneMatch(match: Match, puuid: string): Promise<SerializedMatch> {
    // TODO: use a CDragon Service
    await super.getContext()

    // TODO: do we really need to...
    if (!match.players) {
      console.log('NEED TO LOAD')

      await match.load('players')
      await match.load('blueTeam')
      await match.load('redTeam')
    }

    const identity = match.players.find((p) => p.summonerPuuid === puuid)!

    const allyTeamColor = identity.team === 100 ? 'blueTeam' : 'redTeam'
    const allyTeam = match[allyTeamColor]

    const allyPlayers: MatchPlayer[] = []
    const enemyPlayers: MatchPlayer[] = []

    for (const p of match.players) {
      p.team === allyTeam.color ? allyPlayers.push(p) : enemyPlayers.push(p)
    }

    return {
      allyTeam: this.getTeamSummary(allyPlayers),
      champion: this.getChampion(identity.championId),
      date: match.date,
      enemyTeam: this.getTeamSummary(enemyPlayers),
      firstSum: identity.summoner1Id,
      matchId: match.id,
      gamemode: match.gamemode,
      items: this.getItems(identity),
      level: identity.champLevel,
      map: match.map,
      name: identity.summonerName,
      perks: this.getPerks(identity),
      region: match.region,
      result: allyTeam.result,
      role: identity.teamPosition,
      season: getSeasonNumber(match.date),
      secondSum: identity.summoner2Id,
      stats: this.getStats(identity),
      summonerId: identity.summonerId,
      summonerPuuid: puuid,
      time: match.gameDuration,
    }
  }
  public async serialize(matches: Match[], puuid: string): Promise<SerializedMatch[]> {
    await super.getContext()

    return await Promise.all(matches.map((match) => this.serializeOneMatch(match, puuid)))
  }
}

export default new BasicMatchSerializer()
