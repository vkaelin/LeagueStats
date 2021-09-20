import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Matches extends BaseSchema {
  protected tableName = 'matches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 15).primary()
      table.bigInteger('game_id').notNullable()
      table.specificType('map', 'smallint').notNullable()
      table.specificType('gamemode', 'smallint').notNullable().index()
      table.bigInteger('date').notNullable()
      table.string('region', 4).notNullable()
      table.specificType('result', 'smallint').notNullable()

      table.float('season').notNullable().index()
      table.specificType('game_duration', 'smallint').unsigned().notNullable()
    })

    // this.schema.alterTable
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
