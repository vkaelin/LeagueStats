<template>
  <div class="ml-4 mt-4 bg-blue-800 rounded-lg overflow-hidden text-sm">
    <div class="relative w-full flex justify-between">
      <div class="absolute horizontal-center h-full flex flex-col items-center justify-between">
        <div class="text-blue-200 text-base leading-loose">{{ gamemode.name }}</div>
        <div class="vs flex flex-col text-2xl font-bold leading-none">
          <span>V</span>
          <span class="ml-4 -mt-3">S</span>
        </div>
        <div class="pb-2 text-blue-200">{{ gameLength|secToTime(true) }}</div>
      </div>
      <ul class="w-1/2 text-left">
        <li
          v-for="(ally, index) in allyTeam"
          :key="ally.summonerId"
          :class="index % 2 === 0 ? 'accent-ally' : 'ally'"
          class="flex items-center px-5 py-1 leading-loose"
        >
          <div
            :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${ally.championId}.png')`}"
            class="w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
          ></div>
          <router-link
            v-if="!ally.bot"
            :to="{ name: 'summoner', params: { region: $route.params.region, name: ally.summonerName }}"
            :class="[compareSummonernames($route.params.name, ally.summonerName) ? 'text-white' : 'text-blue-200']"
            class="relative ml-2 hover:text-white"
          >{{ ally.summonerName }}</router-link>
        </li>
      </ul>
      <ul class="w-1/2 text-right">
        <li
          v-for="(enemy, index) in enemyTeam"
          :key="enemy.summonerId"
          :class="index % 2 === 0 ? 'accent-enemy' : 'enemy'"
          class="flex items-center justify-end px-5 py-1 leading-loose"
        >
          <router-link
            v-if="!enemy.bot"
            :to="{ name: 'summoner', params: { region: $route.params.region, name: enemy.summonerName }}"
            class="relative text-red-200 hover:text-white"
          >{{ enemy.summonerName }}</router-link>
          <div
            :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${enemy.championId}.png')`}"
            class="ml-2 w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { compareSummonernames } from '@/helpers/functions.js'
import { gameModes } from '@/data/data.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      gameLength: 0
    }
  },

  computed: {
    allyTeam() {
      return this.current.participants.filter(p => p.teamId === this.teamColor)
    },
    enemyTeam() {
      return this.current.participants.filter(p => p.teamId !== this.teamColor)
    },
    gamemode() {
      return gameModes[this.current.gameQueueConfigId]
    },
    teamColor() {
      return this.current.participants.find(p => compareSummonernames(p.summonerName, this.$route.params.name)).teamId
    },
    ...mapState({
      current: state => state.summoner.basic.current,
    })
  },

  created() {
    this.gameLength = this.current.gameLength

    setInterval(() => {
      this.gameLength++
    }, 1000)
  },

  methods: {
    compareSummonernames
  }
}
</script>

<style scoped>
.accent-ally {
  background-image: linear-gradient(
    90deg,
    rgba(49, 130, 206, 0.7) 0%,
    rgba(44, 82, 130, 0) 100%
  );
}

.ally {
  background-image: linear-gradient(
    90deg,
    rgba(49, 130, 206, 0.3) 0%,
    rgba(44, 82, 130, 0) 90%
  );
}

.accent-enemy {
  background-image: linear-gradient(
    90deg,
    rgba(44, 82, 130, 0) 0%,
    rgba(140, 0, 0, 0.4) 100%
  );
}

.enemy {
  background-image: linear-gradient(
    90deg,
    rgba(44, 82, 130, 0) 10%,
    rgba(140, 0, 0, 0.3) 100%
  );
}

.vs {
  text-shadow: 3px 2px 0px rgba(49, 130, 206, 0.8),
    -3px 2px 0px rgba(229, 62, 62, 0.8);
}
</style>
