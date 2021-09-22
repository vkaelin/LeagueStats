import Database from '@ioc:Adonis/Lucid/Database'
import Match from 'App/Models/Match'
import { getSeasonNumber, notEmpty, PlayerRole, queuesWithRole, supportItems } from 'App/helpers'
import CDragonService from 'App/Services/CDragonService'
import { ChampionRoles, TeamPosition } from './ParsedType'
import { V4MatchDto } from 'App/Services/Jax/src/Endpoints/MatchV4Endpoint'
import RoleIdentificationService from 'App/Services/RoleIdentificationService'
import Jax from 'App/Services/Jax'

class MatchV4Parser {
  public createMatchId(gameId: number, region: string) {
    return `${region.toUpperCase()}_${gameId}`
  }

  private getTeamRoles(team: PlayerRole[]) {
    const teamJunglers = team.filter((p) => p.jungle && !p.support)
    const jungle = teamJunglers.length === 1 ? teamJunglers[0].champion : undefined
    const teamSupports = team.filter((p) => p.support && !p.jungle)
    const support = teamSupports.length === 1 ? teamSupports[0].champion : undefined

    return RoleIdentificationService.getRoles(
      CDragonService.championRoles,
      team.map((p) => p.champion),
      jungle,
      support
    )
  }

  private getMatchRoles(match: V4MatchDto) {
    const blueChamps: PlayerRole[] = []
    const redChamps: PlayerRole[] = []

    match.participants.map((p) => {
      const items = [
        p.stats.item0,
        p.stats.item1,
        p.stats.item2,
        p.stats.item3,
        p.stats.item4,
        p.stats.item5,
      ]
      const playerRole = {
        champion: p.championId,
        jungle: p.spell1Id === 11 || p.spell2Id === 11,
        support: supportItems.some((suppItem) => items.includes(suppItem)),
      }
      p.teamId === 100 ? blueChamps.push(playerRole) : redChamps.push(playerRole)
    })

    return {
      blue: this.getTeamRoles(blueChamps),
      red: this.getTeamRoles(redChamps),
    }
  }

