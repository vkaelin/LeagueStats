<template>
  <div key="champions" class="mt-3">
    <div class="flex items-center">
      <ChampionsSearch @search-champions="updateSearch" />
      <FilterQueue @filter-queue="filterByQueue" :choices="queues" class="ml-4" />
    </div>
    <ChampionsTable :champions="champions" :search="searchChampions" class="mt-6" />
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
      queue: null,
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

  watch: {
    championsLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    }
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
      this.queue = queue === -1 ? null : queue
      this.championsRequest(this.queue)
    },
    updateSearch(search) {
      this.searchChampions = search
    },
    ...mapActions('summoner', ['championsRequest']),
  }
}
</script>
