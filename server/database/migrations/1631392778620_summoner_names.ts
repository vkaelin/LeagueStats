import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SummonerNames extends BaseSchema {
  protected tableName = 'summoner_names'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('summoner_puuid', 78).notNullable().index()
      table.string('name', 16).notNullable().index()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['summoner_puuid', 'name'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
