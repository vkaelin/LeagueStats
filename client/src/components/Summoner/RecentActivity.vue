<template>
  <div>
    <div class="inline-block rounded-lg bg-blue-800">
      <div
        class="heading relative flex items-center justify-center rounded-t-lg py-2 text-blue-200"
      >
        <svg class="h-4 w-4">
          <use xlink:href="#time" />
        </svg>
        <span class="mx-3 text-sm font-bold uppercase">Recent Activity</span>
        <svg class="h-4 w-4">
          <use xlink:href="#time" />
        </svg>
      </div>
      <div class="p-3 pt-1">
        <div class="flex">
          <span class="ml-12 text-xs font-semibold text-blue-200">{{ gridDays[11].month }}</span>
          <span class="ml-16 text-xs font-semibold text-blue-200">{{ gridDays[42].month }}</span>
          <span class="ml-16 text-xs font-semibold text-blue-200">{{ gridDays[73].month }}</span>
          <span class="ml-16 text-xs font-semibold text-blue-200">{{ gridDays[104].month }}</span>
        </div>
        <div class="mt-1 flex">
          <div class="flex flex-col">
            <span class="text-xs font-semibold leading-snug text-blue-200">Mo</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">Tu</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">We</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">Th</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">Fr</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">Sa</span>
            <span class="mt-1 text-xs font-semibold leading-snug text-blue-200">Su</span>
          </div>
          <div
            class="ml-1 flex flex-col flex-wrap"
            style="width: calc(20px * 15); height: calc(20px * 7)"
          >
            <Tooltip v-for="(day, index) in gridDays.slice(indexFirstMonday)" :key="day.timestamp">
              <template #trigger>
                <div
                  :class="[getCaseMargin(index), getCaseColor(day.matches)]"
                  class="ml-1 h-4 w-4 cursor-pointer"
                />
              </template>
              <template #default>
                <div class="px-2 text-center text-xs leading-5 text-blue-200">
                  <div>
                    <span class="font-semibold text-white">{{ day.date }}</span>
                    <span>: </span>
                    <span class="font-bold text-teal-400">{{ day.matches }}</span>
                    <span> {{ day.matches > 1 ? 'games' : 'game' }}</span>
                  </div>
                  <template v-if="day.matches > 0">
                    <div>
                      <span>time played: </span>
                      <span class="font-semibold text-white">{{ day.time | secToHours }}</span>
                    </div>
                    <div>
                      <span>record: </span>
                      <span class="font-bold text-green-400">{{ day.wins }}</span>
                      <span> - </span>
                      <span class="font-bold text-red-400">{{ day.losses }}</span>
                    </div>
                  </template>
                </div>
              </template>
            </Tooltip>
          </div>
        </div>
      </div>
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

  data() {
    return {
      gridDays: [],
      indexFirstMonday: 0,
      nbColumns: 15,
      options: {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
      },
    }
  },

  computed: {
    ...mapState({
      recentActivity: (state) => state.summoner.basic.recentActivity,
    }),
  },

  watch: {
    recentActivity() {
      this.fillGrid()
    },
  },

  created() {
    this.createGrid()
  },

  methods: {
    createGrid() {
      const nbDaysInGrid = this.nbColumns * 7

      // Create array with all the days of the Grid
      for (let i = 1; i <= nbDaysInGrid; i++) {
        const day = new Date()
        day.setDate(day.getDate() - nbDaysInGrid + i)
        const formattedDay = day.toLocaleString(undefined, this.options)

        this.gridDays.push({
          date: formattedDay,
          time: 0,
          matches: 0,
          wins: 0,
          losses: 0,
          day: day.toLocaleString('en', { weekday: 'long' }).substring(0, 2),
          month: day.toLocaleString('en', { month: 'long' }).substring(0, 3),
        })
      }

      this.fillGrid()
    },
    fillGrid() {
      // Add all the matches made by the summoner
      for (const match of this.recentActivity) {
        const matchTime = new Date(match.day)
        const formattedTime = matchTime.toLocaleString(undefined, this.options)

        const dayOfTheMatch = this.gridDays.filter((e) => e.date === formattedTime)
        if (dayOfTheMatch.length > 0) {
          dayOfTheMatch[0].time = match.time
          dayOfTheMatch[0].matches = match.wins + match.losses
          dayOfTheMatch[0].wins = match.wins
          dayOfTheMatch[0].losses = match.losses
        }
      }

      // Get the index of the first Monday
      this.indexFirstMonday = this.gridDays.findIndex((d) => d.day === 'Mo')
    },
    getCaseColor(nbMatches) {
      /* TODO: change this */
      if (nbMatches >= 6) {
        return 'bg-teal-200'
      } else if (nbMatches >= 4) {
        return 'bg-teal-300'
      } else if (nbMatches >= 2) {
        return 'bg-teal-400'
      } else if (nbMatches >= 1) {
        return 'bg-teal-500'
      }
      return 'bg-teal-700'
    },
    getCaseMargin(index) {
      if (index % 7 !== 0) {
        return 'mt-1'
      }
    },
  },
}
</script>
