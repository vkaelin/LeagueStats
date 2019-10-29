'use strict'

const Logger = use('Logger')
const Summoner = use('App/Models/Summoner')

class SummonerHelper {
  /**
   * Update the mates' list of the Summoner
   * @param account of the summoner
   * @param summonerDB summoner in the database
   * @param matches all new matches
   */
  updatePlayedWith(account, summonerDB, matches) {
    let teamMates = summonerDB.mates || []

    for (const match of matches) {
      if(match.result === 'Remake') continue
      const win = match.result === 'Win'

      for (const ally of match.allyTeam) {
        if (ally.name === account.name) continue

        const mate = teamMates.find(m => m.name === ally.name)
        if (mate) {
          win ? mate.wins++ : mate.losses++
        } else {
          teamMates.push({
            name: ally.name,
            wins: win ? 1 : 0,
            losses: win ? 0 : 1,
            creation: Date.now()
          })
        }
      }
    }

    // Save new mates'list
    summonerDB.mates = teamMates
  }
}

module.exports = new SummonerHelper()
