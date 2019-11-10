<template>
  <div class="bg-blue-800 rounded-lg">
    <div class="relative heading flex justify-center py-4 rounded-t-lg text-blue-200">
      <svg class="w-6 h-6">
        <use xlink:href="#graph" />
      </svg>
      <span class="mx-4 text-lg font-bold uppercase">STATS</span>
      <svg class="w-6 h-6" style="transform: scaleX(-1);">
        <use xlink:href="#graph" />
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
                <span class="text-teal-400 font-bold">{{ stats.global.count }}</span> matches
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
    <div class="mt-2 flex items-center py-2">
      <div
        v-for="(role, index) in stats.role"
        :key="index"
        class="flex flex-col items-center w-1/5"
      >
        <Dropdown>
          <template v-slot:trigger>
            <div
              class="flex flex-col justify-end w-2 h-12 bg-blue-900 rounded-full cursor-pointer"
            >
              <div
                :style="{height: (role.count * 3 / mostPlayedRole) * role.wins / role.count + 'rem'}"
                class="bg-green-400 rounded-t-full"
              ></div>
              <div
                :style="{height: (role.count * 3 / mostPlayedRole) * role.losses / role.count + 'rem'}"
                class="bg-red-400 rounded-b-full"
              ></div>
            </div>
          </template>
          <template v-slot:default>
            <div class="px-2 text-white text-center text-sm select-none">
              <div>{{ role.role|capitalize }}</div>
              <span
                :class="winLossColor(role.wins, role.losses).win"
                class="font-bold"
              >{{ role.wins }}</span>
              <span class="mx-1 text-gray-400 font-bold">-</span>
              <span
                :class="winLossColor(role.wins, role.losses).loss"
                class="font-bold"
              >{{ role.losses }}</span>
              <div
                :class="calculateWinrate(role.wins, role.count).color"
                class="mt-1 font-bold"
              >{{ calculateWinrate(role.wins, role.count).winrate|round }}%</div>
            </div>
          </template>
        </Dropdown>
        <div
          :style="{backgroundImage: `url(${require('@/assets/img/roles/' + role.role + '.png')})`}"
          class="mt-1 w-4 h-4 bg-center bg-cover"
        ></div>
        <div class="text-xs text-blue-200">{{ role.count }}</div>
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
          <div class="w-1/4">{{ (stat / (stats.global.time / 60)).toFixed(2) }}</div>
          <div class="w-1/4">{{ (stat / stats.global.count).toFixed(2) }}</div>
        </li>
        <li class="flex justify-between items-center px-4 py-1 bg-blue-760 leading-tight">
          <div class="w-1/4 text-left whitespace-no-wrap">kill participation</div>
          <div class="w-1/4">{{ stats.global.kp|percent }}</div>
        </li>
        <li class="flex justify-between items-center px-4 py-1 leading-tight">
          <div class="w-1/4 text-left whitespace-no-wrap">kda</div>
          <div
            class="w-1/4"
          >{{ (stats.global.kills + stats.global.assists) / stats.global.deaths|round }}</div>
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
              <span
                :class="winLossColor(league.wins, league.losses).win"
                class="font-bold"
              >{{ league.wins }}</span>
              <span class="mx-1 text-gray-400 font-bold">-</span>
              <span
                :class="winLossColor(league.wins, league.losses).loss"
                class="font-bold"
              >{{ league.losses }}</span>
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
            :class="{'bg-blue-760': index % 2 !== 0}"
            class="flex justify-between items-center px-4 py-1 leading-tight"
          >
            <div class="w-2/4 text-left">{{ `${league.type} ${league.name.toLowerCase()}` }}</div>
            <div
              :class="calculateWinrate(league.wins, league.count).color"
              class="w-1/4"
            >{{ calculateWinrate(league.wins, league.count).winrate|percent }}</div>
            <div class="w-1/4">
              <span
                :class="winLossColor(league.wins, league.losses).win"
                class="font-bold"
              >{{ league.wins }}</span>
              <span class="mx-1 text-gray-400 font-bold">-</span>
              <span
                :class="winLossColor(league.wins, league.losses).loss"
                class="font-bold"
              >{{ league.losses }}</span>
            </div>
          </li>
        </ul>
      </template>

    </div>

    <div class="flex flex-col items-center pb-2 leading-snug">
      <div
        class="text-teal-400 text-xl"
      >{{ calculateWinrate(stats.global.wins, stats.global.count).winrate|percent }}</div>
      <div class="flex text-sm">
        <span
          :class="winLossColor(stats.global.wins, stats.global.losses).win"
          class=""
        >{{ stats.global.wins }}</span>
        <span class="mx-1 text-gray-400 font-bold">-</span>
        <span
          :class="winLossColor(stats.global.wins, stats.global.losses).loss"
          class=""
        >{{ stats.global.losses }}</span>
      </div>
      <span class="text-xs">Global winrate</span>
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
    mostPlayedRole() {
      return Math.max(...this.stats.role.map(r => r.count), 0)
    },
    globalStatsKeys() {
      // eslint-disable-next-line no-unused-vars
      const { _id, wins, losses, count, time, kp, ...rest } = this.stats.global
      return rest
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
      return this.stats.league
        .map(l => {
          return { ...l, ...gameModes[l._id] }
        })
        .filter(l => l.type === typeName)
        .sort((a, b) => b.count - a.count)
    },
    winLossColor(win, loss) {
      const colors = {
        win: 'text-gray-200',
        loss: 'text-gray-200'
      }
      win >= loss ? colors.win = 'text-green-400' : colors.loss = 'text-red-400'
      return colors
    }
  }
}
</script>
