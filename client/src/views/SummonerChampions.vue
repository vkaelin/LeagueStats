<template>
  <div key="champions" class="mt-3">
    <div class="flex items-center space-x-4">
      <ChampionsSearch @search-champions="updateSearch" />
      <FilterQueue @filter-queue="filterByQueue" :choices="queues" />
      <OnlyMostPlayed v-model="onlyMostPlayed" />
    </div>
    <ChampionsTable
      :champions="champions"
      :search="searchChampions"
      :only-most-played="onlyMostPlayed"
      class="mt-6"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { gameModes } from '@/data/data.js'
import ChampionsSearch from '@/components/Summoner/Champions/ChampionsSearch.vue'
import ChampionsTable from '@/components/Summoner/Champions/ChampionsTable.vue'
import FilterQueue from '@/components/Summoner/Champions/FilterQueue.vue'
import OnlyMostPlayed from '@/components/Summoner/Champions/OnlyMostPlayed.vue'

export default {
  components: {
    ChampionsSearch,
    ChampionsTable,
    FilterQueue,
    OnlyMostPlayed,
  },

  data() {
    return {
      onlyMostPlayed: false,
      queue: null,
      searchChampions: '',
    }
  },

  computed: {
    queues() {
      // Only keep the gameModes the summoner has played
      const queues = Object.keys(gameModes)
        .filter(
          (gameMode) =>
            gameModes[gameMode].type !== 'Bot' && this.gamemodes.includes(Number(gameMode))
        )
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: gameModes[key],
          }
        }, {})
      return { 0: { type: 'Normal', name: 'All queues' }, ...queues }
    },
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      champions: (state) => state.summoner.champions.list,
      championsLoaded: (state) => state.summoner.champions.championsLoaded,
      gamemodes: (state) => state.summoner.basic.gamemodes,
    }),
  },

  watch: {
    championsLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    },
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (!this.championsLoaded && this.summonerFound) {
        this.championsRequest(this.queue)
      }
    },
    filterByQueue(queue) {
      queue = Number(queue)
      this.queue = queue === 0 ? null : queue
      this.championsRequest(this.queue)
    },
    updateSearch(search) {
      this.searchChampions = search
    },
    ...mapActions('summoner', ['championsRequest']),
  },

  metaInfo() {
    return {
      title: 'Summoner Champions',
    }
  },
}
</script>
