<template>
  <div class="rounded-lg bg-blue-800">
    <div class="heading relative flex items-center justify-center rounded-t-lg py-4 text-blue-200">
      <svg class="h-5 w-5" style="transform: rotate(-5deg)">
        <use xlink:href="#layers" />
      </svg>
      <span class="mx-4 text-lg font-semibold uppercase">CHAMPIONS</span>
      <svg class="h-5 w-5" style="transform: rotate(5deg)">
        <use xlink:href="#layers" />
      </svg>
      <div class="absolute right-0 top-0 mr-2 mt-3">
        <Tooltip>
          <template #trigger>
            <svg class="h-4 w-4 cursor-pointer">
              <use xlink:href="#info" />
            </svg>
          </template>
          <template #default>
            <div class="select-none px-2 text-center text-sm text-white">
              <div>Stats based on</div>
              <div>
                <span class="font-bold text-teal-400">{{
                  stats.global ? stats.global.count : 0
                }}</span>
                matches
              </div>
              <div class="mt-2 text-xs font-normal italic leading-tight text-blue-100">
                Load more matches
                <br />to have better results.
              </div>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
    <div v-if="stats.champion.length">
      <div
        class="mt-3 flex items-baseline px-4 text-left text-xs font-semibold uppercase text-blue-300"
      >
        <div class="w-champion ml-2 text-base text-blue-400">Champion</div>
        <div class="w-plays">Plays</div>
        <div class="w-winrate">Winrate</div>
        <div class="w-kda">KDA</div>
      </div>
      <ul class="mt-1 text-left text-sm text-gray-100">
        <li
          v-for="(champion, index) in stats.champion"
          :key="index"
          :class="[
            { 'rounded-b-lg': index === stats.champion.length - 1 },
            { 'bg-blue-760': index % 2 === 0 },
          ]"
          class="relative flex items-center px-4 py-2 leading-tight"
        >
          <div class="absolute text-xs" style="left: 6px">{{ index + 1 }}.</div>
          <div class="w-champion ml-2 flex items-center">
            <div
              :style="{ backgroundImage: `url('${champion.champion.icon}')` }"
              class="h-8 w-8 flex-shrink-0 rounded-full bg-blue-1000 bg-cover bg-center"
            ></div>
            <div class="mx-1 truncate">{{ champion.champion.name }}</div>
          </div>
          <div class="w-plays">
            <div class="text-xs text-purple-400">{{ champion.count }}</div>
            <div
              :style="{ width: widthBar(champion.count, mostPlayed) }"
              class="mt-0.5 h-1 rounded-full bg-purple-400"
            ></div>
          </div>
          <div class="w-winrate">
            <div class="text-xs text-green-400">
              {{ ((champion.wins * 100) / champion.count) | percent }}
            </div>
            <div
              :style="{ width: widthBar(champion.wins, champion.count) }"
              class="mt-0.5 h-1 rounded-full bg-green-400"
            ></div>
          </div>
          <div class="w-kda">
            <div class="text-xs text-blue-400">
              {{ kda(champion.kills, champion.deaths, champion.assists) }}
            </div>
            <div
              :style="{
                width: widthBar(kda(champion.kills, champion.deaths, champion.assists), bestKda),
              }"
              class="mt-0.5 h-1 rounded-full bg-blue-400"
            ></div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="px-4 py-2">
      <div>No champions have been found.</div>
      <div>😕</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  computed: {
    bestKda() {
      const bestChamp = this.stats.champion.reduce((a, b) => {
        return this.kda(a.kills, a.deaths, a.assists) > this.kda(b.kills, b.deaths, b.assists)
          ? a
          : b
      })
      return this.kda(bestChamp.kills, bestChamp.deaths, bestChamp.assists)
    },
    mostPlayed() {
      return this.stats.champion.reduce((a, b) => (a.count > b.count ? a : b)).count
    },
    ...mapState({
      stats: (state) => state.summoner.overview.stats,
    }),
  },

  methods: {
    kda(kills, deaths, assists) {
      if (kills === 0 && deaths === 0 && assists === 0) {
        return 0
      }
      return this.$options.filters.round((kills + assists) / deaths)
    },
    widthBar(value, total) {
      return `${(value * 36) / total}px`
    },
  },
}
</script>

<style scoped>
.w-champion {
  width: 110px;
}

.w-plays {
  width: 55px;
}

.w-winrate {
  width: 65px;
}

.w-kda {
  width: 36px;
}
</style>
