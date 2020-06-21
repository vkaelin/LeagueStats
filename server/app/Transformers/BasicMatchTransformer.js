'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const { queuesWithRole } = use('App/helpers')

/**
 * BasicMatchTransformer class
 *
 * @class BasicMatchTransformer
 */
class BasicMatchTransformer extends MatchTransformer {
  /**
   * Transform raw data from Riot API
   * @param matches data from Riot API, Array of match or a single match
   * @param ctx context
   */
  async transform(matches, { account }) {
    await super.getContext()

    if (Array.isArray(matches)) {
      matches.forEach((match, index) => {
        matches[index] = this.transformOneMatch(match, account)
      })
    } else {
      matches = this.transformOneMatch(matches, account)
    }

    return matches
  }

  /**
   * Transform raw data for 1 match
   */
  transformOneMatch(match, account) {
    // Global data about the match
    const globalInfos = super.getGameInfos(match)

    const identity = match.participantIdentities.find((p) => p.player.currentAccountId === account.accountId)
    const player = match.participants[identity.participantId - 1]

    let win = match.teams.find((t) => t.teamId === player.teamId).win

    // Match less than 5min
    if (match.gameDuration < 300) {
      win = 'Remake'
    }

    // Player data
    const playerData = super.getPlayerData(match, player, false)

    // Teams data
    const allyTeam = []
    const enemyTeam = []
    for (let summoner of match.participantIdentities) {
      const allData = match.participants[summoner.participantId - 1]
      const playerInfos = {
        account_id: summoner.player.currentAccountId,
        name: summoner.player.summonerName,
        role: super.getRoleName(allData.timeline, match.queueId),
        champion: super.getChampion(allData.championId)
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
      account_id: identity.player.currentAccountId,
      summoner_puuid: account.puuid,
      gameId: match.gameId,
      result: win,
      allyTeam,
      enemyTeam,
      ...globalInfos,
      ...playerData
    }
  }
}

module.exports = new BasicMatchTransformer()
