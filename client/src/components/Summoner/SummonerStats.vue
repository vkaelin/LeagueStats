<template>
  <div class="bg-blue-800 rounded-lg">
    <div class="pb-2">
      <div class="relative flex justify-center py-4 heading rounded-t-lg text-blue-200">
        <svg
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span class="mx-4 text-lg font-bold uppercase">STATS</span>
        <svg
          class="w-6 h-6"
          style="transform: scaleX(-1);"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
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
                  <span class="text-teal-400 font-bold">{{ globalStats.count }}</span> matches
                </div>
                <div class="mt-2 leading-tight text-xs text-blue-100 font-normal italic">
                  Load more matches
                  <br />and refresh the page
                  <br />to have better results.
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="py-2 text-sm text-center">
        <div class="px-4 flex items-baseline font-bold text-sm text-blue-300 uppercase">
          <div class="w-1/4 text-left text-base text-blue-400">Stat</div>
          <div class="w-1/4">Total</div>
          <div class="w-1/4">Per min</div>
          <div class="w-1/4">Avg</div>
        </div>
        <ul class="mt-1 text-gray-100">
          <li
            v-for="(stat, name, index) in globalStatsKeys"
            :key="index"
            :class="{'bg-blue-760': index % 2 !== 0}"
            class="flex justify-between items-center px-4 py-1 leading-tight"
          >
            <div class="w-1/4 text-left">{{ name }}</div>
            <div class="w-1/4">{{ stat }}</div>
            <div class="w-1/4">{{ (stat / (globalStats.time / 60)).toFixed(2) }}</div>
            <div class="w-1/4">{{ (stat / globalStats.count).toFixed(2) }}</div>
          </li>
          <li class="flex justify-between items-center px-4 py-1 bg-blue-760 leading-tight">
            <div class="w-1/4 text-left whitespace-no-wrap">kill participation</div>
            <div class="w-1/4">{{ globalStats.kp|percent }}</div>
          </li>
        </ul>
        <template v-if="leagueStatsByType('Ranked').length">
          <div class="mt-3 px-4 flex items-baseline font-bold text-sm text-blue-300 uppercase">
            <div class="w-2/4 text-left text-base text-blue-400">Ranked Stats</div>
            <div class="w-1/4">Winrate</div>
            <div class="w-1/4">Record</div>
          </div>
          <ul class="mt-1 text-gray-100">
            <li
              v-for="(league, index) in leagueStatsByType('Ranked')"
              :key="index"
              :class="{'bg-blue-760': index % 2 !== 0}"
              class="flex justify-between items-center px-4 py-1 leading-tight"
            >
              <div class="w-2/4 text-left">{{ `${league.type} ${league.name.toLowerCase()}` }}</div>
              <div
                :class="calculateWinrate(league.wins, league.count).color"
                class="w-1/4"
              >{{ calculateWinrate(league.wins, league.count).winrate|percent }}</div>
              <div class="w-1/4">
                <span class="text-green-400 font-bold">{{ league.wins }}</span>
                <span class="mx-1 text-gray-400 font-bold">-</span>
                <span class="text-gray-200 font-bold">{{ league.losses }}</span>
              </div>
            </li>
          </ul>
        </template>
        <template v-if="leagueStatsByType('Normal').length">
          <div class="mt-3 px-4 flex items-baseline font-bold text-sm text-blue-300 uppercase">
            <div class="w-2/4 text-left text-base text-blue-400">Normal Stats</div>
            <div class="w-1/4">Winrate</div>
            <div class="w-1/4">Record</div>
          </div>
          <ul class="mt-1 text-gray-100">
            <li
              v-for="(league, index) in leagueStatsByType('Normal')"
              :key="index"
              :class="{'bg-blue-750': index % 2 !== 0}"
              class="flex justify-between items-center px-4 py-1 leading-tight"
            >
              <div class="w-2/4 text-left">{{ `${league.type} ${league.name.toLowerCase()}` }}</div>
              <div
                :class="calculateWinrate(league.wins, league.count).color"
                class="w-1/4"
              >{{ calculateWinrate(league.wins, league.count).winrate|percent }}</div>
              <div class="w-1/4">
                <span class="text-green-400 font-bold">{{ league.wins }}</span>
                <span class="mx-1 text-gray-400 font-bold">-</span>
                <span class="text-gray-200 font-bold">{{ league.losses }}</span>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Dropdown from '@/components/Dropdown.vue'
import { gameModes } from '@/data/data.js'

export default {
  components: {
    Dropdown,
  },

  computed: {
    globalStats() {
      return this.stats.find(s => s._id === null)
    },
    globalStatsKeys() {
      // eslint-disable-next-line no-unused-vars
      const { _id, wins, losses, count, time, kp, ...rest } = this.globalStats
      return rest
    },
    leagueStats() {
      return this.stats.filter(s => s._id !== null)
    },
    ...mapState({
      stats: state => state.summoner.infos.stats
    }),
  },

  methods: {
    calculateWinrate(wins, count) {
      const winrate = wins / count * 100
      const color = winrate >= 50 ? 'text-green-400' : 'text-red-400'
      return {
        winrate,
        color
      }
    },
    leagueStatsByType(typeName) {
      return this.leagueStats
        .map(l => {
          return { ...l, ...gameModes[l._id] }
        })
        .filter(l => l.type === typeName)
    }
  }
}
</script>
