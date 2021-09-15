<template>
  <div class="flex flex-col min-h-screen overflow-hidden bg-blue-900">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="absolute z-0 w-full h-200"
      more-backgrounds="linear-gradient(180deg, rgba(42, 67, 101, 0) 0%, #2A4365 50%),"
      transition-name="fade"
    ></LazyBackground>

    <header
      :class="bgHeader ? 'header-scrolled' : 'bg-transparent'"
      class="fixed left-0 right-0 z-20 px-4 text-teal-100 transition-colors duration-100 ease-in-out border-b-2 header"
      style="border-color: rgba(144, 205, 244, 0.4);"
    >
      <div class="flex items-center justify-between py-2 -mb-2px">
        <div class="flex flex-1">
          <router-link to="/">
            <img class="block h-10" src="@/assets/img/Logo.svg" alt="LeagueStats logo" />
          </router-link>
        </div>

        <SearchForm @formSubmit="redirect" :homepage="false" />

        <div class="flex-1">
          <div class="flex items-center justify-end">
            <a class="relative text-sm discord" href="https://discord.gg/RjBzjfk" target="_blank">
              <svg
                class="absolute fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"
                />
              </svg>
              <span class="ml-8">
                Join
                <span class="font-bold">our Discord</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <div class="relative z-10 flex-grow mx-auto mt-20 text-white page-wrapper">
      <template v-if="summonerLoading || summonerFound">
        <template v-if="summonerLoading">
          <HeaderLoader />
        </template>
        <template v-else-if="summonerFound">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center mt-2">
                <Tooltip>
                  <template #trigger>
                    <h1 class="text-4xl font-extrabold">
                      {{ basic.account.name }}
                    </h1>
                  </template>
                  <template #default>
                    <div
                      v-if="basic.account.names.length > 1"
                      class="px-2 text-sm text-center text-white select-none"
                    >
                      <div>Old summoner names</div>
                      <ul class="pl-2 text-left list-disc list-inside">
                        <li
                          v-for="name in basic.account.names.slice(0, -1)"
                          :key="name.date"
                          class="text-teal-400"
                        >{{ name.name }}</li>
                      </ul>
                    </div>
                  </template>
                </Tooltip>
                <div
                  v-if="playing"
                  class="flex items-center px-3 py-1 mt-2 ml-4 bg-teal-800 border border-teal-400 rounded-full"
                >
                  <div class="w-2 h-2 rounded-full playing-dot bg-teal-flashy"></div>
                  <span class="ml-2 text-sm font-semibold text-teal-flashy">In Game</span>
                </div>
                <div
                  v-if="false"
                  class="inline-flex items-center px-2 py-1 mt-2 ml-4 leading-tight border border-teal-500 rounded"
                  style="background: rgba(40, 94, 97, 0.35);"
                >
                  <svg class="w-4 h-4 text-teal-600">
                    <use xlink:href="#star" />
                  </svg>
                  <div class="ml-1 text-xs font-bold text-teal-200">Favorite</div>
                </div>
              </div>
              <div class="flex mt-2">
                <div :class="{'playing': playing}" class="relative w-24 h-24">
                  <div
                    :class="{'border-2': !playing}"
                    class="relative z-10 w-24 h-24 bg-center bg-cover border-teal-400 rounded-full bg-blue-1000"
                    :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${basic.account.profileIconId}.jpg')`}"
                  >
                    <div
                      class="absolute bottom-0 left-0 flex items-center justify-center w-8 h-8 text-xs font-extrabold text-teal-500 bg-blue-900 border-2 border-teal-400 rounded-full"
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
              <RecentActivity />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <!-- NAVIGATION -->
            <div class="pb-2">
              <router-link
                :to="{ name: 'summoner', params: { region: $route.params.region, name: $route.params.name }}"
                :class="isRouteActive('summoner')"
                class="pb-2 text-blue-300 border-b-2 border-transparent cursor-pointer hover:text-blue-100"
                exact
              >Overview</router-link>
              <router-link
                :to="{ name: 'summonerChampions', params: { region: $route.params.region, name: $route.params.name }}"
                :class="isRouteActive('summonerChampions')"
                class="pb-2 ml-4 text-blue-300 border-b-2 border-transparent cursor-pointer hover:text-blue-100"
                exact
              >Champions</router-link>
              <router-link
                :to="{ name: 'summonerRecords', params: { region: $route.params.region, name: $route.params.name }}"
                :class="isRouteActive('summonerRecords')"
                class="pb-2 ml-4 text-blue-300 border-b-2 border-transparent cursor-pointer hover:text-blue-100"
                exact
              >Records</router-link>
              <router-link
                :to="{ name: 'summonerLive', params: { region: $route.params.region, name: $route.params.name }}"
                :class="isRouteActive('summonerLive')"
                class="pb-2 ml-4 text-blue-300 border-b-2 border-transparent cursor-pointer hover:text-blue-100"
                exact
              >Live game</router-link>
            </div>

            <!-- Select Season -->
            <template v-if="$route.meta.season">
              <FilterSeason />
            </template>
          </div>
        </template>

        <!-- View -->
        <transition :name="tabTransition">
          <slot></slot>
        </transition>
      </template>

      <template v-else-if="summonerNotFound">
        <div class="flex justify-center mt-16">
          <div class="px-4 py-3 text-lg font-bold text-center text-blue-100 rounded-lg bg-gradient">
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
import FilterSeason from '@/components/Summoner/FilterSeason.vue'
import LazyBackground from '@/components/Common/LazyBackgroundImage.vue'
import MainFooter from '@/components/Layout/MainFooter.vue'
import RecentActivity from '@/components/Summoner/RecentActivity.vue'
import SearchForm from '@/components/Form/SearchForm.vue'
import HeaderLoader from '@/components/Summoner/HeaderLoader.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    FilterSeason,
    LazyBackground,
    MainFooter,
    RecentActivity,
    SearchForm,
    HeaderLoader,
    SummonerRanked,
    Tooltip
  },

  data() {
    return {
      bgHeader: false
    }
  },

  computed: {
    tabTransition() {
      return this.summonerFound && this.overviewLoaded ? 'tab' : 'none'
    },
    ...mapState({
      basic: state => state.summoner.basic
    }),
    ...mapGetters('summoner', ['playing', 'overviewLoaded', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  watch: {
    $route(to, from) {
      if (from.params.region === to.params.region && from.params.name === to.params.name)
        return
      this.apiCall()
    }
  },

  created() {
    this.apiCall()
    window.addEventListener('scroll', this.handleScroll)
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    apiCall() {
      this.updateSettings({ name: 'region', value: this.$route.params.region.toLowerCase() })
      this.basicRequest({ summoner: this.$route.params.name, region: this.$route.params.region })
    },
    handleScroll() {
      this.bgHeader = window.scrollY > 25
    },
    isRouteActive(currentRoute) {
      return {
        'router-link-active': this.$route.name === currentRoute
      }
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`).catch(() => { })
    },
    ...mapActions('settings', ['updateSettings']),
    ...mapActions('summoner', ['basicRequest']),
  },

  metaInfo() {
    return {
      titleTemplate: this.summonerFound ? `${this.basic.account.name} | LeagueStats.gg %s` : 'LeagueStats.gg %s',
    }
  }
}
</script>

<style scoped>
.header-scrolled {
  background-color: rgba(42, 67, 101, 0.95);
}

.discord svg {
  width: 22px;
  height: 22px;
  transform-origin: bottom left;
  transition: 0.2s ease-in-out;
}

.discord:hover svg {
  width: 24px;
  height: 24px;
  transform: rotate(-5deg);
}

.discord:hover span {
  color: #ebf8ff;
}

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
