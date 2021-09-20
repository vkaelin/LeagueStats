<template>
  <div>
    <div class="inline-block bg-blue-800 rounded-lg">
      <div
        class="relative flex items-center justify-center py-2 text-blue-200 rounded-t-lg heading"
      >
        <svg class="w-4 h-4">
          <use xlink:href="#time" />
        </svg>
        <span class="mx-3 text-sm font-bold uppercase">Recent Activity</span>
        <svg class="w-4 h-4">
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
        <div class="flex mt-1">
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
            class="flex flex-col flex-wrap ml-1"
            style="width: calc(20px * 15); height: calc(20px * 7)"
          >
            <Tooltip v-for="(day, index) in gridDays.slice(indexFirstMonday)" :key="day.timestamp">
              <template #trigger>
                <div
                  :class="[getCaseMargin(index), getCaseColor(day.matches)]"
                  class="w-4 h-4 ml-1 cursor-pointer"
                />
              </template>
              <template #default>
                <div class="px-2 text-xs text-center text-white">
                  <div>{{ day.date }}</div>
                  <div>
                    <span class="font-bold text-teal-400">{{ day.matches }}</span> game(s)
                  </div>
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
        day: 'numeric'
      }
    }
  },

  computed: {
  ...mapState({
      recentActivity: state => state.summoner.basic.recentActivity
    }),
  },

  watch: {
    recentActivity() {
      this.fillGrid()
    }
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
          matches: 0,
          day: day.toLocaleString('en', { weekday: 'long' }).substring(0, 2),
          month: day.toLocaleString('en', { month: 'long' }).substring(0, 3)
        })
      }

      this.fillGrid()
    },
    fillGrid() {
      // Add all the matches made by the summoner
      for (const match of this.recentActivity) {
        const matchTime = new Date(match.day)
        const formattedTime = matchTime.toLocaleString(undefined, this.options)

        const dayOfTheMatch = this.gridDays.filter(
          e => e.date === formattedTime
        )
        if (dayOfTheMatch.length > 0) {
          dayOfTheMatch[0].matches = match.count
        }
      }

      // Get the index of the first Monday
      this.indexFirstMonday = this.gridDays.findIndex(d => d.day === 'Mo')
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
    }
  }
}
</script>
