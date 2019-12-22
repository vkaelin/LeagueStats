<template>
  <div>
    <div class="mt-3 min-h-screen">
      <ChampionsSearch @search-champions="updateSearch" class="mt-4" />
      <ChampionsTable
        v-if="champions.length && championsLoaded"
        :champions="champions"
        :search="searchChampions"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ChampionsSearch from '@/components/Summoner/Champions/ChampionsSearch.vue'
import ChampionsTable from '@/components/Summoner/Champions/ChampionsTable.vue'

export default {
  components: {
    ChampionsSearch,
    ChampionsTable,
  },

  data() {
    return {
      searchChampions: ''
    }
  },

  computed: {
    ...mapState({
      champions: state => state.summoner.infos.champions,
      championsLoaded: state => state.summoner.championsLoaded
    })
  },

  created() {
    if (!this.championsLoaded) {
      console.log('FETCH CHAMPIONS')
      this.championStats()
    }
  },

  methods: {
    updateSearch(search) {
      this.searchChampions = search
    },
    ...mapActions('summoner', ['championStats']),
  }
}
</script>
