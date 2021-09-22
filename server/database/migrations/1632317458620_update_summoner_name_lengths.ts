import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateSummonerNameLengths extends BaseSchema {
  public async up() {
    this.schema.alterTable('match_players', (table) => {
      table.string('summoner_name', 30).alter().notNullable()
    })

    this.schema.alterTable('summoner_names', (table) => {
      table.string('name', 30).alter().notNullable()
    })
  }

  public async down() {}
}
