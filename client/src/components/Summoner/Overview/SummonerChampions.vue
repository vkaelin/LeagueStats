<template>
  <div class="bg-blue-800 rounded-lg">
    <div class="relative flex items-center justify-center py-4 text-blue-200 rounded-t-lg heading">
      <svg class="w-5 h-5" style="transform: rotate(-5deg);">
        <use xlink:href="#layers" />
      </svg>
      <span class="mx-4 text-lg font-bold uppercase">CHAMPIONS</span>
      <svg class="w-5 h-5" style="transform: rotate(5deg);">
        <use xlink:href="#layers" />
      </svg>
      <div class="absolute top-0 right-0 mt-3 mr-2">
        <Tooltip>
          <template v-slot:trigger>
            <svg class="w-4 h-4 cursor-pointer">
              <use xlink:href="#info" />
            </svg>
          </template>
          <template v-slot:default>
            <div class="px-2 text-sm text-center text-white select-none">
              <div>Stats based on</div>
              <div>
                <span class="font-bold text-teal-400">{{ stats.global ? stats.global.count : 0 }}</span> matches
              </div>
              <div class="mt-2 text-xs italic font-normal leading-tight text-blue-100">
                Load more matches
                <br />to have better results.
              </div>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
    <div v-if="stats.champion.length">
      <div class="flex items-baseline px-4 mt-3 text-sm font-bold text-left text-blue-300">
        <div class="ml-2 text-base text-blue-400 w-champion">Champion</div>
        <div class="w-plays">plays</div>
        <div class="w-winrate">winrate</div>
        <div class="w-kda">kda</div>
      </div>
      <ul class="mt-1 text-sm text-left text-gray-100">
        <li
          v-for="(champion, index) in stats.champion"
          :key="index"
          :class="[{'rounded-b-lg': index === stats.champion.length - 1}, {'bg-blue-760': index % 2 === 0}]"
          class="relative flex items-center px-4 py-2 leading-tight"
        >
          <div class="absolute text-xs" style="left: 6px;">{{ index + 1 }}.</div>
          <div class="flex items-center ml-2 w-champion">
            <div
              :style="{backgroundImage: `url('${champion.champion.icon}')`}"
              class="flex-shrink-0 w-8 h-8 bg-center bg-cover rounded-full bg-blue-1000"
            ></div>
            <div class="mx-1 truncate">{{ champion.champion.name }}</div>
          </div>
          <div class="w-plays">
            <div class="text-xs text-blue-400">{{ champion.count }}</div>
            <div
              :style="{width: widthBar(champion.count, mostPlayed)}"
              class="h-1 bg-blue-400 rounded-full mt-2px"
            ></div>
          </div>
          <div class="w-winrate">
            <div class="text-xs text-green-400">{{ champion.wins * 100 / champion.count|percent }}</div>
            <div
              :style="{width: widthBar(champion.wins, champion.count)}"
              class="h-1 bg-green-400 rounded-full mt-2px"
            ></div>
          </div>
          <div class="w-kda">
            <div
              class="text-xs text-purple-400"
            >{{ kda(champion.kills, champion.deaths, champion.assists) }}</div>
            <div
              :style="{width: widthBar(kda(champion.kills, champion.deaths, champion.assists), bestKda)}"
              class="h-1 bg-purple-400 rounded-full mt-2px"
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
        return this.kda(a.kills, a.deaths, a.assists) > this.kda(b.kills, b.deaths, b.assists) ? a : b
      })
      return this.kda(bestChamp.kills, bestChamp.deaths, bestChamp.assists)
    },
    mostPlayed() {
      return this.stats.champion.reduce((a, b) => a.count > b.count ? a : b).count
    },
    ...mapState({
      stats: state => state.summoner.overview.stats
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
      return `${value * 36 / total}px`
    }
  }
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
