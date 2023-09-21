<template>
  <div key="live-game">
    <div v-if="playing || summonerLoading">
      <div v-if="liveLoaded" class="-mt-4 flex items-center justify-end text-base text-blue-200">
        <div>{{ gamemode.type }} {{ gamemode.name }}</div>
        <div class="mx-2">-</div>
        <div :class="{ 'w-12': displayStartTime !== 'Not started yet' }">
          {{ displayStartTime }}
        </div>
        <button
          @click="liveMatchRequest"
          class="ml-4 rounded-md bg-blue-800 px-3 py-1 text-blue-100 shadow-md hover:bg-blue-760"
        >
          Reload
        </button>
      </div>
      <div v-else class="h-4"></div>

      <LiveTeam :team="allyTeam" :ally="true" :gamemode="gamemode.name" />
      <LiveTeam :team="enemyTeam" :ally="false" :gamemode="gamemode.name" class="mt-4" />
    </div>
    <div v-else>
      <div class="mt-16 flex justify-center">
        <div class="bg-gradient rounded-lg px-4 py-3 text-center text-lg font-bold text-blue-100">
          <div>This summoner is not in game.</div>
          <div class="mt-2">🕊</div>
          <button
            @click="liveMatchRequest"
            class="my-4 rounded-md bg-blue-800 px-3 py-1 text-sm text-blue-100 shadow-md hover:bg-blue-760"
          >
            Reload
          </button>
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
    ...mapGetters('summoner', ['summonerLoading', 'summonerFound']),
    ...mapState({
      live: (state) => state.summoner.live.match,
      liveLoaded: (state) => state.summoner.live.liveLoaded,
      playing: (state) => state.summoner.live.playing,
    }),
  },

  watch: {
    summonerFound() {
      this.fetchData()
    },
  },

  created() {
    this.fetchData()

    this.getRunes()
  },

  methods: {
    fetchData() {
      if (this.playing && !this.liveLoaded && this.summonerFound) {
        this.liveMatchRequest()
      }
    },
    ...mapActions('cdragon', ['getRunes']),
    ...mapActions('summoner', ['liveMatchRequest']),
  },

  metaInfo() {
    return {
      title: 'Summoner Live Game',
    }
  },
}
</script>
