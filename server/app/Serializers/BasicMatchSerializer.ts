import { getSeasonNumber, sortTeamByRole } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import { TeamPosition } from 'App/Parsers/ParsedType'
import MatchSerializer from './MatchSerializer'
import { SerializedMatch, SerializedMatchStats, SerializedMatchTeamPlayer } from './SerializedTypes'

class BasicMatchSerializer extends MatchSerializer {
  protected getPlayerSummary(player: MatchPlayer): SerializedMatchTeamPlayer {
    return {
      puuid: player.summonerPuuid,
      champion: this.getChampion(player.championId),
      name: player.summonerName,
      role: TeamPosition[player.teamPosition],
    }
  }

  protected getTeamSummary(players: MatchPlayer[]): SerializedMatchTeamPlayer[] {
    return players.map((p) => this.getPlayerSummary(p)).sort(sortTeamByRole)
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

  public serializeOneMatch(match: Match, puuid: string, newMatch = false): SerializedMatch {
    const identity = match.players.find((p) => p.summonerPuuid === puuid)!
    const allyTeam = match.teams.find((t) => t.color === identity.team)!

    const allyPlayers: MatchPlayer[] = []
    const enemyPlayers: MatchPlayer[] = []

    for (const p of match.players) {
      p.team === identity.team ? allyPlayers.push(p) : enemyPlayers.push(p)
    }

    return {
      allyTeam: this.getTeamSummary(allyPlayers),
      date: match.date,
      enemyTeam: this.getTeamSummary(enemyPlayers),
      matchId: match.id,
      gamemode: match.gamemode,
      map: match.map,
      newMatch,
      region: match.region,
      result: allyTeam.result,
      season: getSeasonNumber(match.date),
      stats: this.getStats(identity),
      time: match.gameDuration,
      ...this.getPlayerBase(identity),
    }
  }
  public serialize(matches: Match[], puuid: string, newMatches = false): SerializedMatch[] {
    return matches.map((match) => this.serializeOneMatch(match, puuid, newMatches))
  }
}

export default new BasicMatchSerializer()
