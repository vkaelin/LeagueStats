import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchPlayerRanks extends BaseSchema {
  protected tableName = 'match_player_ranks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('player_id').unsigned().notNullable()

      table.integer('gamemode').notNullable()
      table.string('tier', 11).notNullable()
      table.integer('rank').notNullable()
      table.integer('lp').notNullable()
      table.integer('wins').notNullable()
      table.integer('losses').notNullable()

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
