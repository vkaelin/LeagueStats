import { MatchModel, ParticipantBasic } from 'App/Models/Match'
import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import MatchTransformer from 'App/Transformers/MatchTransformer'

class BasicMatchTransformer extends MatchTransformer {
  /**
   * Transform raw data for 1 match
   * @param match 
   * @param puuid 
   * @param accountId 
   */
  private transformOneMatch (match: MatchDto, puuid: string, accountId: string): MatchModel {
    // Global data about the match
    const globalInfos = super.getGameInfos(match)

    const identity = match.participantIdentities.find((p) => p.player.currentAccountId === accountId)
    const player = match.participants[identity!.participantId - 1]

    let win = match.teams.find((t) => t.teamId === player.teamId)!.win

    // Match less than 5min
    if (match.gameDuration < 300) {
      win = 'Remake'
    }

    // Player data
    const playerData = super.getPlayerData(match, player, false)

    // Teams data
    const allyTeam:ParticipantBasic[] = []
    const enemyTeam:ParticipantBasic[] = []
    for (let summoner of match.participantIdentities) {
      const allData = match.participants[summoner.participantId - 1]
      const playerInfos = {
        account_id: summoner.player.currentAccountId,
        name: summoner.player.summonerName,
        role: super.getRoleName(allData.timeline, match.queueId),
        champion: super.getChampion(allData.championId),
      }

      if (allData.teamId === player.teamId) {
        allyTeam.push(playerInfos)
      } else {
        enemyTeam.push(playerInfos)
      }
    }

    // Roles
    super.getMatchRoles(match, allyTeam, enemyTeam, player.teamId, playerData)

    return {
      account_id: identity!.player.currentAccountId,
      summoner_puuid: puuid,
      gameId: match.gameId,
      result: win,
      allyTeam,
      enemyTeam,
      ...globalInfos,
      ...playerData,
    }
  }

  /**
   * Transform raw data from Riot API
   * @param matches data from Riot API, Array of matches
   * @param ctx context
   */
  public async transform (matches: MatchDto[], { puuid, accountId }: { puuid: string, accountId: string }) {
    await super.getContext()

    const finalMatches:MatchModel[] = []
    matches.forEach((match, index) => {
      finalMatches[index] = this.transformOneMatch(match, puuid, accountId)
    })
    return finalMatches
  }
}

export default new BasicMatchTransformer()
