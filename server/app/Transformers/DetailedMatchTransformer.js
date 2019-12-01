'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const SummonerService = use('App/Services/SummonerService')

/**
 * DetailedMatchTransformer class
 *
 * @class DetailedMatchTransformer
 */
class DetailedMatchTransformer extends MatchTransformer {
  /**
   * Transform raw data from Riot API
   * @param match data from Riot API
   */
  async transform(match) {
    await super.getContext()

    // Global data
    const globalInfos = super.getGameInfos(match)

    // Teams
    const firstTeam = await this.getTeamData(match, match.teams[0])
    const secondTeam = await this.getTeamData(match, match.teams[1])

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
   * @param match raw match data from Riot API
   * @param team raw team data from Riot API
   */
  async getTeamData(match, team) {
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
          b.champion = super.getChampion(b.championId)
        }
        return b
      })
    }

    // Players
    let players = teamPlayers
      .map(p => super.getPlayerData(match, p, true, teamStats))
      .sort(this.sortTeamByRole)

    const requests = players.map(p => this.getPlayerRank(p, match.platformId))
    players = await Promise.all(requests)

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
   * Get the soloQ rank of all the players of the team
   * @param summoner all the data of the summoner
   * @param region of the match
   */
  async getPlayerRank(summoner, region) {
    const account = await SummonerService.getAccount(summoner.name, region)
    if (account) {
      const ranked = await SummonerService.getRanked(account)
      summoner.rank = ranked.soloQ ? (({ tier, shortName }) => ({ tier, shortName }))(ranked.soloQ) : null
    } else {
      summoner.rank = null
    }

    return summoner
  }
}

module.exports = new DetailedMatchTransformer()
