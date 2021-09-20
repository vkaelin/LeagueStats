import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import SummonerMatchlist from './SummonerMatchlist'
import SummonerName from './SummonerName'
import MatchPlayer from './MatchPlayer'

export default class Summoner extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public puuid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => SummonerMatchlist, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public matchList: HasMany<typeof SummonerMatchlist>

  @hasMany(() => MatchPlayer, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public matches: HasMany<typeof MatchPlayer>

  @hasMany(() => SummonerName, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public names: HasMany<typeof SummonerName>
}
