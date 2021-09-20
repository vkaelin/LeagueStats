import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchTeams extends BaseSchema {
  protected tableName = 'match_teams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('match_id', 15).index()

      table.specificType('color', 'smallint').notNullable().index() // 100 ou 200
      table.string('result', 6) // Win - Remake - Fail

      table.specificType('barons', 'smallint').notNullable()
      table.specificType('dragons', 'smallint').notNullable()
      table.specificType('inhibitors', 'smallint').notNullable()
      table.specificType('rift_heralds', 'smallint').notNullable()
      table.specificType('towers', 'smallint').notNullable()

      table.specificType('bans', 'smallint[]').nullable()
      table.specificType('ban_orders', 'smallint[]').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
