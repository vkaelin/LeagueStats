import { secToTime, timeDifference } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonerSpells from '@/data/summonerSpells.json'

const leaguesNumbers = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }

/**
 * Return all the infos about a list of matches built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 */
export function createMatchData(matches) {
  for (const match of matches) {
    match.firstSum = getSummonerLink(match.firstSum)
    match.secondSum = getSummonerLink(match.secondSum)

    const date = new Date(match.date)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit' }
    match.fullDate = { date: date.toLocaleString(undefined, dateOptions), time: date.toLocaleString(undefined, timeOptions) }
    match.date = timeDifference(match.date)

    match.map = maps[match.map]
    match.gamemode = gameModes[match.gamemode]
    if (!match.gamemode) {
      match.gamemode = { name: 'Unknown gamemode' }
    }
  } // end loop matches

  return matches
}

/**
 * Return the basic infos about a summoner built with the Riot API data
 * @param {Object} RiotData : all data from the Riot API
 */
export function createBasicSummonerData(RiotData) {
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

  return RiotData
}

/**
 * Return the formatted records of a summoner
 * @param {Object} records : raw records from the database stats
 */
export function createRecordsData(records) {
  records.maxTime.time = secToTime(records.maxTime.time)
  records.maxGold.gold = records.maxGold.gold.toLocaleString()
  records.maxDmgTaken.dmgTaken = records.maxDmgTaken.dmgTaken.toLocaleString()
  records.maxDmgChamp.dmgChamp = records.maxDmgChamp.dmgChamp.toLocaleString()
  records.maxDmgObj.dmgObj = records.maxDmgObj.dmgObj.toLocaleString()
  records.maxKp.kp = `${records.maxKp.kp}%`

  // New record fields
  if (records.maxLiving) {
    records.maxLiving.longestLiving = secToTime(records.maxLiving.longestLiving)
    records.maxHeal.heal = records.maxHeal.heal.toLocaleString()
  }

  return records
}

function getLeagueData(leagueData, leagueName) {
  if (!leagueData) return null

  leagueData.rankImgLink = getRankImg(leagueData)
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

export function getSummonerLink(id) {
  if (id === 0) return null
  const spellName = summonerSpells.find(s => s.id === id).iconPath.split('/assets/')[1].toLowerCase()
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${spellName}`
}
