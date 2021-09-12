import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Summoner from './Summoner'

export default class SummonerName extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public summonerPuuid: string

  @belongsTo(() => Summoner, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public summoner: BelongsTo<typeof Summoner>

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
