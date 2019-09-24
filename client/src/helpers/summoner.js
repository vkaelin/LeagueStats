import { timeDifference, secToTime, getRankImg } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'

/**
 * Return all the infos about a summoner built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 * @param {Object} championsInfos : champions data from the Riot API
 */
export function createSummonerData(RiotData, championsInfos, runesInfos) {
  console.log('--- ALL INFOS ---')
  console.log(RiotData)

  const userStats = RiotData.account
  const soloQStats = RiotData.soloQ
  const matches = RiotData.matchesDetails

  const soloQ = soloQStats ? {} : null
  if (soloQ) {
    soloQ.rank = `${soloQStats.tier} ${soloQStats.rank}`
    soloQ.rankImgLink = getRankImg(soloQStats)
    soloQ.wins = soloQStats.wins
    soloQ.losses = soloQStats.losses
    soloQ.winrate = +(soloQ.wins * 100 / (soloQ.wins + soloQ.losses)).toFixed(1) + '%'
    soloQ.lp = soloQStats.leaguePoints
  }

  const matchesInfos = []
  // Loop on all matches
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i]
    const participantId = currentMatch.participantIdentities.find((p) => p.player.currentAccountId === userStats.accountId).participantId
    const player = currentMatch.participants[participantId - 1]
    const teamId = player.teamId

    let win = currentMatch.teams.find((t) => t.teamId === teamId).win
    let status = win === 'Win' ? 'Victory' : 'Defeat'

    // Match less than 5min
    if (currentMatch.gameDuration < 300) {
      win = 'Remake'
      status = 'Remake'
    }

    const map = maps[currentMatch.mapId]
    let mode = gameModes[currentMatch.queueId]
    if (!mode)
      mode = 'Undefined gamemode'
    const champion = (({ id, name }) => ({ id, name }))(Object.entries(championsInfos).find(([, champion]) => Number(champion.key) === player.championId)[1])
    const role = getRoleName(player.timeline)

    const timeAgo = timeDifference(currentMatch.gameCreation)
    const time = secToTime(currentMatch.gameDuration)
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

    const primaryRuneCategory = runesInfos.find(r => r.id === player.stats.perkPrimaryStyle)
    let primaryRune
    for (const subCat of primaryRuneCategory.slots) {
      primaryRune = subCat.runes.find(r => r.id === player.stats.perk0)
      if (primaryRune) {
        break
      }
    }
    primaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${primaryRune.icon}`
    let secondaryRune = runesInfos.find(r => r.id === player.stats.perkSubStyle)
    secondaryRune = `https://ddragon.leagueoflegends.com/cdn/img/${secondaryRune.icon}`

    const totalKills = currentMatch.participants.reduce((prev, current) => {
      if (current.teamId !== teamId) {
        return prev
      }
      return prev + current.stats.kills
    }, 0)
    const kp = +((kills + assists) * 100 / totalKills).toFixed(1) + '%'

    const items = []
    for (let i = 0; i < 6; i++) {
      const currentItem = 'item' + i
      items.push(getItemLink(player.stats[currentItem]))
    }

    const gold = +(player.stats.goldEarned / 1000).toFixed(1) + 'k'
    const minions = player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled

    const firstSum = player.spell1Id
    const secondSum = player.spell2Id

    const allyTeam = []
    const enemyTeam = []
    for (let summoner of currentMatch.participantIdentities) {
      const allData = currentMatch.participants[summoner.participantId - 1]
      const playerInfos = {
        name: summoner.player.summonerName,
        role: getRoleName(allData.timeline),
        champion: (({ id, name }) => ({ id, name }))(Object.entries(championsInfos).find(([, champion]) => Number(champion.key) === allData.championId)[1])
      }

      if (allData.teamId === teamId) {
        allyTeam.push(playerInfos)
      } else {
        enemyTeam.push(playerInfos)
      }
    }
    allyTeam.sort(sortTeamByRole)
    enemyTeam.sort(sortTeamByRole)

    matchesInfos.push({
      result: win,
      status,
      map,
      gamemode: mode,
      champion,
      role,
      primaryRune,
      secondaryRune,
      date: timeAgo,
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
      firstSum: getSummonerLink(firstSum),
      secondSum: getSummonerLink(secondSum),
      allyTeam,
      enemyTeam
    })
  } // end loop matches
  console.log('matches infos just below')
  console.log(matchesInfos)

  return {
    accountId: userStats.accountId,
    allMatches: RiotData.allMatches,
    matches: matchesInfos,
    profileIconId: userStats.profileIconId,
    name: userStats.name,
    level: userStats.summonerLevel,
    soloQ,
  }
}

function getItemLink(id) {
  if (id === 0) {
    return null
  }
  return `url('https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/item/${id}.png')`
}

function getRoleName(timeline) {
  if (timeline.lane === 'BOTTOM' && timeline.role.includes('SUPPORT')) {
    return 'SUPPORT'
  }
  return timeline.lane
}

function getSummonerLink(id) {
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/spell/${spellName}.png`
}

function sortTeamByRole(a, b) {
  const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT']
  return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
}
