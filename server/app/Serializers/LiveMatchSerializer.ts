import { PlayerRole, queuesWithRole, smiteIds } from 'App/helpers'
import CDragonService from 'App/Services/CDragonService'
import { CurrentGameInfoDTO } from 'App/Services/Jax/src/Endpoints/SpectatorEndpoint'
import { RoleComposition } from 'App/Services/RoleIdentificationService'
import SummonerService from 'App/Services/SummonerService'
import MatchSerializer from './MatchSerializer'
import { SerializedLiveMatch, SerializedLiveMatchPlayer } from './SerializedTypes'

class LiveMatchSerializer extends MatchSerializer {
  public async serializeOneMatch(
    liveMatch: CurrentGameInfoDTO,
    region: string
  ): Promise<SerializedLiveMatch> {
    // Roles
    const blueTeam: PlayerRole[] = [] // 100
    const redTeam: PlayerRole[] = [] // 200
    let blueRoles: RoleComposition = {}
    let redRoles: RoleComposition = {}
    const needsRole =
      CDragonService.championRoles &&
      (queuesWithRole.includes(liveMatch.gameQueueConfigId) ||
        (liveMatch.gameType === 'CUSTOM_GAME' && liveMatch.participants.length === 10))

    if (needsRole) {
      liveMatch.participants.map((p) => {
        const playerRole = {
          champion: p.championId,
          jungle: smiteIds.includes(p.spell1Id) || smiteIds.includes(p.spell2Id),
        }
        p.teamId === 100 ? blueTeam.push(playerRole) : redTeam.push(playerRole)
      })

      blueRoles = super.getTeamRoles(blueTeam)
      redRoles = super.getTeamRoles(redTeam)
    }

    // Ranks
    const requestsRanks = liveMatch.participants.map((p) =>
      SummonerService.getRanked(p.summonerId, region)
    )
    const ranks = await Promise.all(requestsRanks)

    // Players
    const players: SerializedLiveMatchPlayer[] = liveMatch.participants.map((player, index) => {
      let role: string | undefined

      // Roles
      if (needsRole) {
        const roles = player.teamId === 100 ? blueRoles : redRoles
        role = Object.entries(roles).find(([, champion]) => player.championId === champion)![0]
      }

      const perks = player.perks
        ? {
            primaryStyle: player.perks.perkStyle,
            secondaryStyle: player.perks.perkSubStyle,
            selected: player.perks.perkIds,
          }
        : undefined

      return {
        ...player,
        role,
        rank: ranks[index],
        champion: this.getChampion(player.championId),
        perks,
        summonerSpell1: this.getSummonerSpell(player.spell1Id),
        summonerSpell2: this.getSummonerSpell(player.spell2Id),
      }
    })

    return {
      gameId: liveMatch.gameId,
      gameType: liveMatch.gameType,
      gameStartTime: liveMatch.gameStartTime,
      mapId: liveMatch.mapId,
      gameLength: liveMatch.gameLength,
      platformId: liveMatch.platformId,
      gameMode: liveMatch.gameMode,
      bannedChampions: liveMatch.bannedChampions,
      gameQueueConfigId: liveMatch.gameQueueConfigId,
      observers: liveMatch.observers,
      participants: players,
    }
  }
}

export default new LiveMatchSerializer()
