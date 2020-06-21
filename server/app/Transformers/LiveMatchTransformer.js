'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const SummonerService = use('App/Services/SummonerService')
const { queuesWithRole } = use('App/helpers')

/**
 * LiveMatchTransformer class
 *
 * @class LiveMatchTransformer
 */
class LiveMatchTransformer extends MatchTransformer {
  async _getPlayerRank(participant, region) {
    const account = await SummonerService.getAccount(participant.summonerName, region)
    if (account) {
      participant.level = account.summonerLevel
      const ranked = await SummonerService.getRanked(account, region)
      participant.rank = ranked
    } else {
      participant.rank = null
    }

    return participant
  }

  /**
   * Transform raw data from Riot API
   * @param match data from Riot API, one live match
   */
  async transform(match, { region }) {
    await super.getContext()

    // Roles
    const blueTeam = [] // 100
    const redTeam = [] // 200
    let blueRoles = []
    let redRoles = []
    const needsRole = this.championRoles && queuesWithRole.includes(match.gameQueueConfigId)
    if (needsRole) {
      match.participants.map(p => {
        const playerRole = { champion: p.championId, jungle: p.spell1Id === 11 || p.spell2Id === 11 }
        p.teamId === 100 ? blueTeam.push(playerRole) : redTeam.push(playerRole)
      })

      blueRoles = super.getTeamRoles(blueTeam)
      redRoles = super.getTeamRoles(redTeam)
    }

    for (const participant of match.participants) {
      // Perks
      participant.runes = participant.perks ? super.getPerksImages(participant.perks.perkIds[0], participant.perks.perkSubStyle) : {}

      // Roles
      if (needsRole) {
        const roles = participant.teamId === 100 ? blueRoles : redRoles
        participant.role = Object.entries(roles).find(([, champion]) => participant.championId === champion)[0]
      }
    }

    // Ranks
    const requestsParticipants = match.participants.map(p => this._getPlayerRank(p, region))
    match.participants = await Promise.all(requestsParticipants)

    return match
  }
}

module.exports = new LiveMatchTransformer()
