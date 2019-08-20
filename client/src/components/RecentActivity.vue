<template>
  <div>
    <div class="inline-block bg-blue-800 rounded-lg p-3">
      <h4 class="font-bold text-base text-white text-left">Recent Activity</h4>
      <div class="flex">
        <span class="ml-12 text-blue-200 font-semibold text-xs">Jun</span>
        <span class="ml-16 text-blue-200 font-semibold text-xs">Jul</span>
        <span class="ml-16 text-blue-200 font-semibold text-xs">Aug</span>
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
            v-for="(day, index) in gridDays"
            :key="day.timestamp"
            :title="day.date + ' : ' + day.matches + ' game(s)'"
            :class="[getCaseMargin(index), getCaseColor(day.matches)]"
            class="ml-1 w-4 h-4 cursor-pointer"
          ></div>
        </div>
      </div>
    </div>
    <ul>
      <li
        v-for="(day) in matchesPerDay"
        :key="day.timestamp"
      >{{ day.date + ' : ' + day.matches + ' game(s)' }}</li>
    </ul>
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
      nbColumns: 15,
      matchesPerDay: []
    };
  },

  methods: {
    createGrid() {
      const nbDaysInGrid = this.nbColumns * 7;

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "numeric"
      };

      // Create array with all the days of the Grid
      for (let i = 1; i <= nbDaysInGrid; i++) {
        const day = new Date();
        day.setDate(day.getDate() - nbDaysInGrid + i);
        const formattedDay = day.toLocaleString("fr", options);
        this.gridDays.push({
          date: formattedDay,
          matches: 0
        });
      }

      // Add all the matches made by the summoner
      for (const key in this.matches) {
        const match = this.matches[key];
        const matchTime = new Date(match.timestamp);
        const formattedTime = matchTime.toLocaleString("fr", options);

        const dayOfTheMatch = this.gridDays.filter(
          e => e.date === formattedTime
        );
        if (dayOfTheMatch.length > 0) {
          dayOfTheMatch[0].matches++;
        }
      }

      console.log(this.gridDays);
    },
    getCaseColor(nbMatches) {
      /* TODO: change this */
      if(nbMatches > 5) {
        return 'bg-teal-200'
      } else if (nbMatches > 4) {
        return 'bg-teal-300'
      } else if (nbMatches > 3) {
        return 'bg-teal-400'
      } else if (nbMatches > 1) {
        return 'bg-teal-500'
      }
      return 'bg-teal-700'
    },
    getCaseMargin(index) {
      if (index % 7 !== 0) {
        return 'mt-1'
      }
    }
  },

  created() {
    console.log("activity");

    this.createGrid();
  }
};
</script>