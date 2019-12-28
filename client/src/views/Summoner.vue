<template>
  <div v-if="overviewLoaded" key="overview" class="mt-3 flex text-center">
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
  <div v-else style="margin-top: 1.75rem">
    <div class="mt-4 text-center">
      <div
        v-for="index in 10"
        :key="index"
        class="ml-10 mt-4 rounded-lg w-full bg-blue-800"
        style="width: 1160px; height: 144px;"
      >
        <content-loader
          :height="144"
          :width="1160"
          :speed="2"
          primary-color="#17314f"
          secondary-color="#2b6cb0"
        >
          <rect x="241" y="46" rx="3" ry="3" width="94.35" height="26.5" />
          <rect x="309" y="91.67" rx="0" ry="0" width="3" height="0" />
          <rect x="330" y="105.67" rx="0" ry="0" width="0" height="0" />
          <rect x="312" y="94.67" rx="0" ry="0" width="0" height="0" />
          <rect x="305" y="65.67" rx="0" ry="0" width="0" height="0" />
          <rect x="258" y="80.34" rx="3" ry="3" width="59.5" height="16.7" />
          <rect x="68" y="36" rx="8" ry="8" width="64" height="64" />
          <rect x="142" y="40" rx="6" ry="6" width="24" height="24" />
          <rect x="142" y="72" rx="6" ry="6" width="24" height="24" />
          <rect x="396" y="36" rx="6" ry="6" width="32" height="32" />
          <rect x="432" y="36" rx="6" ry="6" width="32" height="32" />
          <rect x="468" y="36" rx="6" ry="6" width="32" height="32" />
          <rect x="396" y="72" rx="6" ry="6" width="32" height="32" />
          <rect x="432" y="72" rx="6" ry="6" width="32" height="32" />
          <rect x="468" y="72" rx="6" ry="6" width="32" height="32" />
          <rect x="555" y="38" rx="3" ry="3" width="72" height="13" />
          <rect x="555" y="57" rx="3" ry="3" width="103" height="13" />
          <rect x="555" y="76" rx="3" ry="3" width="131" height="13" />
          <rect x="555" y="95" rx="3" ry="3" width="131" height="13" />
          <circle cx="862" cy="32" r="12" />
          <circle cx="862" cy="52" r="12" />
          <circle cx="862" cy="72" r="12" />
          <circle cx="862" cy="92" r="12" />
          <circle cx="862" cy="112" r="12" />
          <circle cx="926" cy="32" r="12" />
          <circle cx="926" cy="52" r="12" />
          <circle cx="926" cy="72" r="12" />
          <circle cx="926" cy="92" r="12" />
          <circle cx="926" cy="112" r="12" />
          <rect x="770" y="29" rx="3" ry="3" width="72" height="9" />
          <rect x="770" y="49" rx="3" ry="3" width="72" height="9" />
          <rect x="770" y="69" rx="3" ry="3" width="72" height="9" />
          <rect x="770" y="89" rx="3" ry="3" width="72" height="9" />
          <rect x="770" y="109" rx="3" ry="3" width="72" height="9" />
          <rect x="945" y="29" rx="3" ry="3" width="72" height="9" />
          <rect x="945" y="49" rx="3" ry="3" width="72" height="9" />
          <rect x="945" y="69" rx="3" ry="3" width="72" height="9" />
          <rect x="945" y="89" rx="3" ry="3" width="72" height="9" />
          <rect x="945" y="109" rx="3" ry="3" width="72" height="9" />
          <circle cx="1106" cy="50.55" r="11.88" />
          <rect x="1074" y="66" rx="3" ry="3" width="64" height="17" />
          <rect x="1077" y="90" rx="3" ry="3" width="59" height="14" />
        </content-loader>
      </div>
    </div>

    <div class="mt-4 mx-auto" style="width: 135px; height: 40px;">
      <content-loader
        :height="40"
        :width="135"
        :speed="2"
        primary-color="#17314f"
        secondary-color="#2b6cb0"
      >
        <rect x="0" y="0" rx="6" ry="6" width="135" height="40" />
      </content-loader>
    </div>
  </div>
</template>


<script>
import { ContentLoader } from 'vue-content-loader'
import { mapState, mapActions, mapGetters } from 'vuex'
import LoadingButton from '@/components/LoadingButton.vue'
import Match from '@/components/Match/Match.vue'
import SummonerChampions from '@/components/Summoner/Overview/SummonerChampions.vue'
import SummonerMates from '@/components/Summoner/Overview/SummonerMates.vue'
import SummonerStats from '@/components/Summoner/Overview/SummonerStats.vue'

export default {
  components: {
    ContentLoader,
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
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'overviewLoaded', 'summonerFound'])
  },

  watch: {
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (this.summonerFound) {
        console.log('FETCHING OVERVIEW')
        this.overviewRequest()
      }
    },
    ...mapActions('summoner', ['moreMatches', 'overviewRequest']),
  },
}
</script>
