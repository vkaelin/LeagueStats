import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import Match from 'App/Models/Match'
import MatchPlayer from 'App/Models/MatchPlayer'
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
    for (const team of match.info.teams) {
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

    const matchPlayers = match.info.participants.map(
      (p) => <MatchPlayer>(<unknown>{
          matchId: match.metadata.matchId,
          participantId: p.participantId,
          summonerId: p.summonerId,
          summonerPuuid: p.puuid,
          summonerName: p.summonerName,
          team: p.teamId,
          teamPosition: p.teamPosition,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          kda: 100,
          kp: 100,
          champLevel: p.champLevel,
          championId: p.championId,
          championRole1: 1,
          championRole2: 2,
          doubleKills: p.doubleKills,
          tripleKills: p.tripleKills,
          quadraKills: p.quadraKills,
          pentaKills: p.pentaKills,
          baronKills: p.baronKills,
          dragonKills: p.dragonKills,
          turretKills: p.turretKills,
          visionScore: p.visionScore,
          gold: p.goldEarned,
          summoner1Id: p.summoner1Id,
          summoner2Id: p.summoner2Id,
          item0: p.item0,
          item1: p.item1,
          item2: p.item2,
          item3: p.item3,
          item4: p.item4,
          item5: p.item5,
          item6: p.item6,
          damageDealtObjectives: p.damageDealtToObjectives,
          damageDealtChampions: p.totalDamageDealtToChampions,
          damageTaken: p.totalDamageTaken,
          heal: p.totalHeal,
          minions: p.totalMinionsKilled,
          criticalStrike: p.largestCriticalStrike,
          killingSpree: p.killingSprees,
          timeSpentLiving: p.longestTimeSpentLiving,
          perksPrimaryStyle: 100,
          perksSecondaryStyle: 100,
          perksSelected: [1, 2, 3],
        })
    )

    parsedMatch.related('players').createMany(matchPlayers)

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
