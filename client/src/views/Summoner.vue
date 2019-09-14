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
                <span class="text-5xl">{{ summonerInfos.name[0] }}</span>
                <span>{{ summonerInfos.name.substring(1) }}</span>
              </h1>
              <div class="flex">
                <div>
                  <div
                    class="relative w-24 h-24 rounded-full bg-blue-1000 border-2 border-teal-400"
                    :style="{background: getSummonerIcon}"
                  >
                    <div
                      class="absolute left-0 bottom-0 w-8 h-8 flex items-center justify-center bg-blue-900 rounded-full text-xs text-teal-500 font-extrabold border-2 border-teal-400"
                    >{{ summonerInfos.level }}</div>
                  </div>
                </div>
                <div v-if="summonerInfos.soloQ" class="ml-6 leading-none">
                  <div class="text-lg font-extrabold">Solo/Duo</div>
                  <div
                    class="text-teal-500 text-4xl uppercase font-extrabold"
                  >{{ summonerInfos.soloQ.rank }}</div>
                  <div class="mt-4 flex items-start bg-gradient px-4 py-3 rounded-lg">
                    <div class="flex items-center">
                      <div
                        class="w-20 h-20 bg-blue-1000"
                        :style="{background: `url(${summonerInfos.soloQ.rankImgLink}) center/cover`}"
                      ></div>
                      <div class="ml-2 text-xl font-extrabold">{{ summonerInfos.soloQ.lp }} LP</div>
                    </div>
                    <div class="ml-10 mt-2 font-extrabold uppercase leading-none">
                      <div class="text-teal-500 text-base">Record</div>
                      <div class="flex">
                        <div class="mt-2 text-sm leading-tight text-right">
                          <div>{{ summonerInfos.soloQ.wins }}</div>
                          <div>{{ summonerInfos.soloQ.losses }}</div>
                        </div>
                        <div class="ml-2 mt-2 text-sm leading-tight">
                          <div class="text-teal-500">Wins</div>
                          <div class="text-red-300">Losses</div>
                        </div>
                      </div>
                    </div>
                    <div class="ml-10 mt-2 font-extrabold">
                      <div class="text-teal-500 text-base uppercase">Winrate</div>
                      <div class="mt-2 text-xl leading-tight">{{ summonerInfos.soloQ.winrate }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <RecentActivity :matches="summonerInfos.allMatches" />
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
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackgroundImage.vue'
import RecentActivity from '@/components/RecentActivity.vue'
import Match from '@/components/Match.vue'
import SearchForm from '@/components/SearchForm.vue'

export default {
  components: {
    LazyBackground,
    Match,
    RecentActivity,
    SearchForm
  },

  computed: {
    getSummonerIcon() {
      return `url(https://ddragon.leagueoflegends.com/cdn/${this.$patch}/img/profileicon/${this.summonerInfos.profileIconId}.png) center/cover`
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
