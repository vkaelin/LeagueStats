'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')
const SummonerService = use('App/Services/SummonerService')

/**
 * LiveMatchTransformer class
 *
 * @class LiveMatchTransformer
 */
class LiveMatchTransformer extends MatchTransformer {
  async _getPlayerDatq(participant, region) {
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

    // Perks
    for (const participant of match.participants) {
      participant.runes = super.getPerksImages(participant.perks.perkIds[0], participant.perks.perkSubStyle)
    }

    const requestsParticipants = match.participants.map(p => this._getPlayerDatq(p, region))
    match.participants = await Promise.all(requestsParticipants)

    return match
  }
}

module.exports = new LiveMatchTransformer()
