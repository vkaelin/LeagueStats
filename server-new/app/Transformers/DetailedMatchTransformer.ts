import { Ban, DetailedMatchModel } from 'App/Models/DetailedMatch'
import { Champion } from 'App/Models/Match'
import { MatchDto, TeamStatsDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import MatchTransformer from './MatchTransformer'

/**
 * DetailedMatchTransformer class
 *
 * @class DetailedMatchTransformer
 */
class DetailedMatchTransformer extends MatchTransformer {
  /**
   * Get all data of one team
   * @param match raw match data from Riot API
   * @param team raw team data from Riot API
   */
  private getTeamData (match: MatchDto, team: TeamStatsDto) {
    let win = team.win
    if (match.gameDuration < 300) {
      win = 'Remake'
    }

    // Global stats of the team
    const teamPlayers = match.participants.filter(p => p.teamId === team.teamId)
    const teamStats = teamPlayers.reduce((prev, cur) => {
      prev.kills += cur.stats.kills
      prev.deaths += cur.stats.deaths
      prev.assists += cur.stats.assists
      prev.gold += cur.stats.goldEarned
      prev.dmgChamp += cur.stats.totalDamageDealtToChampions
      prev.dmgObj += cur.stats.damageDealtToObjectives
      prev.dmgTaken += cur.stats.totalDamageTaken
      return prev
    }, { kills: 0, deaths: 0, assists: 0, gold: 0, dmgChamp: 0, dmgObj: 0, dmgTaken: 0 })

    // Bans
    const bans: Ban[] = []
    if (team.bans) {
      for (const ban of team.bans) {
        const champion: Champion<null, null> = (ban.championId === -1)
          ? { id: null, name: null }
          : super.getChampion(ban.championId)

        bans.push({
          ...ban,
          champion,
        })
      }
    }

    // Players
    let players = teamPlayers
      .map(p => super.getPlayerData(match, p, true, teamStats))
      .map(p => {
        p.firstSum = super.getSummonerSpell(p.firstSum as number)
        p.secondSum = super.getSummonerSpell(p.secondSum as number)
        return p
      })
      .sort(this.sortTeamByRole)

    return {
      bans,
      barons: team.baronKills,
      color: team.teamId === 100 ? 'Blue' : 'Red',
      dragons: team.dragonKills,
      inhibitors: team.inhibitorKills,
      players,
      result: win,
      riftHerald: team.riftHeraldKills,
      teamStats,
      towers: team.towerKills,
    }
  }

  /**
   * Transform raw data from Riot API
   * @param match data from Riot API
   */
  public async transform (match: MatchDto): Promise<DetailedMatchModel> {
    await super.getContext()

    // Global data
    const globalInfos = super.getGameInfos(match)

    // Teams
    const firstTeam = this.getTeamData(match, match.teams[0])
    const secondTeam = this.getTeamData(match, match.teams[1])

    // Roles
    super.getMatchRoles(match, firstTeam.players, secondTeam.players)

    return {
      gameId: match.gameId,
      blueTeam: firstTeam.color === 'Blue' ? firstTeam : secondTeam,
      redTeam: firstTeam.color === 'Blue' ? secondTeam : firstTeam,
      ...globalInfos,
    }
  }
}

export default new DetailedMatchTransformer()
