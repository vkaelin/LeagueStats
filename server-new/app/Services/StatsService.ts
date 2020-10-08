import MatchRepository from 'App/Repositories/MatchRepository'
import { sortTeamByRole } from 'App/helpers'

class StatsService {
  public async getSummonerStats (puuid: string, season?: number) {
    console.time('GLOBAL')
    const globalStats = await MatchRepository.globalStats(puuid, season)
    console.timeEnd('GLOBAL')
    console.time('GAMEMODE')
    const gamemodeStats = await MatchRepository.gamemodeStats(puuid, season)
    console.timeEnd('GAMEMODE')
    console.time('ROLE')
    const roleStats = await MatchRepository.roleStats(puuid, season)
    // Check if all roles are in the array
    const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    for (const role of roles) {
      if (!roleStats.find(r => r.role === role)) {
        roleStats.push({
          count: 0,
          losses: 0,
          role,
          wins: 0,
        })
      }
    }
    console.timeEnd('ROLE')
    console.time('CHAMPION')
    const championStats = await MatchRepository.championStats(puuid, 5, season)
    console.timeEnd('CHAMPION')
    console.time('CHAMPION-CLASS')
    const championClassStats = await MatchRepository.championClassStats(puuid, season)
    console.timeEnd('CHAMPION-CLASS')
    console.time('MATES')
    const mates = await MatchRepository.mates(puuid, season)
    console.timeEnd('MATES')

    return {
      global: globalStats[0],
      league: gamemodeStats,
      role: roleStats.sort(sortTeamByRole),
      class: championClassStats,
      mates,
      champion: championStats,
    }
  }
}

export default new StatsService()
