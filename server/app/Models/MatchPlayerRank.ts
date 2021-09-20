import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import MatchPlayer from './MatchPlayer'

export default class MatchPlayerRank extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public playerId: number

  @belongsTo(() => MatchPlayer, {
    localKey: 'id',
    foreignKey: 'playerId',
  })
  public player: BelongsTo<typeof MatchPlayer>

  @column()
  public gamemode: number

  @column()
  public tier: string

  @column()
  public rank: number

  @column()
  public lp: number

  @column()
  public wins: number

  @column()
  public losses: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
