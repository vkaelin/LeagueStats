<template>
  <div class="bg-blue-900 overflow-hidden min-h-screen flex flex-col">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="absolute w-full h-200 z-0"
      more-backgrounds="linear-gradient(180deg, rgba(42, 67, 101, 0) 0%, #2A4365 50%),"
      transition-name="fade"
    ></LazyBackground>

    <div class="relative page-wrapper mx-auto z-10 flex-grow">
      <header class="text-teal-100">
        <div class="flex justify-between items-center">
          <router-link to="/">
            <img class="h-24" src="@/assets/img/Logo.svg" alt="LeagueStats logo" />
          </router-link>

          <SearchForm @formSubmit="redirect" size="small" />
        </div>
      </header>

      <template v-if="summonerFound">
        <div class="mt-4 text-white pb-12">
          <div class="flex justify-between px-12">
            <div>
              <div class="flex items-center">
                <h1 class="text-4xl font-extrabold uppercase">
                  <span class="text-5xl">{{ summonerInfos.account.name[0] }}</span>
                  <span>{{ summonerInfos.account.name.substring(1) }}</span>
                </h1>
                <div
                  v-if="playing"
                  class="ml-4 flex items-center px-3 py-1 rounded-full bg-teal-800 border border-teal-400"
                >
                  <div class="playing-dot bg-teal-flashy w-2 h-2 rounded-full"></div>
                  <span class="ml-2 text-teal-flashy font-semibold text-sm">In Game</span>
                </div>
              </div>
              <div class="flex">
                <div :class="{'playing': playing}" class="relative w-24 h-24">
                  <div
                    :class="{'border-2': !playing}"
                    class="relative z-10 w-24 h-24 rounded-full bg-blue-1000 border-teal-400"
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

          <div class="mt-12 text-center flex">
            <div class="mt-4 w-3/12">
              <SummonerStats />
              <SummonerMates />
            </div>
            <ul class="w-9/12 text-gray-900">
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
        <SummonerLoader />
      </template>

      <template v-else-if="summonerNotFound">
        <div class="mt-16 flex justify-center">
          <div class="bg-gradient px-4 py-3 rounded-lg text-center text-lg text-blue-100 font-bold">
            <div>Player can't be found.</div>
            <div>😕</div>
          </div>
        </div>
      </template>
    </div>

    <MainFooter />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackgroundImage.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import MainFooter from '@/components/MainFooter.vue'
import Match from '@/components/Match/Match.vue'
import RecentActivity from '@/components/Summoner/RecentActivity.vue'
import SearchForm from '@/components/SearchForm.vue'
import SummonerLoader from '@/components/Summoner/SummonerLoader.vue'
import SummonerMates from '@/components/Summoner/SummonerMates.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'
import SummonerStats from '@/components/Summoner/SummonerStats.vue'

export default {
  components: {
    LazyBackground,
    LoadingButton,
    MainFooter,
    Match,
    RecentActivity,
    SearchForm,
    SummonerLoader,
    SummonerMates,
    SummonerRanked,
    SummonerStats,
  },

  computed: {
    getSummonerIcon() {
      return `url(https://ddragon.leagueoflegends.com/cdn/${this.version}/img/profileicon/${this.summonerInfos.account.profileIconId}.png) center/cover`
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
    ...mapGetters('ddragon', ['version']),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'playing', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  watch: {
    $route() {
      console.log('route changed')
      this.updateCurrentRegion(this.region)
      this.apiCall()
    }
  },

  mounted() {
    this.updateCurrentRegion(this.region)
    this.apiCall()
  },

  methods: {
    apiCall() {
      this.summonerRequest({ summoner: this.summoner, region: this.region })
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    ...mapActions(['updateCurrentRegion']),
    ...mapActions('summoner', ['summonerRequest', 'moreMatches']),
  }
}
</script>

<style scoped>
.playing::before {
  z-index: 0;
  background: rgba(137, 160, 181, 0.2);
}

.playing::before,
.playing::after {
  content: "";
  position: absolute;
  height: 100px;
  width: 100px;
  top: -2px;
  left: -2px;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.playing::after {
  z-index: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 30%,
    rgb(36, 232, 204) 100%
  );
  animation: 0.75s linear 0s infinite normal none running rotate;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.playing-dot {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: 2.5s ease-in-out 0s infinite normal none running pulse;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(36, 232, 204, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
