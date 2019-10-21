import { timeDifference, getRankImg } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'
import store from '@/store'

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
  const uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
  RiotData.ranked.soloQ = getLeagueData(uniqueLeagues, RiotData.ranked.soloQ)
  RiotData.ranked.soloQ ? RiotData.ranked.soloQ.name = 'Solo/Duo' : delete RiotData.ranked.soloQ

  RiotData.ranked.flex5v5 = getLeagueData(uniqueLeagues, RiotData.ranked.flex5v5)
  RiotData.ranked.flex5v5 ? RiotData.ranked.flex5v5.name = 'Flex 5vs5' : delete RiotData.ranked.flex5v5

  return {
    account: RiotData.account,
    ranked: RiotData.ranked,
    matchList: RiotData.allMatches,
    matches: createMatchData(RiotData.matchesDetails)
  }
}

function getItemLink(id) {
  if (id === 0) {
    return null
  }
  return `url('https://ddragon.leagueoflegends.com/cdn/${store.getters['ddragon/version']}/img/item/${id}.png')`
}

function getLeagueData(uniqueLeagues, leagueData) {
  if (!leagueData) return null

  leagueData.rank = uniqueLeagues.includes(leagueData.tier) ? leagueData.tier : `${leagueData.tier} ${leagueData.rank}`
  leagueData.rankImgLink = getRankImg(leagueData)
  leagueData.winrate = +(leagueData.wins * 100 / (leagueData.wins + leagueData.losses)).toFixed(1) + '%'
  return leagueData
}

function getSummonerLink(id) {
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${store.getters['ddragon/version']}/img/spell/${spellName}.png`
}
