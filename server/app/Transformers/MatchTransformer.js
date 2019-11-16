'use strict'

const Jax = use('Jax')

/**
 * MatchTransformer class
 *
 * @class MatchTransformer
 */
class MatchTransformer {
  /**
   * Get global Context with DDragon Data
   */
  async getContext() {
    const items = await Jax.DDragon.Item.list()
    const champions = await Jax.DDragon.Champion.list()
    const runes = await Jax.DDragon.Rune.list()
    const version = Jax.DDragon.Version

    this.champions = champions.data
    this.items = items.data
    this.runes = runes
    this.version = version
  }

  /**
   *  Get global data about the match
   */
  getGameInfos(match) {
    return {
      map: match.mapId,
      gamemode: match.queueId,
      date: match.gameCreation,
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
    const champion = (({ id, name, tags }) => ({ id, name, tags }))(Object.entries(this.champions).find(([, champion]) => Number(champion.key) === player.championId)[1])
    const role = this.getRoleName(player.timeline)
    const level = player.stats.champLevel

    // Regular stats / Full match stats
    const stats = {
      kills: player.stats.kills,
      deaths: player.stats.deaths,
      assists: player.stats.assists,
      minions: player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled,
      vision: player.stats.visionScore,
      gold: +(player.stats.goldEarned / 1000).toFixed(1) + 'k',
      dmgChamp: +(player.stats.totalDamageDealtToChampions / 1000).toFixed(1) + 'k',
      dmgObj: +(player.stats.damageDealtToObjectives / 1000).toFixed(1) + 'k',
      dmgTaken: +(player.stats.totalDamageTaken / 1000).toFixed(1) + 'k',
    }

    if (stats.kills + stats.assists !== 0 && stats.deaths === 0) {
      stats.kda = '∞'
    } else {
      stats.kda = +(stats.deaths === 0 ? 0 : ((stats.kills + stats.assists) / stats.deaths)).toFixed(2)
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
      const primaryRuneCategory = this.runes.find(r => r.id === player.stats.perkPrimaryStyle)
      for (const subCat of primaryRuneCategory.slots) {
        primaryRune = subCat.runes.find(r => r.id === player.stats.perk0)
        if (primaryRune) {
          break
        }
      }
      primaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${primaryRune.icon}`
      secondaryRune = this.runes.find(r => r.id === player.stats.perkSubStyle)
      secondaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${secondaryRune.icon}`
    }

    const items = []
    for (let i = 0; i < 6; i++) {
      const id = player.stats['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }
      items.push({
        image: `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/item/${id}.png`,
        name: this.items[id].name,
        description: this.items[id].description,
        price: this.items[id].gold.total
      })
    }

    const firstSum = player.spell1Id
    const secondSum = player.spell2Id

    return {
      name,
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
  * Return the lane of the summoner according to timeline
  * @param timeline from Riot Api
  */
  getRoleName(timeline) {
    if (timeline.lane === 'BOTTOM' && timeline.role.includes('SUPPORT')) {
      return 'SUPPORT'
    }
    return timeline.lane
  }

  /**
  * Sort array of Roles according to a specific order
  * @param a first role
  * @param b second role
  */
  sortTeamByRole(a, b) {
    const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
    return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
  }
}

module.exports = MatchTransformer
