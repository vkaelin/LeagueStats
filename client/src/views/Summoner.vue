<template>
  <div>
    <header class="search mb-4 bg-teal-900 text-teal-100">
      <div class="container mx-auto flex justify-between py-8">
        <router-link
          to="/"
          class="flex items-center text-lg text-teal-100 mr-8 hover:text-teal-200"
        >Accueil</router-link>

        <SearchForm @formSubmit="redirect" />
      </div>
    </header>

    <template v-if="summonerFound && !loading">
      <div class="container mx-auto pb-16">
        <div class="player bg-blue-100">
          <div
            class="player__pp"
            :style="{background: `url(https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/profileicon/${localInfos.profileIconId}.png) center/cover`}"
          ></div>
          <h1 class="player__name">{{ localInfos.name }}</h1>
          <h3 class="player__level">{{ localInfos.level }}</h3>
          <h3 class="player__rank">{{ localInfos.rank }}</h3>
          <div
            class="player__rank-img"
            :style="{background: `url(${localInfos.rankImgLink}) center/cover`}"
          ></div>
          <h3
            class="player__ratio"
          >{{ localInfos.rankedWins ? localInfos.rankedWins + ' wins / ' + localInfos.rankedLosses + ' losses' : "Joueur non classé" }}</h3>

          <RecentActivity :matches="localInfos.allMatches" />

          <ul class="list-matches--debug">
            <Match
              v-for="(match, index) in localInfos.matches"
              :key="index"
              :data="localInfos.matches[index]"
            />
          </ul>
        </div>
      </div>
    </template>
    <template v-else-if="loading">
      <div
        class="flex items-center justify-center bg-white max-w-xs mx-auto p-5 rounded-lg shadow-xl"
      >
        <dot-loader :loading="loading" />
      </div>
    </template>
    <template v-else>
      <p>Le joueur est introuvable.</p>
    </template>
  </div>
</template>

<script>
// import itemsJSON from '@/data/item.json'
import { mapState, mapActions } from 'vuex'
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
      regionsList: state => state.regionsList,
      localInfos: state => state.summoner.infos,
      summonerFound: state => state.summoner.summonerFound,
      loading: state => state.summoner.loading
    })
  },

  watch: {
    $route() {
      console.log('route changed')
      this.apiCall()
    }
  },

  // created() {
  //   this.getChampionData()
  // },
  mounted() {
    this.apiCall()
  },

  methods: {
    async apiCall() {
      await this.summonerRequest({ summoner: this.summoner, region: this.region })
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    ...mapActions('summoner', ['summonerRequest'])
  }
}
</script>

<style scoped>
.debug {
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  border: none;
  z-index: 9999999999;
}

.debug:hover {
  background: #ef5753;
}

.player {
  text-align: center;
  margin: 16px auto 0;
  border: 1px solid #ebebeb;
  padding: 16px;
  /* background: #fff; */
}

.player__pp {
  width: 75px;
  height: 75px;
  background: #ebebeb;
  margin: 0 auto;
}

.player__rank-img {
  width: 75px;
  height: 75px;
  background: #ebebeb;
  margin: 0 auto;
}

.list-matches {
  list-style-type: none;
  padding: 0;
}
</style>
