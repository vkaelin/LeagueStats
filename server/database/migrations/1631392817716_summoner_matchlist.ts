import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SummonerMatchLists extends BaseSchema {
  protected tableName = 'summoner_matchlist'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('summoner_puuid', 78).notNullable().index()
      table.string('match_id', 15).notNullable().index()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['summoner_puuid', 'match_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
