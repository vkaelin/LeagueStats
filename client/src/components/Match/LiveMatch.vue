<template>
  <div class="ml-4 flex overflow-hidden rounded-lg text-sm">
    <div class="relative flex w-full justify-between overflow-hidden rounded-lg bg-blue-800">
      <div class="horizontal-center absolute flex h-full flex-col items-center justify-between">
        <div class="text-base leading-loose text-blue-200">{{ gamemode.name }}</div>
        <div class="vs flex flex-col text-2xl font-bold leading-none">
          <span>V</span>
          <span class="-mt-3 ml-4">S</span>
        </div>
        <div :class="{ 'w-10': displayStartTime !== 'Not started yet' }" class="pb-2 text-blue-200">
          {{ displayStartTime }}
        </div>
      </div>
      <ul class="w-1/2 text-left">
        <li
          v-for="(ally, index) in allyTeam"
          :key="ally.summonerId"
          :class="index % 2 === 0 ? 'accent-ally' : 'ally'"
          class="flex items-center px-5 py-1 leading-loose"
        >
          <div
            :style="{
              backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${ally.championId}.png')`,
            }"
            class="h-6 w-6 rounded-full bg-blue-1000 bg-cover bg-center"
          ></div>
          <router-link
            v-if="!ally.bot"
            :to="{
              name: 'summoner',
              params: { region: $route.params.region, name: ally.summonerName },
            }"
            :class="[ally.summonerId === account.id ? 'text-white' : 'text-blue-200']"
            class="relative ml-2 hover:text-white"
            >{{ ally.summonerName }}</router-link
          >
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
            :to="{
              name: 'summoner',
              params: { region: $route.params.region, name: enemy.summonerName },
            }"
            class="relative text-red-200 hover:text-white"
            >{{ enemy.summonerName }}</router-link
          >
          <div
            :style="{
              backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${enemy.championId}.png')`,
            }"
            class="ml-2 h-6 w-6 rounded-full bg-blue-1000 bg-cover bg-center"
          ></div>
        </li>
      </ul>
    </div>
    <router-link
      :to="{
        name: 'summonerLive',
        params: { region: $route.params.region, name: $route.params.name },
      }"
      class="live-game-link bg-gradient-x -ml-2 flex cursor-pointer items-center pl-6 pr-4 text-base text-blue-200 hover:bg-blue-800 hover:text-blue-100"
    >
      <div class="-mt-0.5">more</div>
      <svg class="ml-1 h-4 w-4 transform transition-transform duration-200 ease-in-out">
        <use xlink:href="#arrow-right" />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { liveGame } from '@/mixins/liveGame'

export default {
  mixins: [liveGame],
}
</script>

<style scoped>
.accent-ally {
  background-image: linear-gradient(90deg, rgba(49, 130, 206, 0.7) 0%, rgba(44, 82, 130, 0) 100%);
}

.ally {
  background-image: linear-gradient(90deg, rgba(49, 130, 206, 0.3) 0%, rgba(44, 82, 130, 0) 90%);
}

.accent-enemy {
  background-image: linear-gradient(90deg, rgba(44, 82, 130, 0) 0%, rgba(140, 0, 0, 0.4) 100%);
}

.enemy {
  background-image: linear-gradient(90deg, rgba(44, 82, 130, 0) 10%, rgba(140, 0, 0, 0.3) 100%);
}

.vs {
  text-shadow:
    3px 2px 0px rgba(49, 130, 206, 0.8),
    -3px 2px 0px rgba(229, 62, 62, 0.8);
}

.live-game-link:hover svg {
  @apply translate-x-1;
}
</style>
