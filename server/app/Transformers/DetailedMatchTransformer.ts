import { Ban, DetailedMatchModel } from 'App/Models/DetailedMatch'
import { MatchDto, TeamDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
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
  private getTeamData (match: MatchDto, team: TeamDto) {
    let win = team.win ? 'Win' : 'Fail'
    if (match.info.gameDuration < 300) {
      win = 'Remake'
    }

    // Global stats of the team
    const teamPlayers = match.info.participants.filter(p => p.teamId === team.teamId)
    const teamStats = teamPlayers.reduce((prev, cur) => {
      prev.kills += cur.kills
      prev.deaths += cur.deaths
      prev.assists += cur.assists
      prev.gold += cur.goldEarned
      prev.dmgChamp += cur.totalDamageDealtToChampions
      prev.dmgObj += cur.damageDealtToObjectives
      prev.dmgTaken += cur.totalDamageTaken
      return prev
    }, { kills: 0, deaths: 0, assists: 0, gold: 0, dmgChamp: 0, dmgObj: 0, dmgTaken: 0 })

    // Bans
    const bans: Ban[] = []
    if (team.bans) {
      for (const ban of team.bans) {
        const champion = (ban.championId === -1) ? { id: null, name: null } : super.getChampion(ban.championId)

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
      barons: team.objectives.baron.kills,
      color: team.teamId === 100 ? 'Blue' : 'Red',
      dragons: team.objectives.dragon.kills,
      inhibitors: team.objectives.inhibitor.kills,
      players,
      result: win,
      riftHerald: team.objectives.riftHerald.kills,
      teamStats,
      towers: team.objectives.tower.kills,
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
    const firstTeam = this.getTeamData(match, match.info.teams[0])
    const secondTeam = this.getTeamData(match, match.info.teams[1])

    // Roles
    super.getMatchRoles(match, firstTeam.players, secondTeam.players)

    return {
      gameId: match.info.gameId,
      blueTeam: firstTeam.color === 'Blue' ? firstTeam : secondTeam,
      redTeam: firstTeam.color === 'Blue' ? secondTeam : firstTeam,
      ...globalInfos,
    }
  }
}

export default new DetailedMatchTransformer()
