'use strict'

const MatchTransformer = use('App/Transformers/MatchTransformer')

/**
 * DetailedMatchTransformer class
 *
 * @class DetailedMatchTransformer
 */
class DetailedMatchTransformer extends MatchTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(match, { champions, runes, MatchHelper }) {
    this.match = match
    this.champions = champions
    this.runes = runes
    this.MatchHelper = MatchHelper

    // Global data
    const map = match.mapId
    const mode = match.queueId
    const gameCreation = match.gameCreation
    const time = this.MatchHelper.secToTime(match.gameDuration)

    // Teams
    const firstTeam = this.getTeamData(match.teams[0])
    const secondTeam = this.getTeamData(match.teams[1])

    return {
      gameId: match.gameId,
      map,
      gamemode: mode,
      date: gameCreation,
      season: match.seasonId,
      time,
      blueTeam: firstTeam.color === 'Blue' ? firstTeam : secondTeam,
      redTeam: firstTeam.color === 'Blue' ? secondTeam : firstTeam,
    }
  }

  /**
   * Get all data of one team
   * @param team raw team data from Riot API
   */
  getTeamData(team) {
    let win = team.win
    if (this.match.gameDuration < 300) {
      win = 'Remake'
    }

    // Global stats of the team
    const teamPlayers = this.match.participants.filter(p => p.teamId === team.teamId)
    const teamStats = teamPlayers.reduce((prev, cur) => {
      prev.kills += cur.stats.kills
      prev.deaths += cur.stats.deaths
      prev.assists += cur.stats.assists
      prev.gold += cur.stats.goldEarned
      prev.dmgChamp += cur.stats.totalDamageDealtToChampions
      prev.dmgObj += cur.stats.damageDealtToObjectives
      prev.dmgTaken += cur.stats.totalDamageTaken
      return prev;
    }, { kills: 0, deaths: 0, assists: 0, gold: 0, dmgChamp: 0, dmgObj: 0, dmgTaken: 0 });

    // Bans
    let bans = null
    if (team.bans) {
      bans = team.bans.map(b => {
        if (b.championId === -1) {
          b.champion = {
            id: null,
            name: null
          }
        } else {
          b.champion = (({ id, name }) => ({ id, name }))(Object.entries(this.champions).find(([, champion]) => Number(champion.key) === b.championId)[1])
        }
        return b
      })
    }


    // Players
    const players = teamPlayers
      .map(p => this.getPlayerData(p, teamStats))
      .sort(this.MatchHelper.sortTeamByRole)

    return {
      bans,
      barons: team.baronKills,
      color: team.teamId === 100 ? 'Blue' : 'Red',
      dragons: team.dragonKills,
      inhibitors: team.inhibitorKills,
      players,
      result: win,
      riftHerald: team.riftHeraldKills,
      teamStats,
      towers: team.towerKills,
    }
  }

  /**
   * Get all data for one player
   * @param player raw player data from Riot API
   * @param teamStats global stats of the team
   */
  getPlayerData(player, teamStats) {
    const identity = this.match.participantIdentities.find(p => p.participantId === player.participantId)
    const name = identity.player.summonerName
    const champion = (({ id, name }) => ({ id, name }))(Object.entries(this.champions).find(([, champion]) => Number(champion.key) === player.championId)[1])
    const role = this.MatchHelper.getRoleName(player.timeline)

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

    // Regular stats / Full match stats
    const stats = {
      minions: player.stats.totalMinionsKilled + player.stats.neutralMinionsKilled,
      vision: player.stats.visionScore,
      gold: +(player.stats.goldEarned / 1000).toFixed(1) + 'k',
      dmgChamp: +(player.stats.totalDamageDealtToChampions / 1000).toFixed(1) + 'k',
      dmgObj: +(player.stats.damageDealtToObjectives / 1000).toFixed(1) + 'k',
      dmgTaken: +(player.stats.totalDamageTaken / 1000).toFixed(1) + 'k',
    }

    // Percent stats / Per minute stats
    const percentStats = {
      minions: +(stats.minions / (this.match.gameDuration / 60)).toFixed(2),
      vision: +(stats.vision / (this.match.gameDuration / 60)).toFixed(2),
      dmgChamp: +(player.stats.totalDamageDealtToChampions * 100 / teamStats.dmgChamp).toFixed(1) + '%',
      dmgObj: +(player.stats.damageDealtToObjectives * 100 / teamStats.dmgObj).toFixed(1) + '%',
      dmgTaken: +(player.stats.totalDamageTaken * 100 / teamStats.dmgTaken).toFixed(1) + '%',
    }
    const kp = teamStats.kills === 0 ? '0%' : +((kills + assists) * 100 / teamStats.kills).toFixed(1) + '%'

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
      kills,
      deaths,
      assists,
      kda,
      level,
      kp,
      items,
      firstSum,
      secondSum,
      stats,
      percentStats,
    }
  }
}

module.exports = new DetailedMatchTransformer()
