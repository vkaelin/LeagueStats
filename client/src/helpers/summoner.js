import { timeDifference, getRankImg } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'

/**
 * Return all the infos about a list of matches built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 */
export function createMatchData(matches) {
  for (const match of matches) {
    for (let i = 0; i < match.items.length; i++) {
      match.items[i] = getItemLink(match.items[i])
    }

    match.firstSum = getSummonerLink(match.firstSum)
    match.secondSum = getSummonerLink(match.secondSum)

    match.date = timeDifference(match.date)

    match.map = maps[match.map]
    match.gamemode = gameModes[match.gamemode]
    if (!match.gamemode) match.gamemode = 'Undefined gamemode'
  } // end loop matches

  return matches
}

/**
 * Return all the infos about a summoner built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 */
export function createSummonerData(RiotData) {
  console.log('--- ALL INFOS ---')
  console.log(RiotData)

  // Ranked Stats
  const soloQStats = RiotData.soloQ
  const soloQ = soloQStats ? {} : null
  if (soloQ) {
    soloQ.rank = `${soloQStats.tier} ${soloQStats.rank}`
    soloQ.rankImgLink = getRankImg(soloQStats)
    soloQ.wins = soloQStats.wins
    soloQ.losses = soloQStats.losses
    soloQ.winrate = +(soloQ.wins * 100 / (soloQ.wins + soloQ.losses)).toFixed(1) + '%'
    soloQ.lp = soloQStats.leaguePoints
  }

  return {
    account: RiotData.account,
    soloQ,
    matchList: RiotData.allMatches,
    matches: createMatchData(RiotData.matchesDetails)
  }
}

function getItemLink(id) {
  if (id === 0) {
    return null
  }
  return `url('https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/item/${id}.png')`
}

function getSummonerLink(id) {
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/spell/${spellName}.png`
}
