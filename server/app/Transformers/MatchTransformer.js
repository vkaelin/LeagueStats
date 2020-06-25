'use strict'

const Jax = use('App/Services/Jax')
const RoleIdentificationService = use('App/Services/RoleIdentificationService')
const { getSeasonNumber, queuesWithRole, sortTeamByRole, supportItems } = use('App/helpers')

/**
 * MatchTransformer class
 *
 * @class MatchTransformer
 */
class MatchTransformer {
  /**
   * Get global Context with CDragon Data
   */
  async getContext() {
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
    this.championRoles = championRoles
    this.sortTeamByRole = sortTeamByRole
  }

  /**
   * Get champion specific data
   * @param id of the champion
   */
  getChampion(id) {
    const champion = { ...this.champions.find(c => c.id === id) }
    champion.icon = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${champion.squarePortraitPath.split('/assets/')[1].toLowerCase()}`
    delete champion.squarePortraitPath
    return champion
  }

  /**
   *  Get global data about the match
   */
  getGameInfos(match) {
    return {
      map: match.mapId,
      gamemode: match.queueId,
      date: match.gameCreation,
      region: match.platformId.toLowerCase(),
      season: getSeasonNumber(match.gameCreation),
      time: match.gameDuration
    }
  }

  /**
   * Get player specific data during the match
   * @param match 
   * @param player 
   * @param detailed : detailed or not stats 
   * @param teamStats : if detailed, the teamStats argument is mandatory
   */
  getPlayerData(match, player, detailed, teamStats = {}) {
    const identity = match.participantIdentities.find(p => p.participantId === player.participantId)
    const name = identity.player.summonerName
    const champion = this.getChampion(player.championId)
    const role = this.getRoleName(player.timeline, match.queueId)
    const level = player.stats.champLevel

    // Regular stats / Full match stats
    const stats = {
      kills: player.stats.kills,
      deaths: player.stats.deaths,
      assists: player.stats.assists,
      minions: player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled,
      vision: player.stats.visionScore,
      gold: player.stats.goldEarned,
      dmgChamp: player.stats.totalDamageDealtToChampions,
      dmgObj: player.stats.damageDealtToObjectives,
      dmgTaken: player.stats.totalDamageTaken,
    }

    if (stats.kills + stats.assists !== 0 && stats.deaths === 0) {
      stats.kda = '∞'
      stats.realKda = stats.kills + stats.assists
    } else {
      stats.kda = +(stats.deaths === 0 ? 0 : ((stats.kills + stats.assists) / stats.deaths)).toFixed(2)
      stats.realKda = stats.kda
    }

    // Percent stats / Per minute stats : only for detailed match
    let percentStats
    if (detailed) {
      percentStats = {
        minions: +(stats.minions / (match.gameDuration / 60)).toFixed(2),
        vision: +(stats.vision / (match.gameDuration / 60)).toFixed(2),
        gold: +(player.stats.goldEarned * 100 / teamStats.gold).toFixed(1) + '%',
        dmgChamp: +(player.stats.totalDamageDealtToChampions * 100 / teamStats.dmgChamp).toFixed(1) + '%',
        dmgObj: +(player.stats.damageDealtToObjectives * 100 / teamStats.dmgObj).toFixed(1) + '%',
        dmgTaken: +(player.stats.totalDamageTaken * 100 / teamStats.dmgTaken).toFixed(1) + '%',
      }

      stats.kp = teamStats.kills === 0 ? '0%' : +((stats.kills + stats.assists) * 100 / teamStats.kills).toFixed(1) + '%'
    } else {
      const totalKills = match.participants.reduce((prev, current) => {
        if (current.teamId !== player.teamId) {
          return prev
        }
        return prev + current.stats.kills
      }, 0)

      stats.kp = totalKills === 0 ? 0 : +((stats.kills + stats.assists) * 100 / totalKills).toFixed(1)
    }

    let primaryRune = null
    let secondaryRune = null
    if (player.stats.perkPrimaryStyle) {
      ({ primaryRune, secondaryRune } = this.getPerksImages(player.stats.perk0, player.stats.perkSubStyle))
    }

    const items = []
    for (let i = 0; i < 6; i++) {
      const id = player.stats['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }

      const item = this.items.find(i => i.id === id)
      const itemUrl = item.iconPath.split('/assets/')[1].toLowerCase()

      items.push({
        image: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${itemUrl}`,
        name: item.name,
        description: item.description,
        price: item.priceTotal
      })
    }

    const firstSum = player.spell1Id
    const secondSum = player.spell2Id

    return {
      name,
      summonerId: identity.player.summonerId,
      champion,
      role,
      primaryRune,
      secondaryRune,
      level,
      items,
      firstSum,
      secondSum,
      stats,
      percentStats,
    }
  }

  /**
   * Return the icons of the primary rune and secondary category
   * @param perk0 primary perks id
   * @param perkSubStyle secondary perks category
   */
  getPerksImages(perk0, perkSubStyle) {
    const firstRune = this.perks.find(p => p.id === perk0)
    const firstRuneUrl = firstRune.iconPath.split('/assets/')[1].toLowerCase()
    const primaryRune = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${firstRuneUrl}`

    const secondRuneStyle = this.perkstyles.find(p => p.id === perkSubStyle)

    const secondRuneStyleUrl = secondRuneStyle ? secondRuneStyle.iconPath.split('/assets/')[1].toLowerCase() : null
    const secondaryRune = secondRuneStyleUrl ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${secondRuneStyleUrl}` : ''

    return { primaryRune, secondaryRune }
  }

  /**
  * Return the lane of the summoner according to timeline
  * @param timeline from Riot Api
  * @param gamemode of the match to check if a role is needed
  */
  getRoleName(timeline, gamemode) {
    if (!queuesWithRole.includes(gamemode)) {
      return 'NONE'
    }

    if (timeline.lane === 'BOTTOM' && timeline.role.includes('SUPPORT')) {
      return 'SUPPORT'
    }

    return timeline.lane
  }

  /**
   * Return the 5 roles of a team based on champions
   * @param team 5 champions + smite from a team
   */
  getTeamRoles(team) {
    const teamJunglers = team.filter(p => p.jungle && !p.support)
    const jungle = teamJunglers.length === 1 ? teamJunglers[0].champion : null
    const teamSupports = team.filter(p => p.support && !p.jungle)
    const support = teamSupports.length === 1 ? teamSupports[0].champion : null

    return RoleIdentificationService.getRoles(this.championRoles, team.map(p => p.champion), jungle, support)
  }

  /**
   * Update roles for a team if Riot's ones are badly identified
   * @param {Object} team 5 players data of the team
   * @param {Array} champs 5 champions + smite from the team
   * @param {Object} playerData data of the searched player, only for basic matches 
   */
  updateTeamRoles(team, champs, playerData = null) {
    // const actualRoles = [...new Set(team.map(p => p.role))]
    // if (actualRoles.length === 5) {
    //   return
    // }

    champs = this.getTeamRoles(champs)
    for (const summoner of team) {
      summoner.role = Object.entries(champs).find(([, champion]) => summoner.champion.id === champion)[0]

      if (playerData && summoner.champion.id === playerData.champion.id) {
        playerData.role = summoner.role
      }
    }
  }

  /**
   * 
   * @param {Object} match from Riot Api
   * @param {Array} allyTeam 5 players of the first team
   * @param {Array} enemyTeam 5 players of the second team
   * @param {Number} allyTeamId team id of the searched player, only for basic matches
   * @param {Object} playerData data of the searched player, only for basic matches
   */
  getMatchRoles(match, allyTeam, enemyTeam, allyTeamId = 100, playerData = null) {
    if (!this.championRoles || !queuesWithRole.includes(match.queueId)) {
      return
    }

    let allyChamps = []
    let enemyChamps = []
    match.participants.map(p => {
      const items = [p.stats.item0, p.stats.item1, p.stats.item2, p.stats.item3, p.stats.item4, p.stats.item5]
      const playerRole = {
        champion: p.championId,
        jungle: p.spell1Id === 11 || p.spell2Id === 11,
        support: supportItems.some(suppItem => items.includes(suppItem))
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
  getSummonerSpell(id) {
    if (id === 0) return null
    const spell = this.summonerSpells.find(s => s.id === id)
    const spellName = spell.iconPath.split('/assets/')[1].toLowerCase()
    return {
      name: spell.name,
      description: spell.description,
      icon: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${spellName}`
    }
  }
}

module.exports = MatchTransformer
