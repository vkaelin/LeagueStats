<template>
  <div>
    <div class="inline-block bg-blue-800 rounded-lg">
      <div class="relative heading flex justify-center items-center py-2 rounded-t-lg text-blue-200">
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
          <span class="ml-12 text-blue-200 font-semibold text-xs">{{ gridDays[11].month }}</span>
          <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[42].month }}</span>
          <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[73].month }}</span>
          <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[104].month }}</span>
        </div>
        <div class="mt-1 flex">
          <div class="flex flex-col">
            <span class="text-blue-200 font-semibold text-xs leading-snug">Mo</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">Tu</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">We</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">Th</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">Fr</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">Sa</span>
            <span class="text-blue-200 font-semibold text-xs leading-snug mt-1">Su</span>
          </div>
          <div
            class="ml-1 flex flex-col flex-wrap"
            style="width: calc(20px * 15); height: calc(20px * 7)"
          >
            <Tooltip v-for="(day, index) in gridDays.slice(indexFirstMonday)" :key="day.timestamp">
              <template v-slot:trigger>
                <div
                  :class="[getCaseMargin(index), getCaseColor(day.matches)]"
                  class="ml-1 w-4 h-4 cursor-pointer"
                />
              </template>
              <template v-slot:default>
                <div class="px-2 text-white text-center text-xs">
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
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    matches: {
      type: Array,
      default() {
        return []
      }
    }
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

  watch: {
    matches() {
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
        const formattedDay = day.toLocaleString('fr', this.options)

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
      for (const key in this.matches) {
        const match = this.matches[key]
        const matchTime = new Date(match.timestamp)
        const formattedTime = matchTime.toLocaleString('fr', this.options)

        const dayOfTheMatch = this.gridDays.filter(
          e => e.date === formattedTime
        )
        if (dayOfTheMatch.length > 0) {
          dayOfTheMatch[0].matches++
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
