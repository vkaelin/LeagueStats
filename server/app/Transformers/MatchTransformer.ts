import { getSeasonNumber, queuesWithRole, sortTeamByRole, supportItems } from 'App/helpers'
import Jax from 'App/Services/Jax'
import { Champion, Item, ParticipantBasic, ParticipantDetails, PercentStats, Perks, Stats, SummonerSpell } from 'App/Models/Match'
import RoleIdentificationService, { ChampionsPlayRate } from 'App/Services/RoleIdentiticationService'
import { ChampionDTO, ItemDTO, PerkDTO, PerkStyleDTO, SummonerSpellDTO } from 'App/Services/Jax/src/Endpoints/CDragonEndpoint'
import { TeamStats } from 'App/Models/DetailedMatch'
import {
  MatchDto,
  ParticipantDto,
  PerksDto,
} from 'App/Services/Jax/src/Endpoints/MatchEndpoint'

export interface PlayerRole {
  champion: number,
  jungle?: boolean,
  support?: boolean,
}

export default abstract class MatchTransformer {
  protected champions: ChampionDTO[]
  protected items: ItemDTO[]
  protected perks: PerkDTO[]
  protected perkstyles: PerkStyleDTO[]
  protected summonerSpells: SummonerSpellDTO[]
  protected championRoles: ChampionsPlayRate
  protected sortTeamByRole: (a: ParticipantBasic | ParticipantDetails, b: ParticipantBasic | ParticipantDetails) => number
  /**
   * Get global Context with CDragon Data
   */
  public async getContext () {
    const items = await Jax.CDragon.items()
    const champions = await Jax.CDragon.champions()
    const perks = await Jax.CDragon.perks()
    const perkstyles = await Jax.CDragon.perkstyles()
    const summonerSpells = await Jax.CDragon.summonerSpells()
    const championRoles = await RoleIdentificationService.pullData().catch(() => { })

    this.champions = champions
    this.items = items
    this.perks = perks
    this.perkstyles = perkstyles.styles
    this.summonerSpells = summonerSpells
    this.championRoles = championRoles as ChampionsPlayRate
    this.sortTeamByRole = sortTeamByRole
  }

  /**
   * Get champion specific data
   * @param id of the champion
   */
  public getChampion (id: number): Champion {
    const originalChampionData = this.champions.find(c => c.id === id)
    const icon = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/'
      + originalChampionData!.squarePortraitPath.split('/assets/')[1].toLowerCase()

    return {
      icon,
      id: originalChampionData!.id,
      name: originalChampionData!.name,
      alias: originalChampionData!.alias,
      roles: originalChampionData!.roles,
    }
  }

  /**
   *  Get global data about the match
   */
  public getGameInfos (match: MatchDto) {
    return {
      map: match.info.mapId,
      gamemode: match.info.queueId,
      date: match.info.gameCreation,
      region: match.info.platformId.toLowerCase(),
      season: getSeasonNumber(match.info.gameCreation),
      time: match.info.gameDuration,
    }
  }

