declare module '@ioc:Adonis/League' {
  import { MatchReferenceDto } from 'App/Services/Jax/src/Endpoints/MatchlistEndpoint'

  interface SummonerModel {
    puuid: string,
    matchList?: MatchReferenceDto[],
    names?: SummonerNames[]
  }

  interface SummonerNames {
    name: string,
    date: Date
  }
}
