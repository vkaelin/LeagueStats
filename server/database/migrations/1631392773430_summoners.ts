import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Summoners extends BaseSchema {
  protected tableName = 'summoners'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('puuid', 78).primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
