import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchTeams extends BaseSchema {
  protected tableName = 'match_teams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('match_id', 15)

      table.string('color', 4).notNullable()
      table.integer('result').notNullable()

      table.integer('barons').notNullable()
      table.integer('dragons').notNullable()
      table.integer('inhibitors').notNullable()
      table.integer('rift_heralds').notNullable()

      table.specificType('bans', 'INT[]').notNullable()
      table.specificType('ban_orders', 'INT[]').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
