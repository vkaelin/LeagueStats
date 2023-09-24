import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('matches', (table) => {
      table.index(['id', 'gamemode'], 'matches_combined_index1')
    })

    this.schema.alterTable('match_players', (table) => {
      table.index(['summoner_puuid', 'remake', 'match_id'], 'match_players_combined_index1')
      table.index(['match_id', 'team', 'summoner_puuid'], 'match_players_combined_index2')
    })
  }

  public async down() {}
}
