import { getSeasonNumber, sortTeamByRole } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import CDragonService from 'App/Services/CDragonService'
import MatchSerializer from './MatchSerializer'
import {
  SerializedMatch,
  SerializedMatchChampion,
  SerializedMatchItem,
  SerializedMatchPerks,
  SerializedMatchStats,
  SerializedMatchSummonerSpell,
  SerializedMatchTeamPlayer,
} from './SerializedTypes'

class BasicMatchSerializer extends MatchSerializer {
  /**
   * Get champion specific data
   * @param id of the champion
   */
  protected getChampion(id: number): SerializedMatchChampion {
    const originalChampionData = CDragonService.champions[id]
    const icon =
      CDragonService.BASE_URL +
      originalChampionData.squarePortraitPath.split('/assets/')[1].toLowerCase()

    return {
      icon,
      id: originalChampionData.id,
      name: originalChampionData.name,
      alias: originalChampionData.alias,
      roles: originalChampionData.roles,
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

  /**
   * Get Summoner Spell Data from CDragon
   * @param id of the summonerSpell
   */
  public getSummonerSpell(id: number): SerializedMatchSummonerSpell | null {
    const spell = CDragonService.summonerSpells[id]
    if (id === 0 || !spell) {
      return null
    }
    const spellName = spell.iconPath.split('/assets/')[1].toLowerCase()
    return {
      name: spell.name,
      description: spell.description,
      icon: `${CDragonService.BASE_URL}${spellName}`,
    }
  }

  protected getItems(player: MatchPlayer): Array<SerializedMatchItem | null> {
    const items: (SerializedMatchItem | null)[] = []
    for (let i = 0; i < 6; i++) {
      const id = player['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }

      const item = CDragonService.items[id]
      if (!item) {
        items.push(null)
        continue
      }

      const itemUrl = item.iconPath.split('/assets/')[1].toLowerCase()
      items.push({
        image: `${CDragonService.BASE_URL}${itemUrl}`,
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

  public serializeOneMatch(match: Match, puuid: string): SerializedMatch {
    const identity = match.players.find((p) => p.summonerPuuid === puuid)!

    const allyTeamColor = identity.team === 100 ? 'blueTeam' : 'redTeam'
    const allyTeam = match[allyTeamColor]

    const allyPlayers: MatchPlayer[] = []
    const enemyPlayers: MatchPlayer[] = []

    for (const p of match.players) {
      p.team === identity.team ? allyPlayers.push(p) : enemyPlayers.push(p)
    }

    return {
      allyTeam: this.getTeamSummary(allyPlayers),
      champion: this.getChampion(identity.championId),
      date: match.date,
      enemyTeam: this.getTeamSummary(enemyPlayers),
      matchId: match.id,
      gamemode: match.gamemode,
      items: this.getItems(identity),
      level: identity.champLevel,
      map: match.map,
      name: identity.summonerName,
      perks: this.getPerks(identity),
      region: match.region,
      result: allyTeam.result,
      role: identity.teamPosition.length ? identity.teamPosition : 'NONE',
      season: getSeasonNumber(match.date),
      stats: this.getStats(identity),
      summonerId: identity.summonerId,
      summonerSpell1: this.getSummonerSpell(identity.summoner1Id),
      summonerSpell2: this.getSummonerSpell(identity.summoner2Id),
      summonerPuuid: puuid,
      time: match.gameDuration,
    }
  }
  public serialize(matches: Match[], puuid: string): SerializedMatch[] {
    return matches.map((match) => this.serializeOneMatch(match, puuid))
  }
}

export default new BasicMatchSerializer()
