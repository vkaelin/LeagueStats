'use strict'

const Jax = use('App/Services/Jax')
const RoleIdentificationService = use('App/Services/RoleIdentificationService')
const { queuesWithRole, sortTeamByRole } = use('App/helpers')

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
    const championRoles = await RoleIdentificationService.pullData().catch(() => {})

    this.champions = champions
    this.items = items
    this.perks = perks
    this.perkstyles = perkstyles.styles
    this.summonerSpells = summonerSpells
    this.championRoles = championRoles
    this.sortTeamByRole = sortTeamByRole

    // League of Legends seasons timestamps
    this.seasons = {
      0: 9,
      1578628800000: 10
    }
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
    // Get season number
    const arrSeasons = Object.keys(this.seasons)
    arrSeasons.push(match.gameCreation)
    arrSeasons.sort()
    const indexSeason = arrSeasons.indexOf(match.gameCreation) - 1
    const season = this.seasons[arrSeasons[indexSeason]]

    return {
      map: match.mapId,
      gamemode: match.queueId,
      date: match.gameCreation,
      region: match.platformId.toLowerCase(),
      season,
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
      accountId: identity.player.currentAccountId,
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
    if(!queuesWithRole.includes(gamemode)) {
      return 'NONE'
    }

    if (timeline.lane === 'BOTTOM' && timeline.role.includes('SUPPORT')) {
      return 'SUPPORT'
    }

    return timeline.lane
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
