'use strict'

const Helpers = use('App/helpers')
const MatchRepository = make('App/Repositories/MatchRepository')

class StatsService {
  constructor() {
    this.matchRepository = MatchRepository
  }

  async getSummonerStats(account, season) {
    this.matchRepository.season = season
    console.time('GLOBAL')
    const globalStats = await this.matchRepository.globalStats(account.puuid)
    console.timeEnd('GLOBAL')
    console.time('GAMEMODE')
    const gamemodeStats = await this.matchRepository.gamemodeStats(account.puuid)
    console.timeEnd('GAMEMODE')
    console.time('ROLE')
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
    console.timeEnd('ROLE')
    console.time('CHAMPION')
    const championStats = await this.matchRepository.championStats(account.puuid, 5)
    console.timeEnd('CHAMPION')
    console.time('CHAMPION-CLASS')
    const championClassStats = await this.matchRepository.championClassStats(account.puuid)
    console.timeEnd('CHAMPION-CLASS')
    console.time('MATES')
    const mates = await this.matchRepository.mates(account.puuid)
    console.timeEnd('MATES')

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