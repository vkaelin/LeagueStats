<template>
  <div class="bg-blue-800 rounded-lg">
    <div class="relative heading flex items-center justify-center py-4 rounded-t-lg text-blue-200">
      <svg class="w-5 h-5" style="transform: rotate(-5deg);">
        <use xlink:href="#layers" />
      </svg>
      <span class="mx-4 text-lg font-bold uppercase">CHAMPIONS</span>
      <svg class="w-5 h-5" style="transform: rotate(5deg);">
        <use xlink:href="#layers" />
      </svg>
      <div class="absolute right-0 top-0 mt-3 mr-2">
        <Dropdown>
          <template v-slot:trigger>
            <svg class="w-4 h-4 cursor-pointer">
              <use xlink:href="#info" />
            </svg>
          </template>
          <template v-slot:default>
            <div class="px-2 text-white text-center text-sm select-none">
              <div>Stats based on</div>
              <div>
                <span class="text-teal-400 font-bold">{{ stats.global ? stats.global.count : 0 }}</span> matches
              </div>
              <div class="mt-2 leading-tight text-xs text-blue-100 font-normal italic">
                Load more matches
                <br />to have better results.
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div v-if="stats.champion.length">
      <div class="mt-3 px-4 flex items-baseline text-left text-sm text-blue-300 font-bold">
        <div class="ml-2 w-champion text-base text-blue-400">Champion</div>
        <div class="w-plays">plays</div>
        <div class="w-winrate">winrate</div>
        <div class="w-kda">kda</div>
      </div>
      <ul class="mt-1 text-sm text-gray-100 text-left">
        <li
          v-for="(champion, index) in stats.champion"
          :key="index"
          :class="[{'rounded-b-lg': index === stats.champion.length - 1}, {'bg-blue-760': index % 2 === 0}]"
          class="relative flex items-center px-4 py-2 leading-tight"
        >
          <div class="absolute text-xs" style="left: 6px;">{{ index + 1 }}.</div>
          <div class="ml-2 w-champion flex items-center">
            <div
              :style="{backgroundImage: `url('${champion.champion.icon}')`}"
              class="w-8 h-8 bg-center bg-cover bg-blue-1000 rounded-full flex-shrink-0"
            ></div>
            <div class="mx-1 truncate">{{ champion.champion.name }}</div>
          </div>
          <div class="w-plays">
            <div class="text-blue-400 text-xs">{{ champion.count }}</div>
            <div
              :style="{width: widthBar(champion.count, mostPlayed)}"
              class="mt-2px bg-blue-400 rounded-full h-1"
            ></div>
          </div>
          <div class="w-winrate">
            <div class="text-green-400 text-xs">{{ champion.wins * 100 / champion.count|percent }}</div>
            <div
              :style="{width: widthBar(champion.wins, champion.count)}"
              class="mt-2px bg-green-400 rounded-full h-1"
            ></div>
          </div>
          <div class="w-kda">
            <div
              class="text-purple-400 text-xs"
            >{{ kda(champion.kills, champion.deaths, champion.assists) }}</div>
            <div
              :style="{width: widthBar(kda(champion.kills, champion.deaths, champion.assists), bestKda)}"
              class="mt-2px bg-purple-400 rounded-full h-1"
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
import Dropdown from '@/components/Dropdown.vue'

export default {
  components: {
    Dropdown,
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
