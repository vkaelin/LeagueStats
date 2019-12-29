<template>
  <div class="bg-blue-900 overflow-hidden min-h-screen flex flex-col">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="absolute w-full h-200 z-0"
      more-backgrounds="linear-gradient(180deg, rgba(42, 67, 101, 0) 0%, #2A4365 50%),"
      transition-name="fade"
    ></LazyBackground>

    <div class="relative page-wrapper mx-auto z-10 flex-grow text-white">
      <header class="text-teal-100">
        <div class="flex justify-between items-center">
          <router-link to="/">
            <img class="h-24" src="@/assets/img/Logo.svg" alt="LeagueStats logo" />
          </router-link>

          <SearchForm @formSubmit="redirect" size="small" />
        </div>
      </header>

      <template v-if="summonerLoading || summonerFound">
        <template v-if="summonerLoading">
          <SummonerLoader />
        </template>
        <template v-else-if="summonerFound">
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center">
                <h1 class="text-4xl font-extrabold uppercase">
                  <span class="text-5xl">{{ basic.account.name[0] }}</span>
                  <span>{{ basic.account.name.substring(1) }}</span>
                </h1>
                <div
                  v-if="playing"
                  class="ml-4 mt-2 flex items-center px-3 py-1 rounded-full bg-teal-800 border border-teal-400"
                >
                  <div class="playing-dot bg-teal-flashy w-2 h-2 rounded-full"></div>
                  <span class="ml-2 text-teal-flashy font-semibold text-sm">In Game</span>
                </div>
              </div>
              <div class="flex">
                <div :class="{'playing': playing}" class="relative w-24 h-24">
                  <div
                    :class="{'border-2': !playing}"
                    class="relative z-10 w-24 h-24 rounded-full bg-blue-1000 bg-center bg-cover border-teal-400"
                    :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${basic.account.profileIconId}.jpg')`}"
                  >
                    <div
                      class="absolute left-0 bottom-0 w-8 h-8 flex items-center justify-center bg-blue-900 rounded-full text-xs text-teal-500 font-extrabold border-2 border-teal-400"
                    >{{ basic.account.summonerLevel }}</div>
                  </div>
                </div>

                <SummonerRanked
                  v-if="Object.entries(basic.ranked).length !== 0"
                  :ranked="basic.ranked"
                />
              </div>
            </div>

            <div>
              <RecentActivity :matches="basic.matchList" />
            </div>
          </div>
          <!-- NAVIGATION -->
          <router-link
            :to="{ name: 'summoner', params: { region: $route.params.region, name: $route.params.name }}"
            class="pb-2 border-b-2 border-transparent text-blue-300 cursor-pointer hover:text-blue-100"
            exact
          >overview</router-link>
          <router-link
            :to="{ name: 'summonerChampions', params: { region: $route.params.region, name: $route.params.name }}"
            class="ml-4 pb-2 border-b-2 border-transparent text-blue-300 cursor-pointer hover:text-blue-100"
            exact
          >champions</router-link>
        </template>
        <!-- View -->
        <transition :name="tabTransition">
          <slot></slot>
        </transition>
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
import MainFooter from '@/components/MainFooter.vue'
import RecentActivity from '@/components/Summoner/RecentActivity.vue'
import SearchForm from '@/components/SearchForm.vue'
import SummonerLoader from '@/components/Summoner/SummonerLoader.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'

export default {
  components: {
    LazyBackground,
    MainFooter,
    RecentActivity,
    SearchForm,
    SummonerLoader,
    SummonerRanked,
  },

  computed: {
    summoner() {
      return this.$route.params.name
    },
    region() {
      return this.$route.params.region
    },
    uri() {
      return `${this.summoner}|${this.region}`
    },
    tabTransition() {
      return this.summonerFound ? 'tab' : 'none'
    },
    ...mapState({
      basic: state => state.summoner.basic
    }),
    ...mapGetters('summoner', ['playing', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  watch: {
    uri() {
      console.log('route changed')
      // console.log(this.$router.currentRoute)
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
      this.basicRequest({ summoner: this.summoner, region: this.region })
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
    ...mapActions(['updateCurrentRegion']),
    ...mapActions('summoner', ['basicRequest']),
  }
}
</script>

<style scoped>
.router-link-active {
  color: #fff;
  border-color: #fff;
}
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
