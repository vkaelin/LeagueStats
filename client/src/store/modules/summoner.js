import { axios } from '@/plugins/axios'
import { timeDifference, secToTime, getRankImg } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'
import summonersJSON from '@/data/summoner.json'

export const namespaced = true

export const state = {
  infos: [],
  loading: false,
  summonerFound: false
}

export const mutations = {
  SUMMONER_REQUEST(state) {
    state.loading = true
  },
  SUMMONER_FOUND(state, infos) {
    state.summonerFound = true
    state.loading = false
    state.infos = infos
  },
  SUMMONER_NOT_FOUND(state) {
    state.summonerFound = false
    state.loading = false
  }
}

export const actions = {
  async summonerRequest({ commit, dispatch, rootState }, { summoner, region }) {
    console.log(summoner, region)
    commit('SUMMONER_REQUEST')
    try {
      const resp = await axios(({ url: 'api', data: { summoner, region }, method: 'POST' }))
      await dispatch('ddragon/getChampions', {}, { root: true })
      if (resp.data) {
        const infos = createObject(resp.data, rootState.ddragon.champions)
        commit('SUMMONER_FOUND', infos)
      } else {
        commit('SUMMONER_NOT_FOUND')

        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
        console.log('Summoner not found - store')
      }
    } catch (error) {
      commit('SUMMONER_NOT_FOUND')
      console.log(error)
    }
  }
}

function createObject(JSONData, championsInfos) {
  console.log('--- ALL INFOS ---')
  console.log(JSONData)

  const userStats = JSONData.account
  const soloQStats = JSONData.soloQ
  const matches = JSONData.matchesDetails

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
    allMatches: JSONData.allMatches,
    matches: matchesInfos,
    profileIconId: userStats.profileIconId,
    name: userStats.name,
    level: userStats.summonerLevel,
    rank: soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : 'Joueur non classé',
    rankImgLink: getRankImg(soloQStats),
    rankedWins: soloQStats ? soloQStats.wins : undefined,
    rankedLosses: soloQStats ? soloQStats.losses : undefined
  }
}

function getItemLink(id) {
  return `url('https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/item/${id === 0 ? 3637 : id}.png') no-repeat center center / contain`
}

function getSummonerLink(id) {
  const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
  return `https://ddragon.leagueoflegends.com/cdn/${process.env.VUE_APP_PATCH}/img/spell/${spellName}.png`
}