  /**
   * Get player specific data during the match
   * @param match 
   * @param player 
   * @param detailed : detailed or not stats 
   * @param teamStats : if detailed, the teamStats argument is mandatory
   */
  public getPlayerData (match: MatchDto, player: ParticipantDto, detailed: boolean, teamStats?: TeamStats) {
    const name = player.summonerName
    const champion = this.getChampion(player.championId)
    const role = this.getRoleName(player.teamPosition, match.info.queueId)
    const level = player.champLevel

    // Regular stats / Full match stats
    const stats: Stats = {
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      minions: player.totalMinionsKilled + player.neutralMinionsKilled,
      vision: player.visionScore,
      gold: player.goldEarned,
      dmgChamp: player.totalDamageDealtToChampions,
      dmgObj: player.damageDealtToObjectives,
      dmgTaken: player.totalDamageTaken,
      kp: 0,
      kda: 0,
      realKda: 0,
    }

    if (stats.kills + stats.assists !== 0 && stats.deaths === 0) {
      stats.kda = '∞'
      stats.realKda = stats.kills + stats.assists
    } else {
      stats.kda = +(stats.deaths === 0 ? 0 : ((stats.kills + stats.assists) / stats.deaths)).toFixed(2)
      stats.realKda = stats.kda
    }

    // Percent stats / Per minute stats : only for detailed match
    let percentStats: PercentStats
    if (detailed) {
      teamStats = teamStats!
      percentStats = {
        minions: +(stats.minions / (match.info.gameDuration / 60)).toFixed(2),
        vision: +(stats.vision / (match.info.gameDuration / 60)).toFixed(2),
        gold: +(player.goldEarned * 100 / teamStats.gold).toFixed(1) + '%',
        dmgChamp: +(player.totalDamageDealtToChampions * 100 / teamStats.dmgChamp).toFixed(1) + '%',
        dmgObj: +(teamStats.dmgObj ? player.damageDealtToObjectives * 100 / teamStats.dmgObj : 0).toFixed(1) + '%',
        dmgTaken: +(player.totalDamageTaken * 100 / teamStats.dmgTaken).toFixed(1) + '%',
      }

      stats.kp = teamStats.kills === 0 ? '0%' : +((stats.kills + stats.assists) * 100 / teamStats.kills).toFixed(1) + '%'
    } else {
      const totalKills = match.info.participants.reduce((prev, current) => {
        if (current.teamId !== player.teamId) {
          return prev
        }
        return prev + current.kills
      }, 0)

      stats.criticalStrike = player.largestCriticalStrike
      stats.killingSpree = player.largestKillingSpree
      stats.doubleKills = player.doubleKills
      stats.tripleKills = player.tripleKills
      stats.quadraKills = player.quadraKills
      stats.pentaKills = player.pentaKills
      stats.heal = player.totalHeal
      stats.towers = player.turretKills
      stats.longestLiving = player.longestTimeSpentLiving
      stats.kp = totalKills === 0 ? 0 : +((stats.kills + stats.assists) * 100 / totalKills).toFixed(1)
    }

    let primaryRune: string | null = null
    let secondaryRune: string | null = null

    const primaryStyle = player.perks.styles.find(s => s.description === 'primaryStyle')
    const subStyle = player.perks.styles.find(s => s.description === 'subStyle')

    if (primaryStyle && subStyle && primaryStyle.selections.length) {
      ({ primaryRune, secondaryRune } = this.getPerksImages(primaryStyle.selections[0].perk, subStyle.style))
    }

    const items: (Item | null)[] = []
    for (let i = 0; i < 6; i++) {
      const id = player['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }

      const item = this.items.find(i => i.id === id)
      // TODO: get deleted item from old patch CDragon JSON instead of null
      if (!item) {
        items.push(null)
        continue
      }

      const itemUrl = item.iconPath.split('/assets/')[1].toLowerCase()
      items.push({
        image: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${itemUrl}`,
        name: item.name,
        description: item.description,
        price: item.priceTotal,
      })
    }

    const firstSum = player.summoner1Id
    const secondSum = player.summoner2Id

    const playerData: ParticipantDetails = {
      name,
      summonerId: player.summonerId,
      champion,
      role,
      primaryRune,
      secondaryRune,
      level,
      items,
      firstSum,
      secondSum,
      stats,
    }
    if (detailed) {
      playerData.percentStats = percentStats!
    }

    playerData.perks = this.getFullPerks(player.perks)

    return playerData
  }

  public getFullPerks (perksDto: PerksDto) {
    const perks: Perks = {
      primaryStyle: perksDto.styles.find(s => s.description === 'primaryStyle')!.style,
      secondaryStyle: perksDto.styles.find(s => s.description === 'subStyle')!.style,
      selected: [],
    }

    for (const styles of perksDto.styles) {
      for (const perk of styles.selections) {
        perks.selected.push(perk.perk)
      }
    }

    perks.selected.concat(Object.values(perksDto.statPerks))

    return perks
  }

  /**
   * Return the icons of the primary rune and secondary category
   * @param perk0 primary perks id
   * @param perkSubStyle secondary perks category
   */
  public getPerksImages (perk0: number, perkSubStyle: number) {
    const firstRune = this.perks.find(p => p.id === perk0)
    const firstRuneUrl = firstRune!.iconPath.split('/assets/')[1].toLowerCase()
    const primaryRune = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${firstRuneUrl}`

    const secondRuneStyle = this.perkstyles.find(p => p.id === perkSubStyle)

    const secondRuneStyleUrl = secondRuneStyle ? secondRuneStyle.iconPath.split('/assets/')[1].toLowerCase() : null
    const secondaryRune = secondRuneStyleUrl ?
      `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${secondRuneStyleUrl}`
      : ''

    return { primaryRune, secondaryRune }
  }

  /**
  * Return the lane of the summoner according to timeline
  * @param timeline from Riot Api
  * @param gamemode of the match to check if a role is needed
  */
  public getRoleName (teamPosition: string, gamemode: number) {
    if (!queuesWithRole.includes(gamemode) || !teamPosition) {
      return 'NONE'
    }

    if (teamPosition === 'UTILITY') {
      return 'SUPPORT'
    }

    return teamPosition
  }

  /**
   * Return the 5 roles of a team based on champions
   * @param team 5 champions + smite from a team
   */
  public getTeamRoles (team: PlayerRole[]) {
    const teamJunglers = team.filter(p => p.jungle && !p.support)
    const jungle = teamJunglers.length === 1 ? teamJunglers[0].champion : undefined
    const teamSupports = team.filter(p => p.support && !p.jungle)
    const support = teamSupports.length === 1 ? teamSupports[0].champion : undefined

    return RoleIdentificationService.getRoles(this.championRoles, team.map(p => p.champion), jungle, support)
  }

  /**
   * Update roles for a team if Riot's ones are badly identified
   * @param team 5 players data of the team
   * @param champs 5 champions + smite from the team
   * @param playerData data of the searched player, only for basic matches 
   */
  public updateTeamRoles (
    team: ParticipantBasic[] | ParticipantDetails[],
    champs: PlayerRole[],
    playerData?: ParticipantDetails
  ) {
    // const actualRoles = [...new Set(team.map(p => p.role))]
    // if (actualRoles.length === 5) {
    //   return
    // }

    const identifiedChamps = this.getTeamRoles(champs)
    for (const summoner of team) {
      summoner.role = Object.entries(identifiedChamps).find(([, champion]) => summoner.champion.id === champion)![0]

      if (playerData && summoner.champion.id === playerData.champion.id) {
        playerData.role = summoner.role
      }
    }
  }

  /**
   * 
   * @param match from Riot Api
   * @param allyTeam 5 players of the first team
   * @param enemyTeam 5 players of the second team
   * @param allyTeamId team id of the searched player, only for basic matches
   * @param playerData data of the searched player, only for basic matches
   */
  public getMatchRoles (
    match: MatchDto,
    allyTeam: ParticipantBasic[] | ParticipantDetails[],
    enemyTeam: ParticipantBasic[] | ParticipantDetails[],
    allyTeamId = 100,
    playerData?: ParticipantDetails
  ) {
    if (!this.championRoles || !queuesWithRole.includes(match.info.queueId)) {
      return
    }

    let allyChamps: PlayerRole[] = []
    let enemyChamps: PlayerRole[] = []
    match.info.participants.map(p => {
      const items = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5]
      const playerRole = {
        champion: p.championId,
        jungle: p.summoner1Id === 11 || p.summoner2Id === 11,
        support: supportItems.some(suppItem => items.includes(suppItem)),
      }
      p.teamId === allyTeamId ? allyChamps.push(playerRole) : enemyChamps.push(playerRole)
    })

    this.updateTeamRoles(allyTeam, allyChamps, playerData)
    this.updateTeamRoles(enemyTeam, enemyChamps)

    allyTeam.sort(this.sortTeamByRole)
    enemyTeam.sort(this.sortTeamByRole)
  }

  /**
   * Get Summoner Spell Data from CDragon
   * @param id of the summonerSpell
   */
  public getSummonerSpell (id: number): SummonerSpell | null {
    if (id === 0) {
      return null
    }
    const spell = this.summonerSpells.find(s => s.id === id)
    const spellName = spell!.iconPath.split('/assets/')[1].toLowerCase()
    return {
      name: spell!.name,
      description: spell!.description,
      icon: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${spellName}`,
    }
  }
}
