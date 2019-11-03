import { timeDifference } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'
import store from '@/store'

const uniqueLeagues = ['CHALLENGER', 'GRANDMASTER', 'MASTER']
const leaguesNumbers = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }

/**
 * Return all the infos about a detailed match
 * @param  detailedMatch : all data about the match from the Riot API
 */
export function createDetailedMatchData(detailedMatch) {
  detailedMatch.blueTeam.players = detailedMatch.blueTeam.players.map(p => getPlayerData(p))
  detailedMatch.redTeam.players = detailedMatch.redTeam.players.map(p => getPlayerData(p))

  function getPlayerData(p) {
    // Items
    for (let i = 0; i < p.items.length; i++) {
      p.items[i] = getItemLink(p.items[i])
    }

    // Summoner Spells
    p.firstSum = getSummonerLink(p.firstSum)
    p.secondSum = getSummonerLink(p.secondSum)
    return p
  }

  return detailedMatch
}

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
 * Return the list of teammates of the summoner in a nice way
 * @param {Object} mates : mates list from the API
 */
export function createMatesData(mates) {
  return mates
    .map(mate => {
      mate.total = mate.wins + mate.losses
      mate.winrate = +(100 * mate.wins / mate.total).toFixed(1) + '%'
      return mate
    })
    .sort((a, b) => (a.total < b.total) ? 1 : -1)
}

/**
 * Return all the infos about a summoner built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 */
export function createSummonerData(RiotData) {
  // Ranked Stats
  RiotData.ranked.soloQ = getLeagueData(RiotData.ranked.soloQ, 'Solo/Duo')
  if (!RiotData.ranked.soloQ) delete RiotData.ranked.soloQ

  RiotData.ranked.flex5v5 = getLeagueData(RiotData.ranked.flex5v5, 'Flex 5vs5')
  if (!RiotData.ranked.flex5v5) delete RiotData.ranked.flex5v5

  RiotData.ranked.flex3v3 = getLeagueData(RiotData.ranked.flex3v3, 'Flex 3vs3')
  if (!RiotData.ranked.flex3v3) delete RiotData.ranked.flex3v3

  // If Summoner is Unranked
  if (Object.entries(RiotData.ranked).length === 0) {
    RiotData.ranked.soloQ = {
      fullRank: 'Unranked',
      rankImgLink: 'https://res.cloudinary.com/kln/image/upload/v1571671133/ranks/unranked.png',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
      winrate: '0%',
      name: 'Solo/Duo'
    }
  }

  return {
    account: RiotData.account,
    ranked: RiotData.ranked,
    matchList: RiotData.allMatches,
    matches: createMatchData(RiotData.matchesDetails),
    mates: createMatesData(RiotData.mates),
    playing: RiotData.playing
  }
}

function getItemLink(id) {
  if (id === 0) {
    return null
  }
  return `url('https://ddragon.leagueoflegends.com/cdn/${store.getters['ddragon/version']}/img/item/${id}.png')`
}

function getLeagueData(leagueData, leagueName) {
  if (!leagueData) return null

  leagueData.fullRank = uniqueLeagues.includes(leagueData.tier) ? leagueData.tier : `${leagueData.tier} ${leagueData.rank}`
  leagueData.rankImgLink = getRankImg(leagueData)
  leagueData.winrate = +(leagueData.wins * 100 / (leagueData.wins + leagueData.losses)).toFixed(1) + '%'
  leagueData.name = leagueName
  return leagueData
}

/**
 *  Return the link of the rank image
 * @param leagueData : stats in soloQ of the player
 */
export function getRankImg(leagueData) {
  return `https://res.cloudinary.com/kln/image/upload/v1571671133/ranks/${leagueData.tier}_${leaguesNumbers[leagueData.rank]}.png`
}

function getSummonerLink(id) {
  if(id === 0) return null
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${store.getters['ddragon/version']}/img/spell/${spellName}.png`
}
