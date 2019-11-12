'use strict'

class MatchRepository {
  static get inject() {
    return ['App/Models/Match']
  }

  constructor(Match) {
    this.Match = Match
  }

  /**
   * Get Summoner's statistics for all played champion classes
   * @param puuid of the summoner
   */
  championClassStats(puuid) {
    return this.Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid
        }
      },
      {
        $group: {
          _id: { "$arrayElemAt": ["$champion.tags", 0] },
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
          }
        }
      }
    ])
  }

  /**
   * Get Summoner's statistics for all played modes
   * @param puuid of the summoner
   */
  gamemodeStats(puuid) {
    return this.Match.query().aggregate([
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
              $cond: [{ $eq: ["$result", "Win"] }, 1, 0]
            }
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ["$result", "Fail"] }, 1, 0]
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
  globalStats(puuid) {
    return this.Match.query().aggregate([
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
              $cond: [{ $eq: ["$result", "Win"] }, 1, 0]
            }
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ["$result", "Fail"] }, 1, 0]
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
  roleStats(puuid) {
    return this.Match.query().aggregate([
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
              $cond: [{ $eq: ["$result", "Win"] }, 1, 0]
            }
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ["$result", "Fail"] }, 1, 0]
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

  /**
   * Get Summoner's mates list
   * @param puuid of the summoner
   * @param summonerName of the summoner
   */
  mates(puuid, summonerName) {
    return this.Match.query().aggregate([
      {
        $match: {
          summoner_puuid: puuid
        }
      },
      { $unwind: "$allyTeam" },
      {
        $group: {
          _id: "$allyTeam.name",
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
          }
        },
      },
      {
        $match: {
          _id: { $not: { $eq: summonerName } },
          'count': { $gte: 2 }
        }
      },
      { $sort: { 'count': -1 } },
      { $limit: 15 },
    ])
  }
}

module.exports = MatchRepository
