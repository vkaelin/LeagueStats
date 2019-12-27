<template>
  <div v-if="overviewLoaded" class="mt-3 flex text-center">
    <div class="mt-4 w-3/12">
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </div>
    <div class="w-9/12">
      <ul>
        <Match
          v-for="(match, index) in overview.matches"
          :key="index"
          :data="overview.matches[index]"
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
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LoadingButton from '@/components/LoadingButton.vue'
import Match from '@/components/Match/Match.vue'
import SummonerChampions from '@/components/Summoner/Overview/SummonerChampions.vue'
import SummonerMates from '@/components/Summoner/Overview/SummonerMates.vue'
import SummonerStats from '@/components/Summoner/Overview/SummonerStats.vue'

export default {
  components: {
    LoadingButton,
    Match,
    SummonerChampions,
    SummonerMates,
    SummonerStats,
  },

  computed: {
    ...mapState({
      overview: state => state.summoner.overview
    }),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'overviewLoaded'])
  },

  created() {
    this.overviewRequest()
  },

  methods: {
    ...mapActions('summoner', ['moreMatches', 'overviewRequest']),
  }
}
</script>
