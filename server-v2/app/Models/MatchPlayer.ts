import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Match from './Match'
import Summoner from './Summoner'

export default class MatchPlayer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matchId: number

  @belongsTo(() => Match)
  public match: BelongsTo<typeof Match>

  @column()
  public participantId: number

  @column()
  public summonerId: number

  @column()
  public summonerPuuid: string

  @belongsTo(() => Summoner, {
    localKey: 'puuid',
    foreignKey: 'summonerPuuid',
  })
  public summoner: BelongsTo<typeof Summoner>

  @column()
  public summonerName: string

  @column()
  public team: number

  @column()
  public teamPosition: string

  @column()
  public kills: number

  @column()
  public deaths: number

  @column()
  public assists: number

  @column()
  public kda: number

  @column()
  public kp: number

  @column()
  public champLevel: number

  @column()
  public championId: number

  @column()
  public championRole1: number

  @column()
  public championRole2: number

  @column()
  public doubleKills: number

  @column()
  public tripleKills: number

  @column()
  public quadraKills: number

  @column()
  public pentaKills: number

  @column()
  public baronKills: number

  @column()
  public dragonKills: number

  @column()
  public turretKills: number

  @column()
  public visionScore: number

  @column()
  public gold: number

  @column()
  public summoner1Id: number

  @column()
  public summoner2Id: number

  @column()
  public item0: number

  @column()
  public item1: number

  @column()
  public item2: number

  @column()
  public item3: number

  @column()
  public item4: number

  @column()
  public item5: number

  @column()
  public item6: number

  @column()
  public damageDealtObjectives: number

  @column()
  public damageDealtChampions: number

  @column()
  public damageTaken: number

  @column()
  public heal: number

  @column()
  public minions: number

  @column()
  public criticalStrike: number

  @column()
  public killingSpree: number

  @column()
  public timeSpentLiving: number

  @column()
  public perksPrimaryStyle: number

  @column()
  public perksSecondaryStyle: number

  @column()
  public perksSelected: number[]
}
