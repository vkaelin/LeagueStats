import Database from '@ioc:Adonis/Lucid/Database'
import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import Match from 'App/Models/Match'
import { getSeasonNumber } from 'App/helpers'
class MatchParser {
  public async parseOneMatch(match: MatchDto) {
    // Parse + store in database
    // - 1x Match
    const parsedMatch = await Match.create({
      id: match.metadata.matchId,
      gameId: match.info.gameId,
      map: match.info.mapId,
      gamemode: match.info.queueId,
      date: match.info.gameCreation,
      region: match.info.platformId.toLowerCase(),
      result: match.info.teams[0].win ? match.info.teams[0].teamId : match.info.teams[1].teamId,
      season: getSeasonNumber(match.info.gameCreation),
      gameDuration: match.info.gameDuration,
    })

    // - 2x MatchTeam : Red and Blue
    for (const team of match.info.teams) {
      let result = team.win ? 'Win' : 'Fail'
      if (match.info.gameDuration < 300) {
        result = 'Remake'
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

    // - 10x MatchPlayer
    const matchPlayers: any[] = []
    for (const player of match.info.participants) {
      const kda =
        player.kills + player.assists !== 0 && player.deaths === 0
          ? player.kills + player.assists
          : +(player.deaths === 0 ? 0 : (player.kills + player.assists) / player.deaths).toFixed(2)

      const teamKills =
        match.info.teams[0].teamId === player.teamId
          ? match.info.teams[0].objectives.champion.kills
          : match.info.teams[1].objectives.champion.kills

      const kp =
        teamKills === 0 ? 0 : +(((player.kills + player.assists) * 100) / teamKills).toFixed(1)

      const primaryStyle = player.perks.styles.find((s) => s.description === 'primaryStyle')
      const secondaryStyle = player.perks.styles.find((s) => s.description === 'subStyle')

      const perksSelected: number[] = []
      for (const styles of player.perks.styles) {
        for (const perk of styles.selections) {
          perksSelected.push(perk.perk)
        }
      }

      matchPlayers.push({
        match_id: match.metadata.matchId,
        participant_id: player.participantId,
        summoner_id: player.summonerId,
        summoner_puuid: player.puuid,
        summoner_name: player.summonerName,
        team: player.teamId,
        team_position: player.teamPosition,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        kda: kda,
        kp: kp,
        champ_level: player.champLevel,
        champion_id: player.championId,
        champion_role1: 0, // TODO
        champion_role2: 0, // TODO
        double_kills: player.doubleKills,
        triple_kills: player.tripleKills,
        quadra_kills: player.quadraKills,
        penta_kills: player.pentaKills,
        baron_kills: player.baronKills,
        dragon_kills: player.dragonKills,
        turret_kills: player.turretKills,
        vision_score: player.visionScore,
        gold: player.goldEarned,
        summoner1_id: player.summoner1Id,
        summoner2_id: player.summoner2Id,
        item0: player.item0,
        item1: player.item1,
        item2: player.item2,
        item3: player.item3,
        item4: player.item4,
        item5: player.item5,
        item6: player.item6,
        damage_dealt_objectives: player.damageDealtToObjectives,
        damage_dealt_champions: player.totalDamageDealtToChampions,
        damage_taken: player.totalDamageTaken,
        heal: player.totalHeal,
        minions: player.totalMinionsKilled,
        critical_strike: player.largestCriticalStrike,
        killing_spree: player.killingSprees,
        time_spent_living: player.longestTimeSpentLiving,
        perks_primary_style: primaryStyle!.style,
        perks_secondary_style: secondaryStyle!.style,
        perks_selected: perksSelected,
      })
    }
    await Database.table('match_players').multiInsert(matchPlayers)
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
