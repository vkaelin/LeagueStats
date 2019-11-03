'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')

/**
 * BasicMatchTransformer class
 *
 * @class BasicMatchTransformer
 */
class BasicMatchTransformer extends MatchTransformer {
  /**
   * Transform raw data from Riot API
   * @param match data from Riot API
   * @param ctx context
   */
  transform(match, { account, champions, runes, MatchHelper }) {
    this.match = match
    this.champions = champions
    this.runes = runes
    this.MatchHelper = MatchHelper

    // Global data about the match
    const globalInfos = super.getGameInfos()

    const participantId = match.participantIdentities.find((p) => p.player.currentAccountId === account.accountId).participantId
    const player = match.participants[participantId - 1]

    let win = match.teams.find((t) => t.teamId === player.teamId).win

    // Match less than 5min
    if (match.gameDuration < 300) {
      win = 'Remake'
    }

    // Player data
    const playerData = super.getPlayerData(player, false)

    // Teams data
    const allyTeam = []
    const enemyTeam = []
    for (let summoner of match.participantIdentities) {
      const allData = match.participants[summoner.participantId - 1]
      const playerInfos = {
        name: summoner.player.summonerName,
        role: MatchHelper.getRoleName(allData.timeline),
        champion: (({ id, name }) => ({ id, name }))(Object.entries(champions).find(([, champion]) => Number(champion.key) === allData.championId)[1])
      }

      if (allData.teamId === player.teamId) {
        allyTeam.push(playerInfos)
      } else {
        enemyTeam.push(playerInfos)
      }
    }
    allyTeam.sort(MatchHelper.sortTeamByRole)
    enemyTeam.sort(MatchHelper.sortTeamByRole)

    return {
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
