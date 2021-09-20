import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Match from './Match'

export default class MatchTeam extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matchId: string

  @belongsTo(() => Match)
  public match: BelongsTo<typeof Match>

  @column()
  public color: number

  @column()
  public result: string

  @column()
  public barons: number

  @column()
  public dragons: number

  @column()
  public inhibitors: number

  @column()
  public riftHeralds: number

  @column()
  public towers: number

  @column()
  public bans?: number[]

  @column()
  public banOrders?: number[]
}
