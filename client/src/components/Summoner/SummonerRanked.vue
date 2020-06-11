<template>
  <div class="flex items-center ml-2 leading-none">
    <div class="flex flex-col justify-center ml-1">
      <div class="flex items-center">
        <div
          ref="leagueBorder"
          :style="{backgroundColor: colorBorder}"
          class="relative flex items-center justify-center w-12 h-12 rounded-full percentage-circle"
        >
          <div class="relative p-1 bg-blue-900 rounded-full w-11 h-11">
            <div
              class="h-full bg-center bg-cover"
              :style="{backgroundImage: `url(${selectedLeague.rankImgLink})`}"
            ></div>
          </div>
        </div>
        <div
          class="ml-2 text-3xl font-extrabold text-teal-500 uppercase"
        >{{ selectedLeague.fullRank }}</div>
        <div class="ml-4 text-2xl font-extrabold">{{ selectedLeague.leaguePoints }} LP</div>
        <div
          v-if="selectedLeague.miniSeries"
          class="flex items-center p-2 ml-2 bg-blue-800 rounded"
        >
          <div
            v-for="(result, index) in bo"
            :key="index + result"
            :class="[{'ml-1': index !== 0}, boGame(result)]"
            class="w-3 h-3 rounded-full"
          ></div>
        </div>
      </div>
      <div class="flex items-center mt-2">
        <div class="relative inline-block text-white">
          <select
            v-model="selectedKey"
            class="block w-full px-4 py-2 pr-8 text-lg font-extrabold leading-tight bg-blue-800 rounded-md appearance-none cursor-pointer hover:bg-blue-700 focus:outline-none"
          >
            <option
              v-for="(data, leagueName) in ranked"
              :key="leagueName"
              :value="leagueName"
            >{{ data.name }}</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          >
            <svg class="w-5 h-5 text-white">
              <use xlink:href="#chevron-down" />
            </svg>
          </div>
        </div>
        <div class="flex items-center p-2 ml-2 bg-blue-800 rounded">
          <div class="text-base font-bold uppercase">Record</div>
          <div class="ml-2 font-bold text-green-400">{{ selectedLeague.wins }}</div>
          <span class="mx-1">-</span>
          <div class="font-bold text-red-400">{{ selectedLeague.losses }}</div>
          <div class="ml-3 text-base font-bold uppercase">Winrate</div>
          <div
            :class="['ml-2 text-base leading-tight font-bold', parseFloat(selectedLeague.winrate) >= 50 ? 'text-green-400' : 'text-red-400']"
          >{{ selectedLeague.winrate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ranked: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentDegree: 0,
      rankColors: {
        'iron': '#574D4F',
        'bronze': '#8C523A',
        'silver': '#80989D',
        'gold': '#CD8837',
        'platinum': '#4E9996',
        'diamond': '#576BCE',
        'master': '#9D48E0',
        'grandmaster': '#CD4545',
        'challenger': '#F4C874',
      },
      selectedKey: Object.keys(this.ranked)[0]
    }
  },

  computed: {
    bo() {
      return this.selectedLeague.miniSeries.progress.split('')
    },
    colorBorder() {
      if (!this.selectedLeague.tier || this.selectedLeague.leaguePoints === 0) {
        return '#2c5282'
      }
      return this.rankColors[this.selectedLeague.tier.toLowerCase()]
    },
    leagueDegrees() {
      return (this.selectedLeague.leaguePoints <= 100 ? this.selectedLeague.leaguePoints : 100) * 360 / 100
    },
    selectedLeague() {
      return this.ranked[this.selectedKey]
    }
  },

  watch: {
    selectedKey() {
      this.currentDegree = 0
      this.$refs.leagueBorder.style.backgroundImage = null
      this.triggerAnimation()
    }
  },

  mounted() {
    this.triggerAnimation()
  },

  methods: {
    animateLeagueDegrees(stop = false) {
      if (stop) return
      this.selectedLeague.leaguePoints > 50 ? this.currentDegree += 2 : this.currentDegree++


      const linearGradient = this.currentDegree <= 180 ? `linear-gradient(${90 + this.currentDegree}deg, transparent 50%, #2c5282 50%)` : `linear-gradient(${this.currentDegree - 90}deg, transparent 50%, ${this.colorBorder} 50%)`
      this.$refs.leagueBorder.style.backgroundImage = `${linearGradient}, linear-gradient(90deg, #2c5282 50%, transparent 50%)`

      this.triggerAnimation()
    },
    boGame(result) {
      switch (result) {
        case 'W':
          return 'bg-green-400'
        case 'L':
          return 'bg-red-400'
        default:
          return 'bg-blue-200'
      }
    },
    triggerAnimation() {
      setTimeout(() => {
        if (this.currentDegree < 360 && this.currentDegree < this.leagueDegrees)
          this.animateLeagueDegrees()
        else
          this.animateLeagueDegrees(true)
      }, 1)
    }
  }
}
</script>
