<template>
  <div>
    <button class="debug"></button>

    <div class="search">
      <div class="container mx-auto">
        <form class="flex items-center mb-6" id="changeName" method="get" action="summoners">
          <input type="search" class="hadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline mr-1" id="name" name="username" placeholder="Pseudo du Joueur">
          <button type="submit" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 mr-1 border border-grey-light rounded shadow">Chercher</button>
          <button id="refresh" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
            <i class="fas fa-sync"></i>
          </button>
        </form>
      </div>
    </div>

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

  </div>
</template>

<script>
import Match from '@/components/Match.vue';
import { championsId, maps, gameModes } from "@/data/data.js";

export default {
  components: {
    Match
  },
  data() {
    return {
      localInfos: {},
      nameChosen: this.$route.params.name
    };
  },
  methods: {
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
        const timeAgo = this.timeDifference(currentMatch.gameCreation);
        const time = this.secToTime(currentMatch.gameDuration);
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
        rankImgLink: this.getRankImg(soloQStats),
        rankedWins: soloQStats ? soloQStats.wins : undefined,
        rankedLosses: soloQStats ? soloQStats.losses : undefined
      }

      this.nameChosen = userStats.name;

      console.log('====== Saved infos ======');
      console.log(this.localInfos);

      localStorage[this.nameChosen] = JSON.stringify(this.localInfos);
      //displayContent(localStorage[this.nameChosen]);
    },
    getRankImg(soloQStats) {
      if (!soloQStats) {
        return "https://cdn.valentinkaelin.ch/riot/tier-icons/provisional.png";
      }
      if (soloQStats.tier != "MASTER" && soloQStats.tier != "CHALLENGER") {
        return ("https://cdn.valentinkaelin.ch/riot/tier-icons/" + soloQStats.tier.toLowerCase() + "_" + soloQStats.rank.toLowerCase() + ".png");
      }
      return ("https://cdn.valentinkaelin.ch/riot/tier-icons/" + soloQStats.tier.toLowerCase() + ".png");
    },
    secToTime(sec) {
      var min = Math.floor(sec / 60);
      var newSec = sec - min * 60;
      return min + ":" + (newSec < 10 ? "0" + newSec : newSec);
    },
    timeDifference(previous) {
      var current = new Date();
      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerWeek = msPerDay * 7;
      var elapsed = current - previous;

      if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + 's';
      } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + 'm';
      } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + 'h';
      } else if (elapsed < msPerWeek) {
        return Math.round(elapsed / msPerDay) + 'j';
      } else {
        var oldDate = new Date(previous);
        var day = oldDate.getDate() < 10 ? '0' + oldDate.getDate() : oldDate.getDate();
        var month = oldDate.getMonth() < 9 ? '0' + (oldDate.getMonth() + 1) : (oldDate.getMonth() + 1);
        return day + '.' + month + '.' + oldDate.getFullYear().toString().substr(-2);
      }
    }
  },
  mounted: function () {
    const summoner = this.$route.params.name;
    this.axios({
      method: "POST",
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
        console.log(jsonData);
        this.createObject(jsonData);
      })
      .catch(err => {
        console.log(err);
      });
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

#refresh {
  display: none;
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
