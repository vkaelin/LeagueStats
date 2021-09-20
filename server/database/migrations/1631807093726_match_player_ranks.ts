import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchPlayerRanks extends BaseSchema {
  protected tableName = 'match_player_ranks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('player_id').unsigned().notNullable().index()

      table.specificType('gamemode', 'smallint').notNullable()

      table.string('tier', 11).notNullable()
      table.specificType('rank', 'smallint').notNullable()
      table.specificType('lp', 'smallint').unsigned().notNullable()
      table.specificType('wins', 'smallint').unsigned().notNullable()
      table.specificType('losses', 'smallint').unsigned().notNullable()

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
