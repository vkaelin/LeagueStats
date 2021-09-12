import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchPlayers extends BaseSchema {
  protected tableName = 'match_players'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('match_id', 15).notNullable()

      table.integer('participant_id').notNullable()
      table.string('summoner_id', 78).notNullable() // check length
      table.string('summoner_puuid', 78).notNullable()
      table.string('summoner_name', 16).notNullable()

      table.integer('team').notNullable()
      table.string('team_position', 8).notNullable()

      table.integer('kills').notNullable()
      table.integer('deaths').notNullable()
      table.integer('assists').notNullable()
      table.float('kda').notNullable()
      table.float('kp').notNullable()

      table.integer('champ_level').notNullable()
      table.integer('champion_id').notNullable()
      table.integer('champion_role1').notNullable()
      table.integer('champion_role2').nullable()

      table.integer('double_kills').notNullable()
      table.integer('triple_kills').notNullable()
      table.integer('quadra_kills').notNullable()
      table.integer('penta_kills').notNullable()

      table.integer('baron_kills').notNullable()
      table.integer('dragon_kills').notNullable()
      table.integer('turret_kills').notNullable()
      table.integer('vision_score').notNullable()
      table.integer('gold').notNullable()

      table.integer('summoner1_id').notNullable()
      table.integer('summoner2_id').notNullable()

      table.integer('item0').notNullable()
      table.integer('item1').notNullable()
      table.integer('item2').notNullable()
      table.integer('item3').notNullable()
      table.integer('item4').notNullable()
      table.integer('item5').notNullable()
      table.integer('item6').notNullable()

      table.integer('damage_dealt_objectives').notNullable()
      table.integer('damage_dealt_champions').notNullable()
      table.integer('damage_taken').notNullable()
      table.integer('heal').notNullable()
      table.integer('minions').notNullable()

      table.integer('critical_strike').notNullable()
      table.integer('killing_spree').notNullable()
      table.integer('time_spent_living').notNullable()

      table.integer('perks_primary_style').notNullable()
      table.integer('perks_secondary_style').notNullable()
      table.specificType('perks_selected', 'INT[]').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
