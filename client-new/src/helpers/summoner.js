import { createCDragonAssetUrl, secToTime, timeDifference } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import store from '@/store'

/**
 * Get the url of the of the player primary rune
 * @param {Object} perks : from the API
 */
export function getPrimarRune(perks) {
  const primaryRune = perks.selected.length
    ? store.state.cdragon.runes.perks[perks.selected[0]]
    : null
  return primaryRune ? createCDragonAssetUrl(primaryRune.icon) : null
}

/**
 * Get the url of the of the player secondary rune
 * @param {Object} perks : from the API
 */
export function getSecondaryRune(perks) {
  const secondaryRune = store.state.cdragon.runes.perkstyles[perks.secondaryStyle]
  return secondaryRune ? createCDragonAssetUrl(secondaryRune.icon) : null
}

/**
 * Return all the infos about a list of matches built with the api data
 * @param {Object} matches : all data from the api matches endpoint
 */
export function createMatchData(matches) {
  for (const match of matches) {
    // Runes
    match.primaryRune = getPrimarRune(match.perks)
    match.secondaryRune = getSecondaryRune(match.perks)

    const date = new Date(match.date)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit' }
    match.fullDate = {
      date: date.toLocaleString(undefined, dateOptions),
      time: date.toLocaleString(undefined, timeOptions),
    }
    match.date = timeDifference(match.date)

    match.map = maps[match.map]
    match.gamemode = gameModes[match.gamemode]
    if (!match.gamemode) {
      match.gamemode = { name: 'Unknown gamemode' }
    }
  }

  return matches
}

/**
 * Return the formatted basic info for a summoner
 * @param {Object} summonerBasic : all data from the api basic endpoint
 */
export function createBasicSummonerData(summonerBasic) {
  // Ranked Stats
  summonerBasic.ranked.soloQ = getLeagueData(summonerBasic.ranked.soloQ, 'Solo/Duo')
  if (!summonerBasic.ranked.soloQ) delete summonerBasic.ranked.soloQ

  summonerBasic.ranked.flex5v5 = getLeagueData(summonerBasic.ranked.flex5v5, 'Flex 5vs5')
  if (!summonerBasic.ranked.flex5v5) delete summonerBasic.ranked.flex5v5

  summonerBasic.ranked.flex3v3 = getLeagueData(summonerBasic.ranked.flex3v3, 'Flex 3vs3')
  if (!summonerBasic.ranked.flex3v3) delete summonerBasic.ranked.flex3v3

  // If Summoner is Unranked
  if (Object.entries(summonerBasic.ranked).length === 0) {
    summonerBasic.ranked.soloQ = {
      fullRank: 'Unranked',
      rankImgLink: 'https://res.cloudinary.com/kln/image/upload/v1693310423/unranked.png',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
      winrate: '0%',
      name: 'Solo/Duo',
    }
  }

  return summonerBasic
}

/**
 * Return the formatted records of a summoner
 * @param {Object} recordsDto : raw records from the database stats
 */
export function createRecordsData(recordsDto) {
  const records = recordsDto.reduce((acc, record) => {
    acc[record.what] = record
    return acc
  }, {})

  records.game_duration.amount = secToTime(records.game_duration.amount)
  records.gold.amount = records.gold.amount.toLocaleString()
  records.damage_taken.amount = records.damage_taken.amount.toLocaleString()
  records.damage_dealt_champions.amount = records.damage_dealt_champions.amount.toLocaleString()
  records.damage_dealt_objectives.amount = records.damage_dealt_objectives.amount.toLocaleString()
  records.kp.amount = `${records.kp.amount}%`
  records.time_spent_living.amount = secToTime(records.time_spent_living.amount)
  records.heal.amount = records.heal.amount.toLocaleString()

  return records
}

/**
 * Add rank img and ranked data
 * @param {Object} leagueData
 * @param {String} leagueName
 */
function getLeagueData(leagueData, leagueName) {
  if (!leagueData) return null

  leagueData.rankImgLink = `https://res.cloudinary.com/kln/image/upload/v1693310423/${leagueData.tier}.png`
  leagueData.name = leagueName
  return leagueData
}