  public async parseOneMatch(match: V4MatchDto) {
    // Parse + store in database
    const matchId = this.createMatchId(match.gameId, match.platformId)
    console.log(matchId)

    if (match.participants.length !== 10) {
      console.log(`Match not saved because < 10 players. Gamemode: ${match.queueId}`)
      return
    }
    // PUUID of the 10 players
    const accountRequests = match.participantIdentities
      .filter((p) => p.player.accountId !== '0')
      .map((p) => Jax.Summoner.accountId(p.player.currentAccountId, match.platformId.toLowerCase()))
    const playerAccounts = (await Promise.all(accountRequests)).filter(notEmpty)

    if (!playerAccounts || !playerAccounts.length) {
      console.log(`0 Account found from match: ${matchId}`)
      return
    }

    const isRemake = match.gameDuration < 300

    // Roles
    const { blue: blueRoles, red: redRoles } = this.getMatchRoles(match)

    // - 10x MatchPlayer
    const matchPlayers: any[] = []
    for (const player of match.participants) {
      const identity = match.participantIdentities.find(
        (p) => p.participantId === player.participantId
      )!
      const isBot = identity.player.accountId === '0'
      const account = isBot
        ? null
        : playerAccounts.find((p) => p.accountId === identity.player.currentAccountId)

      if (!account && !isBot) {
        console.log(`Account not found ${identity.player.currentAccountId}`)
        console.log(`Match ${matchId} not saved in the database.`)
        return
      }

      const kda =
        player.stats.kills + player.stats.assists !== 0 && player.stats.deaths === 0
          ? player.stats.kills + player.stats.assists
          : +(
              player.stats.deaths === 0
                ? 0
                : (player.stats.kills + player.stats.assists) / player.stats.deaths
            ).toFixed(2)

      const team = match.teams[0].teamId === player.teamId ? match.teams[0] : match.teams[1]
      const totalKills = match.participants.reduce((prev, current) => {
        if (current.teamId !== player.teamId) {
          return prev
        }
        return prev + current.stats.kills
      }, 0)

      const kp =
        totalKills === 0
          ? 0
          : +(((player.stats.kills + player.stats.assists) * 100) / totalKills).toFixed(1)

      // Perks
      const primaryStyle = player.stats.perkPrimaryStyle
      const secondaryStyle = player.stats.perkSubStyle
      const perksSelected: number[] = []
      for (let i = 0; i < 6; i++) {
        perksSelected.push(player.stats[`perk${i}`])
      }
      for (let i = 0; i < 3; i++) {
        perksSelected.push(player.stats[`statPerk${i}`])
      }

      const originalChampionData = CDragonService.champions[player.championId]
      const champRoles = originalChampionData.roles

      // Role
      const teamRoles = player.teamId === 100 ? blueRoles : redRoles
      const role = Object.entries(teamRoles).find(
        ([, champion]) => player.championId === champion
      )![0]

      matchPlayers.push({
        match_id: matchId,
        participant_id: player.participantId,
        summoner_id: isBot ? 'BOT' : identity.player.summonerId,
        summoner_puuid: account ? account.puuid : 'BOT',
        summoner_name: identity.player.summonerName,
        win: team.win === 'Win' ? 1 : 0,
        loss: team.win === 'Fail' ? 1 : 0,
        remake: isRemake ? 1 : 0,
        team: player.teamId,
        team_position: queuesWithRole.includes(match.queueId)
          ? TeamPosition[role]
          : TeamPosition.NONE,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        kda: kda,
        kp: kp,
        champ_level: player.stats.champLevel,
        champion_id: player.championId,
        champion_role: ChampionRoles[champRoles[0]],
        double_kills: player.stats.doubleKills,
        triple_kills: player.stats.tripleKills,
        quadra_kills: player.stats.quadraKills,
        penta_kills: player.stats.pentaKills,
        baron_kills: 0,
        dragon_kills: 0,
        turret_kills: player.stats.turretKills,
        vision_score: player.stats.visionScore,
        gold: player.stats.goldEarned,
        summoner1_id: player.spell1Id,
        summoner2_id: player.spell2Id,
        item0: player.stats.item0,
        item1: player.stats.item1,
        item2: player.stats.item2,
        item3: player.stats.item3,
        item4: player.stats.item4,
        item5: player.stats.item5,
        item6: player.stats.item6,
        damage_dealt_objectives: player.stats.damageDealtToObjectives,
        damage_dealt_champions: player.stats.totalDamageDealtToChampions,
        damage_taken: player.stats.totalDamageTaken,
        heal: player.stats.totalHeal,
        minions: player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled,
        critical_strike: player.stats.largestCriticalStrike,
        killing_spree: player.stats.killingSprees,
        time_spent_living: player.stats.longestTimeSpentLiving,
        perks_primary_style: primaryStyle ?? 8100,
        perks_secondary_style: secondaryStyle ?? 8000,
        perks_selected: perksSelected,
      })
    }
    await Database.table('match_players').multiInsert(matchPlayers)

    // - 1x Match
    const parsedMatch = await Match.create({
      id: matchId,
      gameId: match.gameId,
      map: match.mapId,
      gamemode: match.queueId,
      date: match.gameCreation,
      region: match.platformId.toLowerCase(),
      result: match.teams[0].win === 'Win' ? match.teams[0].teamId : match.teams[1].teamId,
      season: getSeasonNumber(match.gameCreation),
      gameDuration: match.gameDuration,
    })

    // - 2x MatchTeam : Red and Blue
    for (const team of match.teams) {
      let result = team.win === 'Win' ? 'Win' : 'Fail'
      if (isRemake) {
        result = 'Remake'
      }
      await parsedMatch.related('teams').create({
        matchId: matchId,
        color: team.teamId,
        result: result,
        barons: team.baronKills,
        dragons: team.dragonKills,
        inhibitors: team.inhibitorKills,
        riftHeralds: team.riftHeraldKills,
        towers: team.towerKills,
        bans: team.bans.length ? team.bans.map((ban) => ban.championId) : undefined,
        banOrders: team.bans.length ? team.bans.map((ban) => ban.pickTurn) : undefined,
      })
    }
    return parsedMatch
  }

  public async parse(matches: V4MatchDto[]) {
    // Loop on all matches and call .parseOneMatch on it
    const parsedMatches: Match[] = []
    for (const match of matches) {
      const parsed = await this.parseOneMatch(match)
      if (parsed) {
        parsedMatches.push(parsed)
      }
    }
    return parsedMatches.length
  }
}

export default new MatchV4Parser()
