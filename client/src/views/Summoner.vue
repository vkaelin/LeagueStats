<template>
  <div>
    <button @click="resetLocalStorage" class="debug"></button>

    <header class="search mb-4 bg-teal-900 text-teal-100">
      <div class="container mx-auto flex justify-between py-8">
        <router-link
          to="/"
          class="flex items-center text-lg text-teal-100 mr-8 hover:text-teal-200"
        >Accueil</router-link>

        <SearchForm @formSubmit="redirect" />

        <button
          v-if="summonerFound"
          @click="apiCall"
          id="refresh"
          class="input btn w-20 rounded-lg ml-2 relative"
          :disabled="loading"
        >
          <v-icon name="sync" class="absolute vertical-center horizontal-center" />
        </button>
      </div>
    </header>

    <template v-if="summonerFound && !loading">
      <div class="container mx-auto pb-16">
        <div class="player bg-blue-100">
          <div
            class="player__pp"
            :style="{background: `url(https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/profileicon/${localInfos.profileIconId}.png) center/cover`}"
          ></div>
          <h1 class="player__name">{{ localInfos.name }}</h1>
          <h3 class="player__level">{{ localInfos.level }}</h3>
          <h3 class="player__rank">{{ localInfos.rank }}</h3>
          <div
            class="player__rank-img"
            :style="{background: `url(${localInfos.rankImgLink}) center/cover`}"
          ></div>
          <h3
            class="player__ratio"
          >{{ localInfos.rankedWins ? localInfos.rankedWins + ' wins / ' + localInfos.rankedLosses + ' losses' : "Joueur non classé" }}</h3>

          <RecentActivity v-show="localInfos.allMatches" :matches="localInfos.allMatches" />

          <ul class="list-matches--debug">
            <Match
              v-for="(match, index) in localInfos.matches"
              :key="index"
              :data="localInfos.matches[index]"
            />
          </ul>
        </div>
      </div>
    </template>
    <template v-else-if="loading">
      <div
        class="flex items-center justify-center bg-white max-w-xs mx-auto p-5 rounded-lg shadow-xl"
      >
        <dot-loader :loading="loading" />
      </div>
    </template>
    <template v-else>
      <p>Le joueur est introuvable.</p>
    </template>
  </div>
</template>

<script>
// import itemsJSON from '@/data/item.json'
import summonersJSON from '@/data/summoner.json'
import RecentActivity from '@/components/RecentActivity.vue'
import Match from '@/components/Match.vue'
import SearchForm from '@/components/SearchForm.vue'
import { maps, gameModes } from '@/data/data.js'
import { timeDifference, secToTime, getRankImg } from '@/helpers/functions.js'

export default {
  components: {
    Match,
    RecentActivity,
    SearchForm
  },

  data() {
    return {
      championsInfos: [],
      localInfos: {},
      summonerFound: false,
      loading: false,
      regionsList: {
        'br': 'br1',
        'eune': 'eun1',
        'euw': 'euw1',
        'jp': 'jp1',
        'kr': 'kr',
        'lan': 'la1',
        'las': 'la2',
        'na': 'na1',
        'oce': 'oc1',
        'tr': 'tr1',
        'ru': 'ru'
      }
    }
  },

  computed: {
    summoner() {
      return this.$route.params.name
    },
    region() {
      return this.$route.params.region
    }
  },

  watch: {
    $route() {
      console.log('route changed')
      this.checkLocalStorage()
    }
  },

  created: function () {
    this.getData()
  },
  mounted: function () {
    this.checkLocalStorage()
  },

  methods: {
    apiCall() {
      console.log(this.$patch)
      const summoner = this.summoner
      const region = this.regionsList[this.region]
      this.loading = true
      this.axios({
        method: 'POST',
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://api.valentinkaelin.ch/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          summoner,
          region
        }
      })
        .then(response => {
          return response.data
        })
        .then(jsonData => {
          if (jsonData) {
            this.summonerFound = true
            this.createObject(jsonData)
          } else {
            this.summonerFound = false
            this.loading = false
            console.log('Summoner not found')
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    checkLocalStorage() {
      if (localStorage[`${this.summoner}:${this.region}`]) {
        console.log('cached')
        this.summonerFound = true
        this.localInfos = JSON.parse(localStorage[`${this.summoner}:${this.region}`])
      } else {
        this.apiCall()
      }
    },
    createObject(JSONData) {
      console.time('frontend')
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
        //console.log(Object.entries(this.championsInfos))
        //console.log(this.championsInfos)
        const champion = Object.entries(this.championsInfos).find(([, champion]) => Number(champion.key) === currentMatch.participants[participantId - 1].championId)[0]
        //const champion = championsId[currentMatch.participants[participantId - 1].championId];
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
          items.push(this.getItemLink(currentMatch.participants[participantId - 1].stats[currentItem]))
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
          firstSum: this.getSummonerLink(firstSum),
          secondSum: this.getSummonerLink(secondSum)
        })
      } // end loop matches
      console.log('matches infos just below')
      console.log(matchesInfos)

      this.localInfos = {
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

      console.log('====== Saved infos ======')
      console.log(this.localInfos)

      localStorage[`${this.summoner}:${this.region}`] = JSON.stringify(this.localInfos)
      console.timeEnd('frontend')
      this.loading = false

    },
    getData() {
      console.log('API CALL FOR CHAMPIONS')
      this.axios({
        method: 'GET',
        url: `https://ddragon.leagueoflegends.com/cdn/${this.$patch}/data/en_US/champion.json`
      })
        .then(response => {
          return response.data
        })
        .then(jsonData => {
          console.log('here')
          this.championsInfos = jsonData.data
        })
    },
    getItemLink(id) {
      return `url('https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/item/${id === 0 ? 3637 : id}.png') no-repeat center center / contain`
    },
    getSummonerLink(id) {
      const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
      return `https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/spell/${spellName}.png`
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    resetLocalStorage() {
      console.log('CLEAR LOCALSTORAGE')
      localStorage.clear()
    }
  }
}
</script>

<style scoped>
.debug {
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  border: none;
  z-index: 9999999999;
}

.debug:hover {
  background: #ef5753;
}

.player {
  text-align: center;
  margin: 16px auto 0;
  border: 1px solid #ebebeb;
  padding: 16px;
  /* background: #fff; */
}

.player__pp {
  width: 75px;
  height: 75px;
  background: #ebebeb;
  margin: 0 auto;
}

.player__rank-img {
  width: 75px;
  height: 75px;
  background: #ebebeb;
  margin: 0 auto;
}

.list-matches {
  list-style-type: none;
  padding: 0;
}
</style>
