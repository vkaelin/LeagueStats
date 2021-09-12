import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import Match from 'App/Models/Match'
import { getSeasonNumber } from 'App/helpers'
class MatchParser {
  public async parseOneMatch(match: MatchDto) {
    // TODO: parse + store in database
    // From the MatchDto, we need these Models in the DB:

    // - 1x Match
    const parsedMatch = await Match.create({
      id: match.metadata.matchId,
      gameId: match.info.gameId,
      map: match.info.mapId,
      gamemode: match.info.queueId,
      date: match.info.gameCreation,
      region: match.info.platformId.toLowerCase(),
      result: 0, // TODO
      season: getSeasonNumber(match.info.gameCreation),
      gameDuration: match.info.gameDuration,
    })

    // - 2x MatchTeam : Red and Blue
    let result = 'Remake'
    for (let team of match.info.teams) {
      if (match.info.gameDuration >= 300) {
        result = team.win ? 'Win' : 'Fail'
      }
      const teamColor = team.teamId === 100 ? 'blueTeam' : 'redTeam'
      parsedMatch.related(teamColor).create({
        matchId: match.metadata.matchId,
        color: team.teamId,
        result: result,
        barons: team.objectives.baron.kills,
        dragons: team.objectives.dragon.kills,
        inhibitors: team.objectives.inhibitor.kills,
        riftHeralds: team.objectives.riftHerald.kills,
        bans: team.bans.map((ban) => ban.championId),
        banOrders: team.bans.map((ban) => ban.pickTurn),
      })
    }

    // - 10x MatchPlayer // TODO

    return parsedMatch
  }

  public async parse(matches: MatchDto[]) {
    // Loop on all matches and call .parseOneMatch on it
    const parsedMatches: Match[] = []
    for (const match of matches) {
      parsedMatches.push(await this.parseOneMatch(match))
    }
    return parsedMatches
  }
}

export default new MatchParser()
