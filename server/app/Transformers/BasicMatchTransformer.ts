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

    const player = match.info.participants.find(p => p.puuid === puuid)!

    let win = match.info.teams.find((t) => t.teamId === player.teamId)!.win ? 'Win' : 'Fail'

    // Match less than 5min
    if (match.info.gameDuration < 300) {
      win = 'Remake'
    }

    // Player data
    const playerData = super.getPlayerData(match, player, false)

    // Teams data
    const allyTeam: ParticipantBasic[] = []
    const enemyTeam: ParticipantBasic[] = []
    for (let summoner of match.info.participants) {
      const playerInfos = {
        account_id: summoner.puuid, // TODO: switch to puuid
        name: summoner.summonerName,
        role: super.getRoleName(summoner.teamPosition, match.info.queueId),
        champion: super.getChampion(summoner.championId),
      }

      if (summoner.teamId === player.teamId) {
        allyTeam.push(playerInfos)
      } else {
        enemyTeam.push(playerInfos)
      }
    }

    // Roles
    super.getMatchRoles(match, allyTeam, enemyTeam, player.teamId, playerData)

    return {
      account_id: accountId,
      summoner_puuid: puuid,
      gameId: match.info.gameId,
      matchId: match.metadata.matchId,
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

    const finalMatches: MatchModel[] = []
    matches.forEach((match, index) => {
      finalMatches[index] = this.transformOneMatch(match, puuid, accountId)
    })
    return finalMatches
  }
}

export default new BasicMatchTransformer()
