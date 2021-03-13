import { queuesWithRole } from 'App/helpers'
import Jax from 'App/Services/Jax'
import { CurrentGameInfo, CurrentGameParticipant } from 'App/Services/Jax/src/Endpoints/SpectatorEndpoint'
import { FinalRoleComposition } from 'App/Services/RoleIdentiticationService'
import SummonerService, { LeagueEntriesByQueue } from 'App/Services/SummonerService'
import MatchTransformer, { PlayerRole } from './MatchTransformer'

class LiveMatchTransformer extends MatchTransformer {
  /**
   * Get player soloQ and flex rank from his summonerName
   * @param participant 
   * @param region 
   */
  private async getPlayerRank (participant: CurrentGameParticipant, region: string) {
    const account = await Jax.Summoner.summonerId(participant.summonerId, region)
    let ranked: LeagueEntriesByQueue
    if (account) {
      ranked = await SummonerService.getRanked(account, region)
    }

    return {
      ...participant,
      level: account ? account.summonerLevel : undefined,
      rank: account ? ranked! : undefined,
    }
  }

  /**
   * Transform raw data from Riot API
   * @param liveMatch 
   * @param ctx 
   */
  public async transform (liveMatch: CurrentGameInfo, { region }: { region: string }) {
    await super.getContext()

    // Roles
    const blueTeam: PlayerRole[] = [] // 100
    const redTeam: PlayerRole[] = [] // 200
    let blueRoles: FinalRoleComposition = {}
    let redRoles: FinalRoleComposition = {}
    const needsRole = this.championRoles && queuesWithRole.includes(liveMatch.gameQueueConfigId)
    if (needsRole) {
      liveMatch.participants.map(p => {
        const playerRole = { champion: p.championId, jungle: p.spell1Id === 11 || p.spell2Id === 11 }
        p.teamId === 100 ? blueTeam.push(playerRole) : redTeam.push(playerRole)
      })

      blueRoles = super.getTeamRoles(blueTeam)
      redRoles = super.getTeamRoles(redTeam)
    }

    for (const participant of liveMatch.participants) {
      // Perks
      participant.runes = participant.perks ?
        super.getPerksImages(participant.perks.perkIds[0], participant.perks.perkSubStyle)
        : {}

      // Roles
      if (needsRole) {
        const roles = participant.teamId === 100 ? blueRoles : redRoles
        participant.role = Object.entries(roles).find(([, champion]) => participant.championId === champion)![0]
      }
    }

    // Ranks
    const requestsParticipants = liveMatch.participants.map(p => this.getPlayerRank(p, region))
    liveMatch.participants = await Promise.all(requestsParticipants)

    return liveMatch
  }
}

export default new LiveMatchTransformer()
