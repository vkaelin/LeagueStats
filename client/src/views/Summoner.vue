<template>
  <div v-if="overviewLoaded" key="overview" class="mt-3 relative flex items-start text-center">
    <div ref="sidebar" :class="{'fixed fixed-sidebar': fixedSidebar}" class="sidebar">
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </div>
    <div :class="{'pushed-container': fixedSidebar}" class="w-9/12">
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

  data() {
    return {
      fixedSidebar: false,
      sidebarRectangle: {
        y: 354,
        height: null,
      },
    }
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

      this.getSidebarHeight()
    },
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
    window.addEventListener('scroll', this.isSidebarFixed)
  },

  mounted() {
    this.getSidebarHeight()
  },

  destroyed() {
    window.removeEventListener('scroll', this.isSidebarFixed)
  },

  methods: {
    fetchData() {
      if (!this.overviewLoaded && this.summonerFound) {
        this.overviewRequest()
      }
    },
    getSidebarHeight() {
      this.$nextTick(() => {
        this.sidebarRectangle.height = this.$refs.sidebar ? this.$refs.sidebar.getBoundingClientRect().height : null
        this.isSidebarFixed()
      })
    },
    isSidebarFixed() {
      if (!this.sidebarRectangle.height) return
      this.fixedSidebar = window.innerHeight + document.documentElement.scrollTop > this.sidebarRectangle.y + this.sidebarRectangle.height + 112
    },
    ...mapActions('summoner', ['moreMatches', 'overviewRequest']),
  },
}
</script>

<style scoped>
.sidebar {
  width: 300px;
}

.fixed-sidebar {
  bottom: 112px;
}

.pushed-container {
  margin-left: 300px;
}
</style>
