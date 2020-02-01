'use strict'

const Helpers = use('App/helpers')
const MatchRepository = make('App/Repositories/MatchRepository')

class StatsService {
  constructor() {
    this.matchRepository = MatchRepository
  }

  async getSummonerStats(account, season) {
    this.matchRepository.season = season
    const globalStats = await this.matchRepository.globalStats(account.puuid)
    const gamemodeStats = await this.matchRepository.gamemodeStats(account.puuid)
    const roleStats = await this.matchRepository.roleStats(account.puuid)
    // Check if all roles are in the array
    const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    for (const role of roles) {
      if (!roleStats.find(r => r.role === role)) {
        roleStats.push({
          count: 0,
          losses: 0,
          role,
          wins: 0
        })
      }
    }
    const championStats = await this.matchRepository.championStats(account.puuid, 5)
    const championClassStats = await this.matchRepository.championClassStats(account.puuid)
    const mates = await this.matchRepository.mates(account.puuid)

    return {
      global: globalStats[0],
      league: gamemodeStats,
      role: roleStats.sort(Helpers.sortTeamByRole),
      class: championClassStats,
      mates,
      champion: championStats,
    }
  }
}

module.exports = new StatsService()