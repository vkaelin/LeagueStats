'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')

/**
 * DetailedMatchTransformer class
 *
 * @class DetailedMatchTransformer
 */
class DetailedMatchTransformer extends MatchTransformer {
  /**
   * Transform raw data from Riot API
   * @param match data from Riot API
   * @param ctx context
   */
  transform(match, { champions, runes, MatchHelper }) {
    this.match = match
    this.champions = champions
    this.runes = runes
    this.MatchHelper = MatchHelper

    // Global data
    const globalInfos = super.getGameInfos()

    // Teams
    const firstTeam = this.getTeamData(match.teams[0])
    const secondTeam = this.getTeamData(match.teams[1])

    return {
      gameId: match.gameId,
      season: match.seasonId,
      blueTeam: firstTeam.color === 'Blue' ? firstTeam : secondTeam,
      redTeam: firstTeam.color === 'Blue' ? secondTeam : firstTeam,
      ...globalInfos
    }
  }

  /**
   * Get all data of one team
   * @param team raw team data from Riot API
   */
  getTeamData(team) {
    let win = team.win
    if (this.match.gameDuration < 300) {
      win = 'Remake'
    }

    // Global stats of the team
    const teamPlayers = this.match.participants.filter(p => p.teamId === team.teamId)
    const teamStats = teamPlayers.reduce((prev, cur) => {
      prev.kills += cur.stats.kills
      prev.deaths += cur.stats.deaths
      prev.assists += cur.stats.assists
      prev.gold += cur.stats.goldEarned
      prev.dmgChamp += cur.stats.totalDamageDealtToChampions
      prev.dmgObj += cur.stats.damageDealtToObjectives
      prev.dmgTaken += cur.stats.totalDamageTaken
      return prev;
    }, { kills: 0, deaths: 0, assists: 0, gold: 0, dmgChamp: 0, dmgObj: 0, dmgTaken: 0 });

    // Bans
    let bans = null
    if (team.bans) {
      bans = team.bans.map(b => {
        if (b.championId === -1) {
          b.champion = {
            id: null,
            name: null
          }
        } else {
          b.champion = (({ id, name }) => ({ id, name }))(Object.entries(this.champions).find(([, champion]) => Number(champion.key) === b.championId)[1])
        }
        return b
      })
    }

    // Players
    const players = teamPlayers
      .map(p => super.getPlayerData(p, true, teamStats))
      .sort(this.MatchHelper.sortTeamByRole)

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
}

module.exports = new DetailedMatchTransformer()
