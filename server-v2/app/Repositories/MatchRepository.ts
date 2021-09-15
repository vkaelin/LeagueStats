import Database from '@ioc:Adonis/Lucid/Database'

class MatchRepository {
  public async globalStats(puuid: string, season?: number) {
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
        INNER JOIN matches ON matches.id = match_players.match_id
        INNER JOIN match_teams ON matches.id = match_teams.match_id AND match_players.team = match_teams.color
    WHERE
        summoner_puuid = :puuid
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
}

export default new MatchRepository()
