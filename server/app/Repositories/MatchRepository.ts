import Database from '@ioc:Adonis/Lucid/Database'

class MatchRepository {
  private readonly JOIN_MATCHES = 'INNER JOIN matches ON matches.id = match_players.match_id'
  private readonly JOIN_TEAMS =
    'INNER JOIN match_teams ON match_players.match_id = match_teams.match_id AND match_players.team = match_teams.color'
  private readonly JOIN_ALL = `${this.JOIN_MATCHES} ${this.JOIN_TEAMS}`

  private readonly GLOBAL_FILTERS = `
    match_players.summoner_puuid = :puuid
    AND match_players.remake = 0
    AND matches.gamemode NOT IN (800, 810, 820, 830, 840, 850, 2000, 2010, 2020)
  `

  public async recentActivity(puuid: string) {
    const query = `
    SELECT
        to_timestamp(matches.date/1000)::date as day,
        COUNT(match_players.id) as count
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        match_players.summoner_puuid = :puuid
        AND to_timestamp(matches.date/1000)::date > (CURRENT_DATE - INTERVAL '105 days')
    GROUP BY
        day
    ORDER BY
        day
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }

  public async globalStats(puuid: string) {
    const query = `
    SELECT
        SUM(match_players.kills) as kills,
        SUM(match_players.deaths) as deaths,
        SUM(match_players.assists) as assists,
        SUM(match_players.minions) as minions,
        SUM(matches.game_duration) as time,
        SUM(match_players.vision_score) as vision,
        COUNT(match_players.id) as count,
        AVG(match_players.kp) as kp,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
    LIMIT
        1
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows[0]
  }

  public async gamemodeStats(puuid: string) {
    const query = `
    SELECT
        matches.gamemode as id,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
    GROUP BY
        matches.gamemode
    ORDER BY
        count DESC
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }

  public async roleStats(puuid: string) {
    const query = `
    SELECT
        match_players.team_position as role,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
        AND match_players.team_position != 0
    GROUP BY
        role
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }

  public async championStats(puuid: string, limit: number) {
    const query = `
    SELECT
        match_players.champion_id as id,
        SUM(match_players.assists) as assists,
        SUM(match_players.deaths) as deaths,
        SUM(match_players.kills) as kills,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
    GROUP BY
        match_players.champion_id
    ORDER BY
        count DESC, match_players.champion_id
    LIMIT
      :limit
    `
    const { rows } = await Database.rawQuery(query, { puuid, limit })
    return rows
  }

  public async championClassStats(puuid: string) {
    const query = `
    SELECT
        match_players.champion_role as id,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
    GROUP BY
        match_players.champion_role
    ORDER BY
        count DESC
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }

  public async championCompleteStats(puuid: string, queue?: number, season?: number) {
    const query = `
    SELECT
        match_players.champion_id as id,
        SUM(match_players.assists) as assists,
        SUM(match_players.deaths) as deaths,
        SUM(match_players.kills) as kills,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses,
        AVG(matches.game_duration)::int as "gameLength",
        AVG(match_players.minions)::int as minions,
        AVG(match_players.gold)::int as gold,
        AVG(match_players.damage_dealt_champions)::int as "dmgChamp",
        AVG(match_players.damage_taken)::int as "dmgTaken",
        AVG(match_players.kp) as kp,
        MAX(matches.date) as date
    FROM
        match_players
        ${this.JOIN_MATCHES}
    WHERE
        ${this.GLOBAL_FILTERS}
    GROUP BY
        match_players.champion_id
    ORDER BY
        count DESC, match_players.champion_id
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }

  public async mates(puuid: string) {
    const query = `
    SELECT
        (array_agg(mates.summoner_name ORDER BY mates.match_id DESC))[1] as name,
        COUNT(match_players.id) as count,
        SUM(match_players.win) as wins,
        SUM(match_players.loss) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
        INNER JOIN match_players as mates ON match_players.match_id = mates.match_id AND match_players.team = mates.team
    WHERE
        ${this.GLOBAL_FILTERS}
    GROUP BY
        mates.summoner_puuid
    ORDER BY
        count DESC, wins DESC
    LIMIT
        15
    `
    const { rows } = await Database.rawQuery(query, { puuid })

    // Remove the Summoner himself + unique game mates
    return rows.splice(1).filter((row) => row.count > 1)
  }

  public async records(puuid: string) {
    const fields = [
      'match_players.kills',
      'match_players.deaths',
      'match_players.assists',
      'match_players.gold',
      'matches.game_duration',
      'match_players.minions',
      'match_players.kda',
      'match_players.damage_taken',
      'match_players.damage_dealt_champions',
      'match_players.damage_dealt_objectives',
      'match_players.kp',
      'match_players.vision_score',
      'match_players.critical_strike',
      'match_players.time_spent_living',
      'match_players.heal',
      'match_players.turret_kills',
      'match_players.killing_spree',
      'match_players.double_kills',
      'match_players.triple_kills',
      'match_players.quadra_kills',
      'match_players.penta_kills',
    ]

    const query = fields
      .map((field) => {
        return `
      (SELECT
          '${field}' AS what,
          ${field} AS amount,
          match_players.win as result,
          matches.id,
          matches.date,
          matches.gamemode,
          match_players.champion_id
      FROM
          match_players
          ${this.JOIN_MATCHES}
      WHERE
          ${this.GLOBAL_FILTERS}
      ORDER BY
          ${field} DESC, matches.id
      LIMIT 
          1)
      `
      })
      .join('UNION ALL ')

    const { rows } = await Database.rawQuery(query, { puuid })
    return rows
  }
}

export default new MatchRepository()
