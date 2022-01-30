import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'
import Match from 'App/Models/Match'
import { getSeasonNumber, queuesWithRole } from 'App/helpers'
import CDragonService from 'App/Services/CDragonService'
import { ChampionRoles, TeamPosition } from './ParsedType'
class MatchParser {
  public async parseOneMatch(match: MatchDto) {
    let parsedMatch: Match | null = null
    let trx: TransactionClientContract | undefined

    try {
      // Start transaction
      trx = await Database.transaction()

      const gameDuration =
        match.info.gameDuration > 100_000
          ? Math.round(match.info.gameDuration / 1000)
          : match.info.gameDuration

      const isRemake = gameDuration < 300

      // - 1x Match
      parsedMatch = await Match.create(
        {
          id: match.metadata.matchId,
          gameId: match.info.gameId,
          map: match.info.mapId,
          gamemode: match.info.queueId,
          date: match.info.gameCreation,
          region: match.info.platformId.toLowerCase(),
          result: match.info.teams[0].win ? match.info.teams[0].teamId : match.info.teams[1].teamId,
          season: getSeasonNumber(match.info.gameCreation),
          gameDuration,
        },
        { client: trx }
      )

      // - 2x MatchTeam : Red and Blue
      for (const team of match.info.teams) {
        let result = team.win ? 'Win' : 'Fail'
        if (isRemake) {
          result = 'Remake'
        }
        await parsedMatch.related('teams').create({
          matchId: match.metadata.matchId,
          color: team.teamId,
          result: result,
          barons: team.objectives.baron.kills,
          dragons: team.objectives.dragon.kills,
          inhibitors: team.objectives.inhibitor.kills,
          riftHeralds: team.objectives.riftHerald.kills,
          towers: team.objectives.tower.kills,
          bans: team.bans.length ? team.bans.map((ban) => ban.championId) : undefined,
          banOrders: team.bans.length ? team.bans.map((ban) => ban.pickTurn) : undefined,
        })
      }

      // - 10x MatchPlayer
      const matchPlayers: any[] = []
      for (const player of match.info.participants) {
        const kda =
          player.kills + player.assists !== 0 && player.deaths === 0
            ? player.kills + player.assists
            : +(player.deaths === 0 ? 0 : (player.kills + player.assists) / player.deaths).toFixed(
                2
              )

        const team =
          match.info.teams[0].teamId === player.teamId ? match.info.teams[0] : match.info.teams[1]
        const teamKills = team.objectives.champion.kills

        let kp =
          teamKills === 0 ? 0 : +(((player.kills + player.assists) * 100) / teamKills).toFixed(1)

        const primaryStyle = player.perks.styles.find((s) => s.description === 'primaryStyle')
        const secondaryStyle = player.perks.styles.find((s) => s.description === 'subStyle')

        const perksSelected: number[] = []
        for (const styles of player.perks.styles) {
          for (const perk of styles.selections) {
            perksSelected.push(perk.perk)
          }
        }

        // Fix championId bug in older matches
        if (player.championId > 1000) {
          const championId = Object.keys(CDragonService.champions).find(
            (key) =>
              CDragonService.champions[key].name === player.championName ||
              CDragonService.champions[key].alias === player.championName
          )
          if (!championId) {
            console.log(
              `CHAMPION NOT FOUND AT ALL: ${player.championId} FROM: ${match.metadata.matchId}`
            )
          }
          player.championId = championId ? Number(championId) : 1
        }

        const originalChampionData = CDragonService.champions[player.championId]
        const champRoles = originalChampionData.roles

        matchPlayers.push({
          match_id: match.metadata.matchId,
          participant_id: player.participantId,
          summoner_id: player.summonerId,
          summoner_puuid: player.puuid,
          summoner_name: player.summonerName,
          win: team.win ? 1 : 0,
          loss: team.win ? 0 : 1,
          remake: isRemake ? 1 : 0,
          team: player.teamId,
          team_position:
            player.teamPosition.length && queuesWithRole.includes(match.info.queueId)
              ? TeamPosition[player.teamPosition]
              : TeamPosition.NONE,
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          kda: kda,
          kp: kp,
          champ_level: player.champLevel,
          champion_id: player.championId,
          champion_role: ChampionRoles[champRoles[0]],
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
          minions: player.totalMinionsKilled + player.neutralMinionsKilled,
          critical_strike: player.largestCriticalStrike,
          killing_spree: player.killingSprees,
          time_spent_living: player.longestTimeSpentLiving,
          perks_primary_style: primaryStyle!.style,
          perks_secondary_style: secondaryStyle!.style,
          perks_selected: perksSelected.concat(Object.values(player.perks.statPerks)),
        })
      }
      await Database.table('match_players').multiInsert(matchPlayers)

      // Load Match relations
      await parsedMatch.load((loader) => {
        loader.load('teams').load('players')
      })

      if (!trx.isCompleted) {
        await trx.commit()
      }
    } catch (error) {
      console.log('Error in MatchParser transaction.')
      if (trx && trx.isTransaction) {
        await trx.rollback()
        return null
      }
    }

    return parsedMatch
  }

  public async parse(matches: MatchDto[]) {
    const parsedMatches: Match[] = []
    for (const match of matches) {
      const parsed = await this.parseOneMatch(match)
      if (parsed) {
        parsedMatches.push(parsed)
      }
    }
    return parsedMatches
  }
}

export default new MatchParser()
