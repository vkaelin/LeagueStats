import mongodb from '@ioc:Mongodb/Database'
import { Collection } from 'mongodb'

class MatchRepository {
  private collection: Collection

  constructor () {
    this.getCollection()
  }

  /**
   * Basic matchParams used in a lot of requests
   * @param puuid of the summoner
   */
  private matchParams (puuid: string, season?: number) {
    return {
      summoner_puuid: puuid,
      result: { $not: { $eq: 'Remake' } },
      gamemode: { $nin: [800, 810, 820, 830, 840, 850] },
      season: season ? season : { $exists: true },
    }
  }

  /**
   * Build the aggregate mongo query
   * @param puuid 
   * @param matchParams 
   * @param intermediateSteps 
   * @param groupId 
   * @param groupParams 
   * @param finalSteps 
   */
  private async aggregate (
    puuid: string,
    matchParams: object,
    intermediateSteps: any[],
    groupId: any,
    groupParams: object,
    finalSteps: any[],
    season?: number,
  ) {
    return this.collection.aggregate([
      {
        $match: {
          ...this.matchParams(puuid, season),
          ...matchParams,
        },
      },
      ...intermediateSteps,
      {
        $group: {
          _id: groupId,
          count: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$result', 'Win'] }, 1, 0],
            },
          },
          losses: {
            $sum: {
              $cond: [{ $eq: ['$result', 'Fail'] }, 1, 0],
            },
          },
          ...groupParams,
        },
      },
      ...finalSteps,
    ]).toArray()
  }

  /**
   * Get MongoDB matches collection
   */
  public async getCollection () {
    if (!this.collection) {
      this.collection = await mongodb.connection().collection('matches')
    }
  }

  /**
   * Get Summoner's complete statistics for the all played champs
   * @param puuid  of the summoner
   * @param queue  of the matches to fetch, if not set: get all matches
   * @param season of the matches to fetch, if not set: get all seasons
   */
  public async championCompleteStats (puuid: string, queue?: number, season?: number) {
    const matchParams = queue ? { gamemode: { $eq: Number(queue) } } : {}
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
      { $sort: { 'count': -1, 'champion.name': 1 } },
    ]
    return this.aggregate(puuid, matchParams, [], '$champion.id', groupParams, finalSteps, season)
  }

  /**
  * Get Summoner's all records
  * @param puuid of the summoner
  * @param season of the matches to fetch, if null get all seasons
  */
  public async records (puuid: string, season?: number) {
    const records = await this.collection.aggregate([
      {
        $match: {
          ...this.matchParams(puuid, season),
        },
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
          maxCriticalStrike: { $max: '$stats.criticalStrike' },
          maxLiving: { $max: '$stats.longestLiving' },
          maxHeal: { $max: '$stats.heal' },
          maxTowers: { $max: '$stats.towers' },
          maxKillingSpree: { $max: '$stats.killingSpree' },
          maxDouble: { $max: '$stats.doubleKills' },
          maxTriple: { $max: '$stats.tripleKills' },
          maxQuadra: { $max: '$stats.quadraKills' },
          maxPenta: { $max: '$stats.pentaKills' },
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
              'criticalStrike': '$stats.criticalStrike',
              'longestLiving': '$stats.longestLiving',
              'heal': '$stats.heal',
              'towers': '$stats.towers',
              'killingSpree': '$stats.killingSpree',
              'doubleKills': '$stats.doubleKills',
              'tripleKills': '$stats.tripleKills',
              'quadraKills': '$stats.quadraKills',
              'pentaKills': '$stats.pentaKills',
              'result': '$result',
              'date': '$date',
              'gamemode': '$gamemode',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          /* eslint-disable max-len */
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
          maxCriticalStrike: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.criticalStrike', '$maxCriticalStrike'] } } }, 0] },
          maxLiving: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.longestLiving', '$maxLiving'] } } }, 0] },
          maxHeal: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.heal', '$maxHeal'] } } }, 0] },
          maxTowers: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.towers', '$maxTowers'] } } }, 0] },
          maxKillingSpree: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.killingSpree', '$maxKillingSpree'] } } }, 0] },
          maxDouble: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.doubleKills', '$maxDouble'] } } }, 0] },
          maxTriple: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.tripleKills', '$maxTriple'] } } }, 0] },
          maxQuadra: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.quadraKills', '$maxQuadra'] } } }, 0] },
          maxPenta: { $arrayElemAt: [{ $filter: { input: '$docs', cond: { $eq: ['$$this.pentaKills', '$maxPenta'] } } }, 0] },
        },
      },
    ]).toArray()

    return records[0]
  }

  /**
   * Get Summoner's played seasons
   * @param puuid of the summoner
   */
  public async seasons (puuid: string) {
    return this.collection.aggregate([
      {
        $match: {
          ...this.matchParams(puuid),
        },
      },
      {
        $group: { _id: '$season' },
      },
    ]).toArray()
  }
}

export default new MatchRepository()
