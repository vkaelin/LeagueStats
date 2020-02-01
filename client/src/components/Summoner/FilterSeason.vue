<template>
  <div class="relative group self-end inline-block text-blue-200 leading-none">
    <select
      v-model="season"
      @change="filterSeason"
      dir="rtl"
      class="block appearance-none bg-transparent w-full px-4 pr-8 rounded-md cursor-pointer focus:outline-none group-hover:text-white"
    >
      <option :value="null" class="bg-blue-800">All seasons</option>
      <option v-for="(s, index) in seasons" :key="index" :value="s" class="bg-blue-800">Season {{ s }}</option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
    >
      <svg class="w-4 h-4 text-blue-200 group-hover:text-white">
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
      season: null
    }
  },

  computed: {
    ...mapState({
      currentseason: state => state.summoner.basic.currentSeason,
      seasons: state => state.summoner.basic.seasons,
    }),
  },

  created() {
    this.season = this.currentseason
  },

  methods: {
    filterSeason() {
      console.log('filter season', this.season)
      this.updateSeason(this.season)
    },
    ...mapActions('summoner', ['updateSeason'])
  }
}
</script>
