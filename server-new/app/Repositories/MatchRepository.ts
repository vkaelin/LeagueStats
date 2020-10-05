import mongodb from '@ioc:Mongodb/Database'

class MatchRepository {
  private season?: number

  constructor () {
    // TODO: keep matches collection in the repo instance
  }

  /**
   * Basic matchParams used in a lot of requests
   * @param puuid of the summoner
   */
  private _matchParams (puuid: string) {
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
    const matchesCollections = await mongodb.connection().collection('matches')

    return matchesCollections.aggregate([
      {
        $match: {
          ...this._matchParams(puuid),
        },
      },
      {
        $group: { _id: '$season' },
      },
    ]).toArray()
  }
}

export default new MatchRepository()
