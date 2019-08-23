<template>
  <div>
    <div class="inline-block bg-blue-800 rounded-lg p-3">
      <h4 class="font-bold text-base text-white text-left">Recent Activity</h4>
      <div class="flex">
        <span class="ml-12 text-blue-200 font-semibold text-xs">{{ gridDays[0].month }}</span>
        <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[37].month }}</span>
        <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[68].month }}</span>
        <span class="ml-16 text-blue-200 font-semibold text-xs">{{ gridDays[99].month }}</span>
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
          class="ml-2 flex flex-col flex-wrap"
          style="width: calc(20px * 15); height: calc(20px * 7)"
        >
          <div
            v-for="(day, index) in gridDays.slice(indexFirstMonday)"
            :key="day.timestamp"
            :title="day.date + ' : ' + day.matches + ' game(s)'"
            :class="[getCaseMargin(index), getCaseColor(day.matches)]"
            class="ml-1 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    matches: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      gridDays: [],
      indexFirstMonday: 0,
      nbColumns: 15
    }
  },

  created() {
    console.log('activity')

    this.createGrid()
  },

  methods: {
    createGrid() {
      const nbDaysInGrid = this.nbColumns * 7

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric'
      }

      // Create array with all the days of the Grid
      for (let i = 1; i <= nbDaysInGrid; i++) {
        const day = new Date()
        day.setDate(day.getDate() - nbDaysInGrid + i)
        const formattedDay = day.toLocaleString('fr', options)

        this.gridDays.push({
          date: formattedDay,
          matches: 0,
          day: day.toLocaleString('en', { weekday: 'long' }).substring(0, 2),
          month: day.toLocaleString('en', { month: 'long' }).substring(0, 3)
        })
      }

      // Add all the matches made by the summoner
      for (const key in this.matches) {
        const match = this.matches[key]
        const matchTime = new Date(match.timestamp)
        const formattedTime = matchTime.toLocaleString('fr', options)

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