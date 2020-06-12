'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const RoleIdentificationService = use('App/Services/RoleIdentificationService')
const SummonerService = use('App/Services/SummonerService')

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
    if (this.championRoles) {
      match.participants.map(p => {
        p.teamId === 100 ? blueTeam.push(p.championId) : redTeam.push(p.championId)
      })
      blueRoles = RoleIdentificationService.getRoles(this.championRoles, blueTeam)
      redRoles = RoleIdentificationService.getRoles(this.championRoles, redTeam)
    }

    for (const participant of match.participants) {
      // Perks
      participant.runes = participant.perks ? super.getPerksImages(participant.perks.perkIds[0], participant.perks.perkSubStyle) : {}

      // Roles
      if (this.championRoles) {
        const roles = participant.teamId === 100 ? blueRoles : redRoles
        participant.role = Object.entries(roles).find(([, champion]) => participant.championId === champion)[0]
        if (participant.role === 'UTILITY') {
          participant.role = 'SUPPORT'
        }
      }
    }

    // Ranks
    const requestsParticipants = match.participants.map(p => this._getPlayerRank(p, region))
    match.participants = await Promise.all(requestsParticipants)

    return match
  }
}

module.exports = new LiveMatchTransformer()
