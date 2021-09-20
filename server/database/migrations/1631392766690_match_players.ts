import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchPlayers extends BaseSchema {
  protected tableName = 'match_players'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('match_id', 15).notNullable().index()

      table.specificType('participant_id', 'smallint').notNullable()
      table.string('summoner_id', 63).notNullable()
      table.string('summoner_puuid', 78).notNullable().index()
      table.string('summoner_name', 16).notNullable()

      table.specificType('win', 'smallint').notNullable()
      table.specificType('loss', 'smallint').notNullable()
      table.specificType('remake', 'smallint').notNullable()

      table.specificType('team', 'smallint').notNullable().index()
      table.specificType('team_position', 'smallint').notNullable().index()

      table.specificType('kills', 'smallint').unsigned().notNullable()
      table.specificType('deaths', 'smallint').unsigned().notNullable()
      table.specificType('assists', 'smallint').unsigned().notNullable()
      table.float('kda').notNullable()
      table.float('kp').notNullable()

      table.specificType('champ_level', 'smallint').notNullable()
      table.specificType('champion_id', 'smallint').notNullable().index()
      table.specificType('champion_role', 'smallint').notNullable()

      table.specificType('double_kills', 'smallint').notNullable()
      table.specificType('triple_kills', 'smallint').notNullable()
      table.specificType('quadra_kills', 'smallint').notNullable()
      table.specificType('penta_kills', 'smallint').notNullable()

      table.specificType('baron_kills', 'smallint').notNullable()
      table.specificType('dragon_kills', 'smallint').notNullable()
      table.specificType('turret_kills', 'smallint').notNullable()
      table.specificType('vision_score', 'smallint').notNullable()
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
      table.specificType('minions', 'smallint').notNullable()

      table.specificType('critical_strike', 'smallint').unsigned().notNullable()
      table.specificType('killing_spree', 'smallint').unsigned().notNullable()
      table.specificType('time_spent_living', 'smallint').unsigned().notNullable()

      table.integer('perks_primary_style').notNullable()
      table.integer('perks_secondary_style').notNullable()
      table.specificType('perks_selected', 'INT[]').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
