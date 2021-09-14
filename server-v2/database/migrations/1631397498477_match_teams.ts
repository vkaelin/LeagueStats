import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchTeams extends BaseSchema {
  protected tableName = 'match_teams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('match_id', 15)

      table.integer('color').notNullable() // 100 ou 200
      table.string('result', 6) // Win - Remake - Fail

      table.integer('barons').notNullable()
      table.integer('dragons').notNullable()
      table.integer('inhibitors').notNullable()
      table.integer('rift_heralds').notNullable()

      table.specificType('bans', 'INT[]').nullable()
      table.specificType('ban_orders', 'INT[]').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
