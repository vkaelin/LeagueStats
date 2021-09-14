import Database from '@ioc:Adonis/Lucid/Database'

class MatchRepository {
  public async globalStats(puuid: string, season?: number) {
    // TODO: add wins/losses
    return Database.from('match_players')
      .where('summoner_puuid', puuid)
      .join('matches', 'match_players.match_id', 'matches.id')
      .sum({
        assists: 'assists',
        deaths: 'deaths',
        kills: 'kills',
        minions: 'minions',
        time: 'matches.game_duration',
        vision: 'vision_score',
      })
      .count({
        count: 'assists',
      })
      .avg('kp')
      .first()
  }
}

export default new MatchRepository()
