import { Model } from '@ioc:Mongodb/Model'
import { MatchReferenceDto } from 'App/Services/Jax/src/Endpoints/MatchlistEndpoint'

export interface SummonerModel {
  puuid: string,
  matchList?: MatchReferenceDto[],
  names?: SummonerNames[]
}

interface SummonerNames {
  name: string,
  date: Date
}

export default class Summoner extends Model implements SummonerModel {
  public static collectionName = 'summoners'

  public puuid: string
  public matchList?: MatchReferenceDto[]
  public names?: SummonerNames[]
}
