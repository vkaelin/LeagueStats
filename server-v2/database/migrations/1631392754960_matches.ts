import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Matches extends BaseSchema {
  protected tableName = 'matches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 15).primary()
      table.bigInteger('game_id').notNullable()
      table.integer('map').notNullable()
      table.integer('gamemode').notNullable()
      table.bigInteger('date').notNullable()
      table.string('region', 4).notNullable()
      table.integer('result').notNullable()

      table.float('season').notNullable()
      table.integer('game_duration').notNullable()

      // table.integer('blue_team_id').notNullable()
      // table.integer('red_team_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
