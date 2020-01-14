<template>
  <div key="live-game">
    <div v-if="playing || summonerLoading">
      <div v-if="playing" class="flex items-center justify-end text-blue-200 text-base">
        <div>{{ gamemode.type }} {{ gamemode.name }}</div>
        <div class="mx-2">-</div>
        <div>{{ gameLength|secToTime(true) }}</div>
      </div>
      <div v-else class="flex items-center justify-end text-blue-200 text-base">
        <div>Loading</div>
      </div>

      <LiveTeam :team="allyTeam" :ally="true" />
      <LiveTeam :team="enemyTeam" :ally="false" class="mt-4" />
    </div>
    <div v-else>
      <div class="mt-16 flex justify-center">
        <div class="bg-gradient px-4 py-3 rounded-lg text-center text-lg text-blue-100 font-bold">
          <div>This summoner is not in game.</div>
          <div>🕊</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { liveGame } from '@/mixins/liveGame'
import LiveTeam from '@/components/Summoner/Live/LiveTeam.vue'

export default {
  components: {
    LiveTeam,
  },

  mixins: [liveGame],

  computed: {
    allyTeam() {
      return this.live.participants ? this.live.participants.filter(p => p.teamId === this.teamColor) : []
    },
    enemyTeam() {
      return this.live.participants ? this.live.participants.filter(p => p.teamId !== this.teamColor) : []
    },
    ...mapGetters('summoner', ['summonerLoading', 'summonerFound']),
    ...mapState({
      current: state => state.summoner.basic.current,
      live: state => state.summoner.live.match,
      liveLoaded: state => state.summoner.live.liveLoaded,
      playing: state => state.summoner.basic.playing,
    })
  },

  watch: {
    summonerFound() {
      this.fetchData()
      this.gameLength = this.current ? this.current.gameLength : 0
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (this.playing && !this.liveLoaded && this.summonerFound) {
        this.liveMatchRequest()
      }
    },
    ...mapActions('summoner', ['liveMatchRequest']),
  }
}
</script>
