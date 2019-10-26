'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * MatchTransformer class
 *
 * @class MatchTransformer
 * @constructor
 */
class MatchTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(match, { account, champions, runes, MatchHelper }) {
    const participantId = match.participantIdentities.find((p) => p.player.currentAccountId === account.accountId).participantId
    const player = match.participants[participantId - 1]
    const teamId = player.teamId

    let win = match.teams.find((t) => t.teamId === teamId).win
    let status = win === 'Win' ? 'Victory' : 'Defeat'

    // Match less than 5min
    if (match.gameDuration < 300) {
      win = 'Remake'
      status = 'Remake'
    }

    const map = match.mapId
    const mode = match.queueId

    const champion = (({ id, name }) => ({ id, name }))(Object.entries(champions).find(([, champion]) => Number(champion.key) === player.championId)[1])
    const role = MatchHelper.getRoleName(player.timeline)

    const gameCreation = match.gameCreation
    const time = MatchHelper.secToTime(match.gameDuration)

    const kills = player.stats.kills
    const deaths = player.stats.deaths
    const assists = player.stats.assists
    let kda
    if (kills + assists !== 0 && deaths === 0) {
      kda = '∞'
    } else {
      kda = +(deaths === 0 ? 0 : ((kills + assists) / deaths)).toFixed(2)
    }
    const level = player.stats.champLevel
    const damage = +(player.stats.totalDamageDealtToChampions / 1000).toFixed(1) + 'k'

    const totalKills = match.participants.reduce((prev, current) => {
      if (current.teamId !== teamId) {
        return prev
      }
      return prev + current.stats.kills
    }, 0)

    const kp = totalKills === 0 ? '0%' : +((kills + assists) * 100 / totalKills).toFixed(1) + '%'

    let primaryRune = null
    let secondaryRune = null
    if (player.stats.perkPrimaryStyle) {
      const primaryRuneCategory = runes.find(r => r.id === player.stats.perkPrimaryStyle)
      for (const subCat of primaryRuneCategory.slots) {
        primaryRune = subCat.runes.find(r => r.id === player.stats.perk0)
        if (primaryRune) {
          break
        }
      }
      primaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${primaryRune.icon}`
      secondaryRune = runes.find(r => r.id === player.stats.perkSubStyle)
      secondaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${secondaryRune.icon}`
    }

    const items = []
    for (let i = 0; i < 6; i++) {
      const currentItem = 'item' + i
      items.push(player.stats[currentItem])
    }

    const gold = +(player.stats.goldEarned / 1000).toFixed(1) + 'k'
    const minions = player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled

    const firstSum = player.spell1Id
    const secondSum = player.spell2Id

    const allyTeam = []
    const enemyTeam = []
    for (let summoner of match.participantIdentities) {
      const allData = match.participants[summoner.participantId - 1]
      const playerInfos = {
        name: summoner.player.summonerName,
        role: MatchHelper.getRoleName(allData.timeline),
        champion: (({ id, name }) => ({ id, name }))(Object.entries(champions).find(([, champion]) => Number(champion.key) === allData.championId)[1])
      }

      if (allData.teamId === teamId) {
        allyTeam.push(playerInfos)
      } else {
        enemyTeam.push(playerInfos)
      }
    }
    allyTeam.sort(MatchHelper.sortTeamByRole)
    enemyTeam.sort(MatchHelper.sortTeamByRole)

    return {
      summoner_puuid: account.puuid,
      gameId: match.gameId,
      result: win,
      status,
      map,
      gamemode: mode,
      champion,
      role,
      primaryRune,
      secondaryRune,
      date: gameCreation,
      time,
      kills,
      deaths,
      assists,
      kda,
      level,
      damage,
      kp,
      items,
      gold,
      minions,
      firstSum,
      secondSum,
      allyTeam,
      enemyTeam
    }
  }
}

module.exports = MatchTransformer
