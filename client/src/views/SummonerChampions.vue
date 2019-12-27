<template>
  <div v-if="championsLoaded" class="mt-3">
    <div class="mt-4 flex items-center">
      <ChampionsSearch @search-champions="updateSearch" />
      <FilterQueue @filter-queue="filterByQueue" :choices="queues" class="ml-4" />
    </div>
    <ChampionsTable
      v-if="champions.length"
      :champions="champions"
      :search="searchChampions"
      class="mt-6"
    />
  </div>
  <div v-else class="mt-3">
    <div class="mt-4 text-white">LOADING CHAMPIONS</div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { gameModes } from '@/data/data.js'
import ChampionsSearch from '@/components/Summoner/Champions/ChampionsSearch.vue'
import ChampionsTable from '@/components/Summoner/Champions/ChampionsTable.vue'
import FilterQueue from '@/components/Summoner/Champions/FilterQueue.vue'

export default {
  components: {
    ChampionsSearch,
    ChampionsTable,
    FilterQueue,
  },

  data() {
    return {
      searchChampions: ''
    }
  },

  computed: {
    queues() {
      // Only keep the gameModes the summoner has played
      const queues = Object.keys(gameModes)
        .filter(gameMode =>
          gameModes[gameMode].type !== 'Bot' &&
          this.matchList.find(match => match.queue === Number(gameMode))
        )
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: gameModes[key]
          }
        }, {})
      return { '-1': { type: 'Normal', name: 'ALL QUEUES' }, ...queues }
    },
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      champions: state => state.summoner.champions.list,
      championsLoaded: state => state.summoner.champions.championsLoaded,
      matchList: state => state.summoner.basic.matchList
    })
  },

  created() {
    console.log('HELLO')
    if (!this.championsLoaded && this.summonerFound) {
      console.log('FETCH CHAMPIONS')
      this.championStats()
    }
  },

  methods: {
    filterByQueue(queue) {
      queue = Number(queue)
      queue = queue === -1 ? null : queue
      this.championStats(queue)
    },
    updateSearch(search) {
      this.searchChampions = search
    },
    ...mapActions('summoner', ['championStats']),
  }
}
</script>
