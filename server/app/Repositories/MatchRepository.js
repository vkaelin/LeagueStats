'use strict'

class MatchRepository {
  static get inject() {
    return ['App/Models/Match']
  }

  constructor(Match) {
    this.Match = Match
  }

  /**
   * Basic matchParams used in a lot of requests
   * @param puuid of the summoner
   */
  _matchParams(puuid) {
    return {
      summoner_puuid: puuid,
      result: { $not: { $eq: 'Remake' } },
      gamemode: { $nin: [800, 810, 820, 830, 840, 850] },
      season: this.season ? this.season : { $exists: true }
    }
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
          ...this._matchParams(puuid),
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
              $cond: [{ $eq: ['$result', 'Win'] }, 1, 0]
            }
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ['$result', 'Fail'] }, 1, 0]
            }
          },
          ...groupParams
        },
      },
      ...finalSteps
    ])
  }

  /**
   * Get Summoner's statistics for the N most played champions
   * @param puuid of the summoner
   * @param limit number of champions to fetch
   */
  championStats(puuid, limit = 5) {
    const groupParams = {
      champion: { $first: '$champion' },
      kills: { $sum: '$stats.kills' },
      deaths: { $sum: '$stats.deaths' },
      assists: { $sum: '$stats.assists' },
    }
    const finalSteps = [
      { $sort: { 'count': -1, 'champion.name': 1 } },
      { $limit: limit }
    ]
    return this._aggregate(puuid, {}, [], '$champion.id', groupParams, finalSteps)
  }

  /**
   * Get Summoner's statistics for all played champion classes
   * @param puuid of the summoner
   */
  championClassStats(puuid) {
    const groupId = { '$arrayElemAt': ['$champion.roles', 0] }
    return this._aggregate(puuid, {}, [], groupId, {}, [])
  }

  /**
   * Get Summoner's complete statistics for the all played champs
   * @param puuid of the summoner
   * @param queue of the matches to fetch, if null get all matches
   * @param season of the matches to fetch, if null get all seasons
   */
  championCompleteStats(puuid, queue, season) {
    const matchParams = {}
    if (queue) {
      matchParams.gamemode = { $eq: Number(queue) }
    }
    this.season = season

    const groupParams = {
      time: { $sum: '$time' },
      gameLength: { $avg: '$time' },
      date: { $max: '$date' },
      champion: { $first: '$champion' },
      kills: { $sum: '$stats.kills' },
      deaths: { $sum: '$stats.deaths' },
      assists: { $sum: '$stats.assists' },
      minions: { $avg: '$stats.minions' },
      gold: { $avg: '$stats.gold' },
      dmgChamp: { $avg: '$stats.dmgChamp' },
      dmgTaken: { $avg: '$stats.dmgTaken' },
      kp: { $avg: '$stats.kp' },
    }
    const finalSteps = [
      { $sort: { 'count': -1, 'champion.name': 1 } }
    ]
    return this._aggregate(puuid, matchParams, [], '$champion.id', groupParams, finalSteps)
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
      time: { $sum: '$time' },
      kills: { $sum: '$stats.kills' },
      deaths: { $sum: '$stats.deaths' },
      assists: { $sum: '$stats.assists' },
      minions: { $sum: '$stats.minions' },
      vision: { $sum: '$stats.vision' },
      kp: { $avg: '$stats.kp' },
    }
    return this._aggregate(puuid, {}, [], null, groupParams, [])
  }

  /**
  * Get Summoner's all records
  * @param puuid of the summoner
  * @param season of the matches to fetch, if null get all seasons
  */
  records(puuid, season) {
    this.season = season

    return this.Match.query().aggregate([
      {
        $match: {
          ...this._matchParams(puuid),
        }
      },
      {
        $group: {
          _id: null,
          maxKills: { $max: '$stats.kills' },
          maxDeaths: { $max: '$stats.deaths' },
          maxAssists: { $max: '$stats.assists' },
          maxGold: { $max: '$stats.gold' },
          maxTime: { $max: '$time' },
          maxMinions: { $max: '$stats.minions' },
          maxKda: { $max: '$stats.realKda' },
          maxDmgTaken: { $max: '$stats.dmgTaken' },
          maxDmgChamp: { $max: '$stats.dmgChamp' },
          maxDmgObj: { $max: '$stats.dmgObj' },
          maxKp: { $max: '$stats.kp' },
          maxVision: { $max: '$stats.vision' },
          docs: {
            '$push': {
              'champion': '$champion',
              'gameId': '$gameId',
              'kills': '$stats.kills',
              'deaths': '$stats.deaths',
              'assists': '$stats.assists',
              'gold': '$stats.gold',
              'time': '$time',
              'minions': '$stats.minions',
              'kda': '$stats.realKda',
              'dmgTaken': '$stats.dmgTaken',
              'dmgChamp': '$stats.dmgChamp',
              'dmgObj': '$stats.dmgObj',
              'kp': '$stats.kp',
              'vision': '$stats.vision',
              'result': '$result',
              'date': '$date',
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          maxKills: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.kills', '$maxKills'] } } }, 0] },
          maxDeaths: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.deaths', '$maxDeaths'] } } }, 0] },
          maxAssists: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.assists', '$maxAssists'] } } }, 0] },
          maxGold: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.gold', '$maxGold'] } } }, 0] },
          maxTime: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.time', '$maxTime'] } } }, 0] },
          maxMinions: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.minions', '$maxMinions'] } } }, 0] },
          maxKda: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.kda', '$maxKda'] } } }, 0] },
          maxDmgTaken: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.dmgTaken', '$maxDmgTaken'] } } }, 0] },
          maxDmgChamp: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.dmgChamp', '$maxDmgChamp'] } } }, 0] },
          maxDmgObj: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.dmgObj', '$maxDmgObj'] } } }, 0] },
          maxKp: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.kp', '$maxKp'] } } }, 0] },
          maxVision: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.vision', '$maxVision'] } } }, 0] },
        }
      }
    ])
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
          role: '$_id',
          count: '$count',
          wins: '$wins',
          losses: '$losses',
        }
      }
    ]
    return this._aggregate(puuid, matchParams, [], '$role', {}, finalSteps)
  }
  
  /**
   * Get Summoner's played seasons
   * @param puuid of the summoner
   */
  seasons(puuid) {
    this.season = null

    return this.Match.query().aggregate([
      {
        $match: {
          ...this._matchParams(puuid),
        }
      },
      {
        $group: { _id: '$season' }
      },
    ])
  }

  /**
   * Get Summoner's mates list
   * @param puuid of the summoner
   */
  mates(puuid) {
    const intermediateSteps = [
      { $sort: { 'gameId': -1 } },
      { $unwind: '$allyTeam' },
    ]
    const groupParams = {
      account_id: { $first: '$account_id' },
      name: { $first: '$allyTeam.name' },
      mateId: { $first: '$allyTeam.account_id' },
    }
    const finalSteps = [
      {
        '$addFields': {
          'idEq': { '$eq': ['$mateId', '$account_id'] }
        }
      },
      {
        $match: {
          'idEq': false,
          'count': { $gte: 2 }
        },
      },
      { $sort: { 'count': -1, 'name': 1 } },
      { $limit: 15 },
    ]
    return this._aggregate(puuid, {}, intermediateSteps, '$allyTeam.account_id', groupParams, finalSteps)
  }
}

module.exports = MatchRepository
