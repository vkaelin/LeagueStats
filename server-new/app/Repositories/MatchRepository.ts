import mongodb from '@ioc:Mongodb/Database'
import { Collection } from 'mongodb'

class MatchRepository {
  private season?: number
  private collection: Collection

  constructor () {
    this.getCollection()
  }

  /**
   * Get MongoDB matches collection
   */
  private async getCollection () {
    this.collection = await mongodb.connection().collection('matches')
  }

  /**
   * Basic matchParams used in a lot of requests
   * @param puuid of the summoner
   */
  private matchParams (puuid: string) {
    return {
      summoner_puuid: puuid,
      result: { $not: { $eq: 'Remake' } },
      gamemode: { $nin: [800, 810, 820, 830, 840, 850] },
      season: this.season ? this.season : { $exists: true },
    }
  }

  /**
   * Get Summoner's played seasons
   * @param puuid of the summoner
   */
  public async seasons (puuid: string) {
    this.season = undefined
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
