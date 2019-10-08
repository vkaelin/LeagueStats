<template>
  <div class="bg-blue-900">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="fixed w-full h-200 z-0"
      more-backgrounds="linear-gradient(180deg, rgba(42, 67, 101, 0) 0%, #2A4365 50%),"
      transition-name="fade"
    ></LazyBackground>

    <div class="relative z-10">
      <header class="mb-4 text-teal-100">
        <div class="container mx-auto flex justify-between items-center">
          <router-link to="/">
            <img class="w-56" src="@/assets/img/Logo.svg" alt="LeagueStats logo" />
          </router-link>

          <SearchForm @formSubmit="redirect" size="small" />
        </div>
      </header>

      <template v-if="summonerFound">
        <div class="container mx-auto text-white pb-12">
          <div class="flex justify-between xl:px-12">
            <div>
              <h1 class="text-4xl font-extrabold uppercase">
                <span class="text-5xl">{{ summonerInfos.account.name[0] }}</span>
                <span>{{ summonerInfos.account.name.substring(1) }}</span>
              </h1>
              <div class="flex">
                <div>
                  <div
                    class="relative w-24 h-24 rounded-full bg-blue-1000 border-2 border-teal-400"
                    :style="{background: getSummonerIcon}"
                  >
                    <div
                      class="absolute left-0 bottom-0 w-8 h-8 flex items-center justify-center bg-blue-900 rounded-full text-xs text-teal-500 font-extrabold border-2 border-teal-400"
                    >{{ summonerInfos.account.summonerLevel }}</div>
                  </div>
                </div>

                <SummonerRanked
                  v-if="Object.entries(summonerInfos.ranked).length !== 0"
                  :ranked="summonerInfos.ranked"
                />
              </div>
            </div>

            <div>
              <RecentActivity :matches="summonerInfos.matchList" />
            </div>
          </div>

          <div class="mt-12 text-center">
            <ul class="text-gray-900">
              <Match
                v-for="(match, index) in summonerInfos.matches"
                :key="index"
                :data="summonerInfos.matches[index]"
              />
            </ul>
          </div>

          <LoadingButton
            v-if="moreMatchesToFetch"
            @clicked="moreMatches"
            :loading="matchesLoading"
            btn-class="mt-4 block mx-auto bg-blue-800 px-4 py-2 rounded-md font-semibold hover:bg-blue-1000 shadow-lg"
          >More matches</LoadingButton>
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
        <div class="mt-12 flex justify-center">
          <div class="bg-gradient px-4 py-3 rounded-lg text-center text-lg text-blue-100 font-bold">
            <div>Player can't be found.</div>
            <div>😕</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackgroundImage.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import RecentActivity from '@/components/RecentActivity.vue'
import SummonerRanked from '@/components/SummonerRanked.vue'
import Match from '@/components/Match.vue'
import SearchForm from '@/components/SearchForm.vue'

export default {
  components: {
    LazyBackground,
    LoadingButton,
    Match,
    RecentActivity,
    SearchForm,
    SummonerRanked
  },

  computed: {
    getSummonerIcon() {
      return `url(https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/profileicon/${this.summonerInfos.account.profileIconId}.png) center/cover`
    },
    summoner() {
      return this.$route.params.name
    },
    region() {
      return this.$route.params.region
    },
    ...mapState({
      summonerInfos: state => state.summoner.infos
    }),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
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
    apiCall() {
      this.summonerRequest({ summoner: this.summoner, region: this.region })
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    ...mapActions('summoner', ['summonerRequest', 'moreMatches']),
  }
}
</script>
