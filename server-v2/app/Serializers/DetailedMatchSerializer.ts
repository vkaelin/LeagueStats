import { sortTeamByRole } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import MatchTeam from 'App/Models/MatchTeam'
import MatchSerializer from './MatchSerializer'
import {
  SerializedDetailedMatch,
  SerializedDetailedMatchBan,
  SerializedDetailedMatchPlayer,
  SerializedDetailedMatchStats,
  SerializedDetailedMatchTeam,
  SerializedDetailedMatchTeamStats,
} from './SerializedTypes'

class DetailedMatchSerializer extends MatchSerializer {
  protected getTeamBans(team: MatchTeam): SerializedDetailedMatchBan[] {
    if (!team.bans || !team.banOrders) {
      return []
    }

    return team.bans.map((banId, index) => {
      return {
        champion: this.getChampion(banId),
        championId: banId,
        pickTurn: team.banOrders![index],
      }
    })
  }

  protected getTeamStats(players: MatchPlayer[]): SerializedDetailedMatchTeamStats {
    return players.reduce(
      (acc, player) => {
        acc.kills += player.kills
        acc.deaths += player.deaths
        acc.assists += player.assists
        acc.gold += player.gold
        acc.dmgChamp += player.damageDealtChampions
        acc.dmgObj += player.damageDealtObjectives
        acc.dmgTaken += player.damageTaken
        return acc
      },
      { kills: 0, deaths: 0, assists: 0, gold: 0, dmgChamp: 0, dmgObj: 0, dmgTaken: 0 }
    )
  }

  protected getPlayersDetailed(
    players: MatchPlayer[],
    teamStats: SerializedDetailedMatchTeamStats,
    gameDuration: number
  ): SerializedDetailedMatchPlayer[] {
    return players
      .map((player) => {
        const stats: SerializedDetailedMatchStats = {
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          minions: player.minions,
          vision: player.visionScore,
          gold: player.gold,
          dmgChamp: player.damageDealtChampions,
          dmgObj: player.damageDealtObjectives,
          dmgTaken: player.damageTaken,
          kp: player.kp.toFixed(1) + '%',
          kda: player.kills + player.assists !== 0 && player.deaths === 0 ? '∞' : player.kda,
          realKda: player.kda,
        }
        const percentStats = {
          minions: +(player.minions / (gameDuration / 60)).toFixed(2),
          vision: +(player.visionScore / (gameDuration / 60)).toFixed(2),
          gold: +((player.gold * 100) / teamStats.gold).toFixed(1) + '%',
          dmgChamp: +((player.damageDealtChampions * 100) / teamStats.dmgChamp).toFixed(1) + '%',
          dmgObj:
            +(
              teamStats.dmgObj ? (player.damageDealtObjectives * 100) / teamStats.dmgObj : 0
            ).toFixed(1) + '%',
          dmgTaken: +((player.damageTaken * 100) / teamStats.dmgTaken).toFixed(1) + '%',
        }
        const rank = player.ranks.length
          ? player.ranks.reduce((acc, rank) => {
              acc[rank.gamemode] = this.getPlayerRank(rank)
              return acc
            }, {})
          : undefined
        return {
          ...this.getPlayerBase(player),
          ...this.getRuneIcons(player.perksSelected, player.perksSecondaryStyle),
          id: player.id,
          stats,
          percentStats,
          rank,
        }
      })
      .sort(sortTeamByRole)
  }

  protected getTeamDetailed(
    team: MatchTeam,
    players: MatchPlayer[],
    gameDuration: number
  ): SerializedDetailedMatchTeam {
    const teamStats = this.getTeamStats(players)

    return {
      bans: this.getTeamBans(team),
      barons: team.barons,
      color: team.color === 100 ? 'Blue' : 'Red',
      dragons: team.dragons,
      inhibitors: team.inhibitors,
      players: this.getPlayersDetailed(players, teamStats, gameDuration),
      result: team.result,
      riftHeralds: team.riftHeralds,
      teamStats,
      towers: team.towers,
    }
  }

  public serializeOneMatch(match: Match): { match: SerializedDetailedMatch; ranksLoaded: boolean } {
    const blueTeam = match.teams.find((team) => team.color === 100)!
    const redTeam = match.teams.find((team) => team.color === 200)!

    const bluePlayers: MatchPlayer[] = []
    const redPlayers: MatchPlayer[] = []

    let ranksLoaded = false

    for (const p of match.players) {
      p.team === 100 ? bluePlayers.push(p) : redPlayers.push(p)

      if (p.ranks.length) {
        ranksLoaded = true
      }
    }

    const serializedMatch = {
      blueTeam: this.getTeamDetailed(blueTeam, bluePlayers, match.gameDuration),
      date: match.date,
      matchId: match.id,
      gamemode: match.gamemode,
      map: match.map,
      redTeam: this.getTeamDetailed(redTeam, redPlayers, match.gameDuration),
      region: match.region,
      season: match.season,
      time: match.gameDuration,
    }

    return {
      match: serializedMatch,
      ranksLoaded,
    }
  }
}

export default new DetailedMatchSerializer()
