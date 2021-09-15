import { sortTeamByRole } from 'App/helpers'
import { TeamPosition } from 'App/Parsers/ParsedType'
import MatchRepository from 'App/Repositories/MatchRepository'
import BasicMatchSerializer from 'App/Serializers/BasicMatchSerializer'

class StatsService {
  public async getSummonerStats(puuid: string, season?: number) {
    console.time('GLOBAL')
    const globalStats = await MatchRepository.globalStats(puuid)
    console.timeEnd('GLOBAL')
    console.time('GAMEMODE')
    const gamemodeStats = await MatchRepository.gamemodeStats(puuid)
    console.timeEnd('GAMEMODE')
    console.time('ROLE')
    const roleStats = await MatchRepository.roleStats(puuid)
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
    const championStats = await MatchRepository.championStats(puuid, 5)
    for (const champ of championStats) {
      champ.champion = BasicMatchSerializer.getChampion(champ.id)
    }
    console.timeEnd('CHAMPION')
    // console.time('CHAMPION-CLASS')
    // const championClassStats = await MatchRepository.championClassStats(puuid, season)
    // console.timeEnd('CHAMPION-CLASS')
    // console.time('MATES')
    // const mates = await MatchRepository.mates(puuid, season)
    // console.timeEnd('MATES')

    return {
      global: globalStats,
      league: gamemodeStats,
      role: roleStats.sort(sortTeamByRole),
      // class: championClassStats,
      // mates,
      champion: championStats,
    }
  }
}

export default new StatsService()
