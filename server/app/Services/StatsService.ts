import { sortTeamByRole } from 'App/helpers'
import { ChampionRoles, TeamPosition } from 'App/Parsers/ParsedType'
import MatchRepository, { SelectFilters } from 'App/Repositories/MatchRepository'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'

class StatsService {
  public async getRecentActivity(puuid: string) {
    console.time('RecentActivity')
    const recentActivity = await MatchRepository.recentActivity(puuid)
    console.timeEnd('RecentActivity')
    return recentActivity
  }
  public async getSummonerStats(puuid: string, season?: number) {
    const filters: SelectFilters = { puuid }
    if (season) filters.season = season

    console.time('GLOBAL')
    const globalStats = await MatchRepository.globalStats(filters)
    console.timeEnd('GLOBAL')
    console.time('GAMEMODE')
    const gamemodeStats = await MatchRepository.gamemodeStats(filters)
    console.timeEnd('GAMEMODE')
    console.time('ROLE')
    const roleStats = await MatchRepository.roleStats(filters)
    // Check if all roles are in the array
    const roles = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']
    for (const role of roles) {
      const findedRole = roleStats.find((r) => TeamPosition[r.role] === role)
      if (findedRole) {
        findedRole.role = TeamPosition[findedRole.role]
      } else {
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
    const championStats = await MatchRepository.championStats({ ...filters, limit: 5 })
    for (const champ of championStats) {
      champ.champion = BasicMatchSerializer.getChampion(champ.id)
    }
    console.timeEnd('CHAMPION')
    console.time('CHAMPION-CLASS')
    const championClassStats = await MatchRepository.championClassStats(filters)
    for (const champ of championClassStats) {
      champ.id = ChampionRoles[champ.id]
    }
    console.timeEnd('CHAMPION-CLASS')
    console.time('MATES')
    const mates = await MatchRepository.mates(filters)
    console.timeEnd('MATES')

    console.time('RECENT_ACTIVITY')
    const recentActivity = await MatchRepository.recentActivity(puuid)
    console.timeEnd('RECENT_ACTIVITY')

    return {
      global: globalStats,
      league: gamemodeStats,
      role: roleStats.sort(sortTeamByRole),
      champion: championStats,
      class: championClassStats,
      mates,
      recentActivity,
    }
  }
}

export default new StatsService()
