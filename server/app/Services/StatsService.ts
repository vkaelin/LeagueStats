import { sortTeamByRole } from 'App/helpers'
import { ChampionRoles, TeamPosition } from 'App/Parsers/ParsedType'
import MatchRepository, { SelectFilters } from 'App/Repositories/MatchRepository'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'

class StatsService {
  public async getSummonerStats(puuid: string, season?: number) {
    const filters: SelectFilters = { puuid }
    if (season) filters.season = season

    const [
      globalStats,
      gamemodeStats,
      roleStats,
      championStats,
      championClassStats,
      mates,
      recentActivity,
    ] = await Promise.all([
      MatchRepository.globalStats(filters),
      MatchRepository.gamemodeStats(filters),
      MatchRepository.roleStats(filters),
      MatchRepository.championStats({ ...filters, limit: 5 }),
      MatchRepository.championClassStats(filters),
      MatchRepository.mates(filters),
      MatchRepository.recentActivity(puuid),
    ])

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
    for (const champ of championStats) {
      champ.champion = BasicMatchSerializer.getChampion(champ.id)
    }
    for (const champ of championClassStats) {
      champ.id = ChampionRoles[champ.id]
    }

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
