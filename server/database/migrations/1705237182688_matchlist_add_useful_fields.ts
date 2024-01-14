import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'summoner_matchlist'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('useful').defaultTo(true).notNullable().index()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('useful')
    })
  }
}
