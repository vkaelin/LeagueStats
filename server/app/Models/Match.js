'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Match extends Model {
  /**
   * Get Summoner's statistics for all played champion classes
   * @param puuid of the summoner
   */
  static championClassStats(puuid) {
    return Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid
        }
      },
      {
        $group: {
          _id: { "$arrayElemAt": [ "$champion.tags", 0 ] },
          count: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Win"] }, 1, 0
              ]
            }
          },
          losses: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Fail"] }, 1, 0
              ]
            }
          }
        }
      }
    ])
  }

  /**
   * Get Summoner's statistics for all played modes
   * @param puuid of the summoner
   */
  static gamemodeStats(puuid) {
    return Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid
        }
      },
      {
        $group: {
          _id: "$gamemode",
          count: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Win"] }, 1, 0
              ]
            }
          },
          losses: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Fail"] }, 1, 0
              ]
            }
          }
        }
      }
    ])
  }

  /**
   * Get global Summoner's statistics
   * @param puuid of the summoner
   */
  static globalStats(puuid) {
    return Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          time: { $sum: "$time" },
          wins: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Win"] }, 1, 0
              ]
            }
          },
          losses: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Fail"] }, 1, 0
              ]
            }
          },
          kills: { $sum: "$stats.kills" },
          deaths: { $sum: "$stats.deaths" },
          assists: { $sum: "$stats.assists" },
          minions: { $sum: "$stats.minions" },
          vision: { $sum: "$stats.vision" },
          kp: { $avg: "$stats.kp" },
        }
      }
    ])
  }

  /**
   * Get Summoner's statistics for the 5 differnt roles
   * @param puuid of the summoner
   */
  static roleStats(puuid) {
    return Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid,
          role: { $not: { $eq: 'NONE' } }
        }
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Win"] }, 1, 0
              ]
            }
          },
          losses: {
            $sum: {
              $cond: [
                { $eq: ["$result", "Fail"] }, 1, 0
              ]
            }
          }
        },
      },
      {
        $project: {
          role: "$_id",
          count: "$count",
          wins: "$wins",
          losses: "$losses",
        }
      }
    ])
  }
}

module.exports = Match
