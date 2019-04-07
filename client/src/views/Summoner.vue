<template>
  <div>
    <button class="debug" @click="resetLocalStorage"></button>

    <div class="search mb-4">
      <div class="container mx-auto">
        <form @submit.prevent="redirect" class="flex items-center">
          <input type="text" placeholder="Entre un pseudo" class="bg-gray-300 p-2 rounded-l outline-none focus:bg-gray-400" v-model="search">
          <button 
            class="bg-teal-500 p-2 text-white rounded-r hover:bg-teal-400" 
            type="submit" 
            :disabled="loading"
          >
            Rechercher
          </button>
          
          <button
            v-if="summonerFound"
            id="refresh" 
            class="block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-2"
            :disabled="loading"
            @click="apiCall"
          >
            <v-icon name="sync"/>
          </button>
        </form>
      </div>
    </div>
   
    <template v-if="summonerFound && !loading">
      <div class="container mx-auto pb-16">
        <div class="player bg-blue-100">
          <div class="player__pp" :style="{background: `url(https://cdn.valentinkaelin.ch/riot/profileicon/${localInfos.profileIconId}.png) center/cover`}"></div>
          <h1 class="player__name">{{ localInfos.name }}</h1>
          <h3 class="player__level">{{ localInfos.level }}</h3>
          <h3 class="player__rank">{{ localInfos.rank }}</h3>
          <div class="player__rank-img" :style="{background: `url(${localInfos.rankImgLink}) center/cover`}"></div>
          <h3 class="player__ratio">{{ localInfos.rankedWins ? localInfos.rankedWins + ' wins / ' + localInfos.rankedLosses + ' losses' : "Joueur non classé" }}</h3>

          <ul class="list-matches--debug">
            <Match
              v-for="(match, index) in localInfos.matches" :key="index"
              :data="localInfos.matches[index]"
            />
          </ul>

        </div>
      </div>
    </template>
    <template v-else-if="loading">
      <div class="flex items-center justify-center bg-white max-w-xs mx-auto p-5 rounded-lg shadow-xl">
        <dot-loader :loading="loading"></dot-loader>   
      </div>
    </template>
    <template v-else>
      <p>Le joueur est introuvable.</p>
    </template>

  </div>
</template>

<script>
import itemsJSON from '@/data/item.json'
import summonersJSON from '@/data/summoner.json'
import Match from '@/components/Match.vue';
import { championsId, maps, gameModes } from "@/data/data.js";
import { timeDifference, secToTime, getRankImg } from "@/helpers/functions.js";

