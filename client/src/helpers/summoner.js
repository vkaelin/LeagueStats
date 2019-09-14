import { timeDifference, secToTime, getRankImg } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'

/**
 * Return all the infos about a summoner built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 * @param {Object} championsInfos : champions data from the Riot API
 */
export function createSummonerData(RiotData, championsInfos) {
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
    soloQ.winrate =  (soloQ.wins * 100 / (soloQ.wins + soloQ.losses)).toFixed(1) + '%'
    soloQ.lp =  soloQStats.leaguePoints
  }

  const matchesInfos = []
  // Loop on all matches
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i]
    const participantId = currentMatch.participantIdentities.find((p) => p.player.currentAccountId === userStats.accountId).participantId

    const teamId = currentMatch.participants[participantId - 1].teamId
    const win = currentMatch.teams.find((t) => t.teamId === teamId).win === 'Win'

    const map = maps[currentMatch.mapId]
    let mode = gameModes[currentMatch.queueId]
    if (!mode)
      mode = 'Undefined gamemode'
    const champion = Object.entries(championsInfos).find(([, champion]) => Number(champion.key) === currentMatch.participants[participantId - 1].championId)[0]
    const role = currentMatch.participants[participantId - 1].timeline.lane
    const timeAgo = timeDifference(currentMatch.gameCreation)
    const time = secToTime(currentMatch.gameDuration)
    const kills = currentMatch.participants[participantId - 1].stats.kills
    const deaths = currentMatch.participants[participantId - 1].stats.deaths
    const assists = currentMatch.participants[participantId - 1].stats.assists
    const level = currentMatch.participants[participantId - 1].stats.champLevel

    const items = []
    for (let i = 0; i < 6; i++) {
      const currentItem = 'item' + i
      items.push(getItemLink(currentMatch.participants[participantId - 1].stats[currentItem]))
    }

    const gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k'
    const minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled

    const firstSum = currentMatch.participants[participantId - 1].spell1Id
    const secondSum = currentMatch.participants[participantId - 1].spell2Id

    matchesInfos.push({
      result: win,
      map: map,
      gamemode: mode,
      champ: champion,
      role: role,
      date: timeAgo,
      time: time,
      kills: kills,
      deaths: deaths,
      assists: assists,
      level: level,
      items: items,
      gold: gold,
      minions: minions,
      firstSum: getSummonerLink(firstSum),
      secondSum: getSummonerLink(secondSum)
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
  return `url('https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/item/${id === 0 ? 3637 : id}.png') no-repeat center center / contain`
}

function getSummonerLink(id) {
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/spell/${spellName}.png`
}
