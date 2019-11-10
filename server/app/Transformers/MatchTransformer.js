'use strict'

/**
 * MatchTransformer class
 *
 * @class MatchTransformer
 */
class MatchTransformer {
  /**
   *  Get global data about the match
   */
  getGameInfos() {
    const map = this.match.mapId
    const gamemode = this.match.queueId
    const date = this.match.gameCreation
    // const time = this.MatchHelper.secToTime(this.match.gameDuration)
    const time = this.match.gameDuration

    return {
      map,
      gamemode,
      date,
      time
    }
  }

  /**
   * Get player specific data during the match
   * @param player 
   * @param detailed : detailed or not stats 
   * @param teamStats : if detailed, the teamStats argument is mandatory
   */
  getPlayerData(player, detailed, teamStats = {}) {
    const identity = this.match.participantIdentities.find(p => p.participantId === player.participantId)
    const name = identity.player.summonerName
    const champion = (({ id, name, tags }) => ({ id, name, tags }))(Object.entries(this.champions).find(([, champion]) => Number(champion.key) === player.championId)[1])
    const role = this.MatchHelper.getRoleName(player.timeline)
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
        minions: +(stats.minions / (this.match.gameDuration / 60)).toFixed(2),
        vision: +(stats.vision / (this.match.gameDuration / 60)).toFixed(2),
        gold: +(player.stats.goldEarned * 100 / teamStats.gold).toFixed(1) + '%',
        dmgChamp: +(player.stats.totalDamageDealtToChampions * 100 / teamStats.dmgChamp).toFixed(1) + '%',
        dmgObj: +(player.stats.damageDealtToObjectives * 100 / teamStats.dmgObj).toFixed(1) + '%',
        dmgTaken: +(player.stats.totalDamageTaken * 100 / teamStats.dmgTaken).toFixed(1) + '%',
      }

      stats.kp = teamStats.kills === 0 ? '0%' : +((stats.kills + stats.assists) * 100 / teamStats.kills).toFixed(1) + '%'
    } else {
      const totalKills = this.match.participants.reduce((prev, current) => {
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
      const currentItem = 'item' + i
      items.push(player.stats[currentItem])
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
}

module.exports = MatchTransformer
