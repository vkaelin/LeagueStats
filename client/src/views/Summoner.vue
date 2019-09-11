<template>
  <div>
    <header class="search mb-4 bg-teal-900 text-teal-100">
      <div class="container mx-auto flex justify-between py-8">
        <router-link
          to="/"
          class="flex items-center text-lg text-teal-100 mr-8 hover:text-teal-200"
        >Home</router-link>

        <SearchForm @formSubmit="redirect" />
      </div>
    </header>

    <template v-if="summonerFound">
      <div class="container mx-auto pb-16">
        <div class="mt-4 mx-auto p-4 text-center bg-blue-100 border border-gray-300 rounded-lg">
          <div
            class="mx-auto w-16 h-16 bg-gray-300"
            :style="{background: `url(https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/profileicon/${localInfos.profileIconId}.png) center/cover`}"
          ></div>
          <h1 class="player__name">{{ localInfos.name }}</h1>
          <h3 class="player__level">{{ localInfos.level }}</h3>
          <h3 class="player__rank">{{ localInfos.rank }}</h3>
          <div
            class="mx-auto w-16 h-16 bg-gray-300"
            :style="{background: `url(${localInfos.rankImgLink}) center/cover`}"
          ></div>
          <h3
            class="player__ratio"
          >{{ localInfos.rankedWins ? localInfos.rankedWins + ' wins / ' + localInfos.rankedLosses + ' losses' : localInfos.rank }}</h3>

          <RecentActivity :matches="localInfos.allMatches" />

          <ul>
            <Match
              v-for="(match, index) in localInfos.matches"
              :key="index"
              :data="localInfos.matches[index]"
            />
          </ul>
        </div>
      </div>
    </template>
    <template v-else-if="summonerLoading">
      <div
        class="flex items-center justify-center bg-white max-w-xs mx-auto p-5 rounded-lg shadow-xl"
      >
        <dot-loader :loading="summonerLoading" />
      </div>
    </template>
    <template v-else-if="summonerNotFound">
      <p>Player can't be found.</p>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import RecentActivity from '@/components/RecentActivity.vue'
import Match from '@/components/Match.vue'
import SearchForm from '@/components/SearchForm.vue'

export default {
  components: {
    Match,
    RecentActivity,
    SearchForm
  },

  computed: {
    summoner() {
      return this.$route.params.name
    },
    region() {
      return this.$route.params.region
    },
    ...mapState({
      localInfos: state => state.summoner.infos
    }),
    ...mapGetters('ddragon', ['areChampionsLoaded']),
    ...mapGetters('summoner', ['summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  watch: {
    $route() {
      console.log('route changed')
      this.apiCall()
    }
  },

  mounted() {
    this.apiCall()
  },

  methods: {
    async apiCall() {
      if (!this.areChampionsLoaded)
        await this.getChampions()

      this.summonerRequest({ summoner: this.summoner, region: this.region })
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    ...mapActions('ddragon', ['getChampions']),
    ...mapActions('summoner', ['summonerRequest'])
  }
}
</script>
