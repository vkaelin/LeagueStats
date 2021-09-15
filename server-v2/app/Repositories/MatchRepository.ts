import Database from '@ioc:Adonis/Lucid/Database'

class MatchRepository {
  private readonly JOIN_MATCHES = 'INNER JOIN matches ON matches.id = match_players.match_id'
  private readonly JOIN_TEAMS =
    'INNER JOIN match_teams ON match_players.match_id = match_teams.match_id AND match_players.team = match_teams.color'
  private readonly JOIN_ALL = `${this.JOIN_MATCHES} ${this.JOIN_TEAMS}`

  private readonly GLOBAL_FILTERS = `
    summoner_puuid = :puuid
    AND match_teams.result != 'Remake'
    AND matches.gamemode NOT IN (800, 810, 820, 830, 840, 850, 2000, 2010, 2020)
  `

  public async globalStats(puuid: string) {
    const query = `
    SELECT
        SUM(assists) as assists,
        SUM(deaths) as deaths,
        SUM(kills) as kills,
        SUM(minions) as minions,
        SUM(matches.game_duration) as time,
        SUM(vision_score) as vision,
        COUNT(match_players.id) as count,
        AVG(kp) as kp,
        COUNT(case when match_teams.result = 'Win' then 1 else null end) as wins,
        COUNT(case when match_teams.result = 'Fail' then 1 else null end) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
    WHERE
        ${this.GLOBAL_FILTERS}
    LIMIT
        1
    `
    const { rows } = await Database.rawQuery(query, { puuid })
    return rows[0]
    // return Database.from('match_players')
    //   .where('summoner_puuid', puuid)
    //   .join('matches', 'match_players.match_id', 'matches.id')
    //   .join('match_teams', (query) => {
    //     query
    //       .on('match_teams.match_id', '=', 'match_players.match_id')
    //       .andOn('match_teams.color', '=', 'match_players.team')
    //   })
    //   .sum({
    //     assists: 'assists',
    //     deaths: 'deaths',
    //     kills: 'kills',
    //     minions: 'minions',
    //     time: 'matches.game_duration',
    //     vision: 'vision_score',
    //     result: 'match_teams.result',
    //   })
    //   .count({
    //     count: 'assists',
    //   })
    //   .avg('kp')
    //   .first()
  }

  public async gamemodeStats(puuid: string) {
    const query = `
    SELECT
        matches.gamemode as id,
        COUNT(match_players.id) as count,
        COUNT(case when match_teams.result = 'Win' then 1 else null end) as wins,
        COUNT(case when match_teams.result = 'Fail' then 1 else null end) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
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
        COUNT(case when match_teams.result = 'Win' then 1 else null end) as wins,
        COUNT(case when match_teams.result = 'Fail' then 1 else null end) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
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
        SUM(assists) as assists,
        SUM(deaths) as deaths,
        SUM(kills) as kills,
        COUNT(match_players.id) as count,
        COUNT(case when match_teams.result = 'Win' then 1 else null end) as wins,
        COUNT(case when match_teams.result = 'Fail' then 1 else null end) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
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
        COUNT(case when match_teams.result = 'Win' then 1 else null end) as wins,
        COUNT(case when match_teams.result = 'Fail' then 1 else null end) as losses
    FROM
        match_players
        ${this.JOIN_ALL}
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
}

export default new MatchRepository()
