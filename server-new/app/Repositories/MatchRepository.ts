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
