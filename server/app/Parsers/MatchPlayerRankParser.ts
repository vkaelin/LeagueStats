import Database from '@ioc:Adonis/Lucid/Database'
import { notEmpty } from 'App/helpers'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
import SummonerService from 'App/Services/SummonerService'
import { PlayerRankParsed } from './ParsedType'

class MatchPlayerRankParser {
  public async parse(match: Match): Promise<PlayerRankParsed[]> {
    const requests = match.players.map((p) => SummonerService.getRanked(p.summonerId, match.region))
    const ranks = await Promise.all(requests)

    const parsedRanks = ranks
      .map((rank) => {
        return Object.entries(rank).map(([queue, data]) => {
          let player: MatchPlayer | undefined
          if (!data || !(player = match.players.find((p) => p.summonerId === data.summonerId))) {
            return
          }

          const rank: PlayerRankParsed = {
            player_id: player.id,
            gamemode: queue === 'soloQ' ? 420 : 440,
            tier: data.tier,
            rank: SummonerService.leaguesNumbers[data.rank],
            lp: data.leaguePoints,
            wins: data.wins,
            losses: data.losses,
          }
          return rank
        })
      })
      .flat()
      .filter(notEmpty)

    // Store ranks in DB
    if (parsedRanks.length) {
      await Database.table('match_player_ranks').multiInsert(parsedRanks)
    }

    return parsedRanks
  }
}

export default new MatchPlayerRankParser()
