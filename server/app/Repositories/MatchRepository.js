'use strict'

class MatchRepository {
  static get inject() {
    return ['App/Models/Match']
  }

  constructor(Match) {
    this.Match = Match
  }

  /**
   * Build the aggregate mongo query
   * @param {Number} puuid 
   * @param {Object} matchParams 
   * @param {Array} intermediateSteps 
   * @param {*} groupId 
   * @param {Object} groupParams 
   * @param {Array} finalSteps 
   */
  _aggregate(puuid, matchParams, intermediateSteps, groupId, groupParams, finalSteps) {
    return this.Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid,
          result: { $not: { $eq: 'Remake' } },
          gamemode: { $nin: [800, 810, 820, 830, 840, 850] },
          ...matchParams
        }
      },
      ...intermediateSteps,
      {
        $group: {
          _id: groupId,
          count: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ["$result", "Win"] }, 1, 0]
            }
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ["$result", "Fail"] }, 1, 0]
            }
          },
          ...groupParams
        },
      },
      ...finalSteps
    ])
  }

  /**
   * Get Summoner's statistics for the 5 most played champions
   * @param puuid of the summoner
   */
  championStats(puuid) {
    const groupParams = {
      champion: { $first: "$champion" },
      kills: { $sum: "$stats.kills" },
      deaths: { $sum: "$stats.deaths" },
      assists: { $sum: "$stats.assists" },
    }
    const finalSteps = [
      { $sort: { 'count': -1 } },
      { $limit: 5 },
    ]
    return this._aggregate(puuid, {}, [], '$champion.id', groupParams, finalSteps)
  }

  /**
   * Get Summoner's statistics for all played champion classes
   * @param puuid of the summoner
   */
  championClassStats(puuid) {
    const groupId = { "$arrayElemAt": ["$champion.roles", 0] }
    return this._aggregate(puuid, {}, [], groupId, {}, [])
  }

  /**
   * Get Summoner's statistics for all played modes
   * @param puuid of the summoner
   */
  gamemodeStats(puuid) {
    return this._aggregate(puuid, {}, [], '$gamemode', {}, [])
  }

  /**
   * Get global Summoner's statistics
   * @param puuid of the summoner
   */
  globalStats(puuid) {
    const groupParams = {
      time: { $sum: "$time" },
      kills: { $sum: "$stats.kills" },
      deaths: { $sum: "$stats.deaths" },
      assists: { $sum: "$stats.assists" },
      minions: { $sum: "$stats.minions" },
      vision: { $sum: "$stats.vision" },
      kp: { $avg: "$stats.kp" },
    }
    return this._aggregate(puuid, {}, [], null, groupParams, [])
  }

  /**
   * Get Summoner's statistics for the 5 differnt roles
   * @param puuid of the summoner
   */
  roleStats(puuid) {
    const matchParams = {
      role: { $not: { $eq: 'NONE' } }
    }
    const finalSteps = [
      {
        $project: {
          role: "$_id",
          count: "$count",
          wins: "$wins",
          losses: "$losses",
        }
      }
    ]
    return this._aggregate(puuid, matchParams, [], '$role', {}, finalSteps)
  }

  /**
   * Get Summoner's mates list
   * @param puuid of the summoner
   * @param summonerName of the summoner
   */
  mates(puuid, summonerName) {
    const intermediateSteps = [
      { $unwind: "$allyTeam" },
    ]
    const finalSteps = [
      {
        $match: {
          _id: { $not: { $eq: summonerName } },
          'count': { $gte: 2 }
        }
      },
      { $sort: { 'count': -1 } },
      { $limit: 15 },
    ]
    return this._aggregate(puuid, {}, intermediateSteps, '$allyTeam.name', {}, finalSteps)
  }
}

module.exports = MatchRepository
