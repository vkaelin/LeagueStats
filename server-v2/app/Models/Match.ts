import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import MatchPlayer from './MatchPlayer'
import MatchTeam from './MatchTeam'

export default class Match extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public gameId: number

  @column()
  public map: number

  @column()
  public gamemode: number

  @column()
  public date: number

  @column()
  public region: string

  @column()
  public result: number

  @column()
  public season: number

  @column()
  public gameDuration: number

  @hasOne(() => MatchTeam)
  public blueTeam: HasOne<typeof MatchTeam>

  @hasOne(() => MatchTeam)
  public redTeam: HasOne<typeof MatchTeam>

  @hasMany(() => MatchPlayer)
  public players: HasMany<typeof MatchPlayer>
}
