<template>
  <div>
    <button class="debug" @click="this.resetLocalStorage"></button>

    <div class="search">
      <div class="container mx-auto">
        <form @submit.prevent="redirect" class="flex items-center">
          <input type="text" placeholder="Entre un pseudo" class="bg-gray-300 p-2 rounded-l outline-none focus:bg-gray-400" v-model="search">
          <button class="bg-teal-500 p-2 text-white rounded-r hover:bg-teal-400" type="submit">Rechercher</button>
          
          <button
            v-if="summonerFound"
            id="refresh" 
            class="block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ml-2"
          >
            <v-icon name="sync"/>
          </button>
        </form>
      </div>
    </div>

    <template v-if="summonerFound">
      <div class="container mx-auto pb-16">
        <div class="player shadow-md" v-if="localInfos.name">
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
        <div v-else>
          <p>Loading player's information...</p>
        </div>
      </div>
    </template>
    <template v-else>
      <p>Le joueur est introuvable.</p>
    </template>

  </div>
</template>

<script>
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
      nameChosen: this.$route.params.name,
      search: '',
      summonerFound: true
    };
  },
  methods: {
    apiCall() {
      const summoner = this.$route.params.name;
      this.axios({
        method: "POST",
        //url: "https://vue.valentinkaelin.ch/api",
        url: "http://localhost:5000/api",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          summoner
        }
      })
        .then(response => {
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
          console.log(err);
        });
    },
    checkLocalStorage() {
      if (localStorage[this.$route.params.name]) {
        console.log('cached')
        this.summonerFound = true
        this.localInfos = JSON.parse(localStorage[this.$route.params.name])
      } else {
        this.apiCall()
      }
    },
    createObject(JSONData) {
      //console.log('--- ALL INFOS ---')
      //console.log(JSONData);

      const userStats = JSONData[0];
      const rankedStats = JSONData[1];
      const soloQStats = rankedStats !== null ? (rankedStats.queueType == 'RANKED_SOLO_5x5' ? rankedStats : JSONData[2]) : false;
      const matches = JSONData[3].matches;

      const matchesInfos = [];
      // Loop on all matches
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        let participantId;
        for (let i = 0; i < currentMatch.participantIdentities.length; i++) {
          if (currentMatch.participantIdentities[i].player.accountId === userStats.accountId)
            participantId = currentMatch.participantIdentities[i].participantId;
        }

        const teamId = currentMatch.participants[participantId - 1].teamId;
        let win = false;
        for (let i = 0; i < currentMatch.teams.length; i++) {
          if (currentMatch.teams[i].teamId === teamId) {
            if (currentMatch.teams[i].win === 'Win')
              win = true;
          }
        }

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
          items.push(currentMatch.participants[participantId - 1].stats[currentItem]);
        }

        const gold = (currentMatch.participants[participantId - 1].stats.goldEarned / 1000).toFixed(1) + 'k';
        const minions = currentMatch.participants[participantId - 1].stats.totalMinionsKilled + currentMatch.participants[participantId - 1].stats.neutralMinionsKilled;

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
          minions: minions
        });
      }
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

      this.nameChosen = userStats.name;

      console.log('====== Saved infos ======');
      console.log(this.localInfos);

      localStorage[this.nameChosen] = JSON.stringify(this.localInfos);
    },
    redirect() {
      this.$router.push("/summoner/" + this.search)
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
  background: #fff;
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