export default {
  components: {
    Match
  },
  data() {
    return {
      localInfos: {},
      search: '',
      summonerFound: true,
      loading: false
    };
  },
  computed: {
    summoner() {
      return this.$route.params.name
    }
  },
  methods: {
    apiCall() {
      const summoner = this.summoner;
      this.loading = true;
      this.axios({
        method: "POST",
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://leaguestats.valentinkaelin.ch/api',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          summoner
        }
      })
        .then(response => {
          this.loading = false;
          return response.data;
        })
        .then(jsonData => {
          if(jsonData) {
            this.summonerFound = true
            this.createObject(jsonData)
          } else {
            this.summonerFound = false
            console.log('Summoner not found')
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    checkLocalStorage() {
      if (localStorage[this.summoner]) {
        console.log('cached')
        this.summonerFound = true
        this.localInfos = JSON.parse(localStorage[this.summoner])
      } else {
        this.apiCall()
      }
    },
    createObject(JSONData) {
      console.log('--- ALL INFOS ---')
      console.log(JSONData);

      const userStats = JSONData[0];
      const rankedStats = JSONData[1];
      const soloQStats = rankedStats !== null ? (rankedStats.queueType == 'RANKED_SOLO_5x5' ? rankedStats : JSONData[2]) : false;
      const matches = JSONData[3].matches;

      const matchesInfos = [];
      // Loop on all matches
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const participantId = currentMatch.participantIdentities.find((p) => p.player.accountId === userStats.accountId).participantId

        const teamId = currentMatch.participants[participantId - 1].teamId;
        const win = currentMatch.teams.find((t) => t.teamId === teamId).win === 'Win'

        const map = maps[currentMatch.mapId];
        let mode = gameModes[currentMatch.queueId];
        if (!mode)
          mode = 'Undefined gamemode';
        const champion = championsId[currentMatch.participants[participantId - 1].championId];
        const role = currentMatch.participants[participantId - 1].timeline.lane;
        const timeAgo = timeDifference(currentMatch.gameCreation);
        const time = secToTime(currentMatch.gameDuration);
        const kills = currentMatch.participants[participantId - 1].stats.kills;
        const deaths = currentMatch.participants[participantId - 1].stats.deaths;
        const assists = currentMatch.participants[participantId - 1].stats.assists;
        const level = currentMatch.participants[participantId - 1].stats.champLevel;

        const items = [];
        for (let i = 0; i < 6; i++) {
          const currentItem = 'item' + i;
          items.push(this.getItemLink(currentMatch.participants[participantId - 1].stats[currentItem]));
        }

        const gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k';
        const minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled;

        const firstSum = currentMatch.participants[participantId - 1].spell1Id;
        const secondSum = currentMatch.participants[participantId - 1].spell2Id;

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
        });
      } // end loop matches
      console.log(matchesInfos);

      this.localInfos =  {
        accountId: userStats.accountId,
        matches: matchesInfos,
        profileIconId: userStats.profileIconId,
        name: userStats.name,
        level: userStats.summonerLevel,
        rank: soloQStats ? soloQStats.tier + ' ' + soloQStats.rank : 'Joueur non classé',
        rankImgLink: getRankImg(soloQStats),
        rankedWins: soloQStats ? soloQStats.wins : undefined,
        rankedLosses: soloQStats ? soloQStats.losses : undefined
      }

      //this.summoner = userStats.name;

      console.log('====== Saved infos ======');
      console.log(this.localInfos);

      localStorage[this.summoner] = JSON.stringify(this.localInfos);
    },
    getItemLink(id) {
      if(id === 0) { 
        return "url('https://cdn.valentinkaelin.ch/riot/items/0.png') 0% 0% / cover";
      }
      const itemImage = itemsJSON.data[id].image;
      return `url('https://cdn.valentinkaelin.ch/riot/${itemImage.sprite}') -${itemImage.x}px -${itemImage.y}px`;
    },
    getSummonerLink(id) {
      const spellName = Object.entries(summonersJSON.data).find(([, spell]) => Number(spell.key) === id)[0]
      return `https://cdn.valentinkaelin.ch/riot/spells/${spellName}.png`;
    },
    redirect() {
      this.$router.push("/summoner/euw/" + this.search)
    },
    resetLocalStorage() {
      console.log('CLEAR LOCALSTORAGE')
      localStorage.clear()
    }
  },
  mounted: function () {
    this.checkLocalStorage()
  },
  watch: {
    $route() {
      console.log('route changed')
      this.checkLocalStorage()
    }
  }
};
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

.search {
  background: #4dc0b5;
}

.search .container {
  display: flex;
  align-items: center;
  justify-content: space-around;

  padding: 32px 0;
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

/* #######LOADER####### */
.loader--overlay {
  position: absolute;
  z-index: 9997;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);

  display: none;
}

.loader-container {
  position: absolute;
  z-index: 9998;

  width: 100%;
  height: 100vh;
}

.LoaderBalls {
  width: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  z-index: 9999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.LoaderBalls__item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00f1ca;
}

.LoaderBalls__item:nth-child(1) {
  animation: bouncing 0.4s alternate infinite
    cubic-bezier(0.6, 0.05, 0.15, 0.95);
}

.LoaderBalls__item:nth-child(2) {
  animation: bouncing 0.4s 0.1s alternate infinite
    cubic-bezier(0.6, 0.05, 0.15, 0.95) backwards;
}

.LoaderBalls__item:nth-child(3) {
  animation: bouncing 0.4s 0.2s alternate infinite
    cubic-bezier(0.6, 0.05, 0.15, 0.95) backwards;
}

@keyframes bouncing {
  0% {
    transform: translate3d(0, 10px, 0) scale(1.2, 0.85);
  }

  100% {
    transform: translate3d(0, -20px, 0) scale(0.9, 1.1);
  }
}
</style>
