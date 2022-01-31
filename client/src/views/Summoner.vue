<template>
  <div
    v-if="overviewLoaded"
    key="overview"
    class="relative flex items-start justify-between mt-3 text-center vue-sticky-container"
  >
    <VueStickySidebar
      :top-spacing="48"
      :bottom-spacing="123"
      class="z-40 sidebar"
      container-selector=".vue-sticky-container"
    >
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </VueStickySidebar>
    <div class="w-9/12">
      <div v-if="current && current.participants" class="mb-4">
        <LiveMatch />
      </div>
      <div v-if="overview.matches.length">
        <ul>
          <Match
            v-for="(match, index) in overview.matches"
            :key="index"
            :data="overview.matches[index]"
            :index-match="index"
          />
        </ul>
        <LoadingButton
          v-if="overview.moreMatchesToFetch"
          @clicked="moreMatches"
          :loading="matchesLoading"
          btn-class="block px-4 py-2 mx-auto mt-4 font-semibold bg-blue-800 rounded-md shadow-lg hover:bg-blue-1000"
        >More matches</LoadingButton>
      </div>
      <div v-else>
        <div class="flex justify-center">
          <div class="px-4 py-3 text-lg font-bold text-center text-blue-100 rounded-lg bg-gradient">
            <div>No matches found.</div>
            <div>😕</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <OverviewLoader />
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LiveMatch from '@/components/Match/LiveMatch.vue'
import LoadingButton from '@/components/Form/LoadingButton.vue'
import Match from '@/components/Match/Match.vue'
import OverviewLoader from '@/components/Summoner/Overview/OverviewLoader.vue'
import SummonerChampions from '@/components/Summoner/Overview/SummonerChampions.vue'
import SummonerMates from '@/components/Summoner/Overview/SummonerMates.vue'
import SummonerStats from '@/components/Summoner/Overview/SummonerStats.vue'
import VueStickySidebar from 'vue-sticky-sidebar'

export default {
  components: {
    LiveMatch,
    LoadingButton,
    Match,
    OverviewLoader,
    SummonerChampions,
    SummonerMates,
    SummonerStats,
    VueStickySidebar
  },

  computed: {
    ...mapState({
      current: state => state.summoner.live.match,
      overview: state => state.summoner.overview,
    }),
    ...mapGetters('summoner', ['matchesLoading', 'overviewLoaded', 'summonerFound'])
  },

  watch: {
    overviewLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()

    this.getRunes()
  },

  methods: {
    fetchData() {
      if (!this.overviewLoaded && this.summonerFound) {
        this.overviewRequest()
      }
      // Keep only the 10 last matches when summoner enters overview page
      else if (this.overviewLoaded && this.summonerFound && this.overview.matches.length > 10) {
        this.sliceOverviewMatches(10)
      }
    },
    ...mapActions('cdragon', ['getRunes']),
    ...mapActions('summoner', ['moreMatches', 'overviewRequest', 'sliceOverviewMatches']),
  },

  metaInfo() {
    return {
      title: 'Summoner Overview',
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 300px;
}
</style>
