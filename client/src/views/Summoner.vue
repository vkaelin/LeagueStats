<template>
  <div v-if="overviewLoaded" key="overview" class="mt-3 flex text-center">
    <div class="w-3/12">
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </div>
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
          v-if="moreMatchesToFetch"
          @clicked="moreMatches"
          :loading="matchesLoading"
          btn-class="mt-4 block mx-auto bg-blue-800 px-4 py-2 rounded-md font-semibold hover:bg-blue-1000 shadow-lg"
        >More matches</LoadingButton>
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

export default {
  components: {
    LiveMatch,
    LoadingButton,
    Match,
    OverviewLoader,
    SummonerChampions,
    SummonerMates,
    SummonerStats,
  },

  computed: {
    ...mapState({
      current: state => state.summoner.live.match,
      overview: state => state.summoner.overview
    }),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'overviewLoaded', 'summonerFound'])
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
  },

  methods: {
    fetchData() {
      if (!this.overviewLoaded && this.summonerFound) {
        this.overviewRequest()
      }
    },
    ...mapActions('summoner', ['moreMatches', 'overviewRequest']),
  },
}
</script>
