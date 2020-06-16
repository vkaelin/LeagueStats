'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const RoleIdentificationService = use('App/Services/RoleIdentificationService')
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

  _getTeamRoles(team) {
    const teamJunglers = team.filter(p => p.jungle)
    const jungle = teamJunglers.length === 1 ? teamJunglers[0].champion : null

    return RoleIdentificationService.getRoles(this.championRoles, team.map(p => p.champion), jungle)
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
    if (this.championRoles && queuesWithRole.includes(match.gameQueueConfigId)) {
      match.participants.map(p => {
        const playerRole = { champion: p.championId, jungle: p.spell1Id === 11 || p.spell2Id === 11 }
        p.teamId === 100 ? blueTeam.push(playerRole) : redTeam.push(playerRole)
      })

      blueRoles = this._getTeamRoles(blueTeam)
      redRoles = this._getTeamRoles(redTeam)
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
