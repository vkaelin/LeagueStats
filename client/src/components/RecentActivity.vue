<template>
  <div>
    <h4 class="font-bold text-lg">Recent Activity</h4>
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

  data () {
    return {
      matchesPerDay: []
    }
  },

  created () {
    console.log('activity')

    for (const key in this.matches) {
      const match = this.matches[key]
      const matchTime = new Date(match.timestamp)

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "numeric"
      };
      const formattedTime = matchTime.toLocaleString('fr', options)
      // const formattedTime = matchTime.getDate() + '/' + (matchTime.getMonth() + 1) + '/' + matchTime.getFullYear()

      const day = this.matchesPerDay.filter(e => e.date === formattedTime)
      if (day.length > 0) {
        day[0].matches++
      } else {
        this.matchesPerDay.push({
          date: formattedTime,
          matches: 1
        })
      }
    }
    
    this.matchesPerDay = this.matchesPerDay.reverse()
  },
}
</script>