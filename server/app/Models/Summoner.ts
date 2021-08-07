import { Model } from '@ioc:Mongodb/Model'
import { MatchlistDto } from 'App/Services/Jax/src/Endpoints/MatchlistEndpoint'

export interface SummonerModel {
  puuid: string,
  matchList?: MatchlistDto,
  names?: SummonerNames[]
}

interface SummonerNames {
  name: string,
  date: Date
}

export default class Summoner extends Model implements SummonerModel {
  public static collectionName = 'summoners'

  public puuid: string
  public matchList?: MatchlistDto
  public names?: SummonerNames[]
}
