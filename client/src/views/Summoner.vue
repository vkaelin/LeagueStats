<template>
  <div class="mt-3 flex">
    <div class="mt-4 w-3/12">
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </div>
    <div class="w-9/12">
      <ul>
        <Match
          v-for="(match, index) in summonerInfos.matches"
          :key="index"
          :data="summonerInfos.matches[index]"
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
      summonerInfos: state => state.summoner.infos
    }),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch'])
  },

  methods: {
    ...mapActions('summoner', ['moreMatches']),
  }
}
</script>
