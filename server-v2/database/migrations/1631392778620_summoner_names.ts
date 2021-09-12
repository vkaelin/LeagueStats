import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SummonerNames extends BaseSchema {
  protected tableName = 'summoner_names'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('summoner_puuid', 78).notNullable()
      table.string('name', 16).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
