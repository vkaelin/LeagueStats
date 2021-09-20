import { PlayerRankParsed } from 'App/Parsers/ParsedType'
import MatchSerializer from './MatchSerializer'
import { SerializedPlayerRanksList } from './SerializedTypes'

class MatchPlayerRankSerializer extends MatchSerializer {
  public serialize(ranks: PlayerRankParsed[]): SerializedPlayerRanksList {
    const result = ranks.reduce((acc, rank) => {
      if (!acc[rank.player_id]) {
        acc[rank.player_id] = {}
      }

      acc[rank.player_id][rank.gamemode] = this.getPlayerRank(rank)
      return acc
    }, {} as SerializedPlayerRanksList)

    return result
  }
}

export default new MatchPlayerRankSerializer()
