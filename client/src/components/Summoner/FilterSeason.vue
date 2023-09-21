<template>
  <div class="group relative inline-block self-end leading-none text-blue-200">
    <select
      v-model="season"
      @change="filterSeason"
      dir="rtl"
      class="block w-full cursor-pointer appearance-none rounded-md bg-transparent px-4 pr-8 focus:outline-none group-hover:text-white"
    >
      <option :value="null" class="bg-blue-800">All seasons</option>
      <option v-for="(s, index) in sortedSeasons" :key="index" :value="s" class="bg-blue-800">
        <template v-if="Number.isInteger(s)">Season {{ s }}</template>
        <!-- Preseason numbers are stored in this format: 10.5 for Preseason 11 -->
        <template v-else>Preseason {{ s + 0.5 }}</template>
      </option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
    >
      <svg class="h-4 w-4 text-blue-200 group-hover:text-white">
        <use xlink:href="#caret-down" />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      season: null,
    }
  },

  computed: {
    sortedSeasons() {
      return [...this.seasons].sort((a, b) => b - a)
    },
    ...mapState({
      currentseason: (state) => state.summoner.basic.currentSeason,
      seasons: (state) => state.summoner.basic.seasons,
    }),
  },

  created() {
    this.season = this.currentseason
  },

  methods: {
    filterSeason() {
      this.updateSeason(this.season)
    },
    ...mapActions('summoner', ['updateSeason']),
  },
}
</script>
