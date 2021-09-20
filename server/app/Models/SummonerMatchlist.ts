import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Summoner from './Summoner'

export default class SummonerMatchlist extends BaseModel {
  public static table = 'summoner_matchlist'

  @column({ isPrimary: true })
  public id: number

  @column()
  public summonerPuuid: string

  @column()
  public matchId: string

  @belongsTo(() => Summoner, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public summoner: BelongsTo<typeof Summoner>
}
