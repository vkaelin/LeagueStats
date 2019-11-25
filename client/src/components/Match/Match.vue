<template>
  <li class="ml-4 relative">
    <Ripple
      @click.native="displayDetails"
      color="rgba(43, 108, 176, 0.7)"
      :class="[data.result, showDetails ? 'rounded-t-lg' : 'rounded-lg']"
      class="match relative mt-4 bg-blue-800 text-white text-base cursor-pointer hover:shadow-xl"
    >
      <div class="relative flex flex-wrap px-5 py-3">
        <div class="first w-4/12 text-left">
          <div>
            <div
              class="h-6 text-lg text-teal-500 font-extrabold uppercase leading-none"
            >{{ data.champion.name }}</div>

            <div class="flex">
              <div class="flex flex-col justify-end items-center">
                <div
                  v-if="data.role !== 'NONE'"
                  :style="{backgroundImage: `url(${require('@/assets/img/roles/' + data.role + '.png')})`}"
                  class="w-10 h-10 bg-center bg-cover"
                ></div>
                <div
                  class="w-10 text-center text-xs text-teal-500 font-extrabold"
                >LVL {{ data.level }}</div>
              </div>
              <div
                :style="{backgroundImage: `url('${data.champion.icon}')`}"
                class="ml-2 w-16 h-16 crop-champion bg-blue-1000 rounded-lg"
              ></div>
              <div class="ml-2 flex flex-col justify-around">
                <div
                  :style="{backgroundImage: `url(${data.firstSum})`}"
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
                <div
                  :style="{backgroundImage: `url(${data.secondSum})`}"
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
              </div>
              <div class="ml-1 flex flex-col justify-around">
                <div
                  :style="[data.primaryRune ? {background: `url(${data.primaryRune}) center/cover`} : '']"
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                ></div>
                <div
                  :style="[data.secondaryRune ? {background: `url(${data.secondaryRune}) center/cover`} : '']"
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                ></div>
              </div>
              <div class="mx-auto flex flex-col justify-center items-center leading-none">
                <div class="text-xl font-extrabold text-teal-500">
                  <span class>{{ data.stats.kills }}</span>
                  <span class>/</span>
                  <span class>{{ data.stats.deaths }}</span>
                  <span class>/</span>
                  <span class>{{ data.stats.assists }}</span>
                </div>
                <div
                  class="relative z-30 mt-2 text-white text-xs font-extrabold"
                >{{ data.stats.kda }} KDA</div>
              </div>
            </div>

            <div
              class="relative z-30 h-6 flex items-end text-sm text-white font-extrabold leading-none"
            >{{ data.gamemode.name }}</div>
          </div>
        </div>

        <div class="second w-3/12 py-6 flex items-center">
          <MatchItems :items="data.items" />

          <div class="relative z-30 ml-4 leading-none">
            <div class="flex items-center">
              <img src="@/assets/img/icons/Creep.svg" alt="Minions" />
              <div class="ml-1 text-teal-300 text-sm font-bold">
                {{ data.stats.minions }}
                <span class="font-normal">cs</span>
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Gold.svg" alt="Gold" />
              <div class="ml-1 gold text-sm font-bold">{{ data.stats.gold }}</div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Damage.svg" alt="Damage" />
              <div class="ml-1 damage text-sm font-bold">{{ data.stats.dmgChamp }}</div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/KillParticipation.svg" alt="KillParticipation" />
              <div class="ml-1 kp text-sm font-bold">{{ data.stats.kp|percent }}</div>
            </div>
          </div>
        </div>

        <div class="relative z-30 third w-5/12 py-1 flex items-center">
          <div v-if="data.allyTeam.length > 1">
            <div
              v-for="(ally, index) in data.allyTeam"
              :key="'player-' + index"
              class="ml-4 flex items-center leading-none"
            >
              <div
                :class="isSummonerProfile(ally.name)"
                class="w-16 text-right overflow-hidden text-overflow whitespace-no-wrap text-xs text-blue-200 font-medium"
              >{{ ally.name }}</div>
              <div
                :class="index !== 0 ? '-mt-1': ''"
                :style="{backgroundImage: `url('${ally.champion.icon}')`}"
                class="ml-1 w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full overflow-hidden"
              ></div>
              <div
                class="mx-3 w-4 h-4 bg-center bg-cover"
                :style="{backgroundImage: `url(${require('@/assets/img/roles/' + roles[index] + '.png')})`}"
              ></div>
              <div
                :class="index !== 0 ? '-mt-1' : ''"
                :style="{backgroundImage: `url('${data.enemyTeam[index].champion.icon}')`}"
                class="w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full"
              ></div>
              <div
                class="ml-1 w-16 text-left overflow-hidden text-overflow whitespace-no-wrap text-xs text-blue-200 font-medium"
              >{{ data.enemyTeam[index].name }}</div>
            </div>
          </div>
          <div class="ml-auto flex flex-col items-center justify-center">
            <img class="w-5 h-5" src="@/assets/img/icons/Stopwatch.svg" alt="Stopwatch" />
            <div class="text-lg text-teal-400 font-medium">{{ data.time|secToTime }}</div>
            <div class="text-xs text-white font-medium">{{ data.date }}</div>
          </div>
        </div>
      </div>
    </Ripple>
    <DetailedMatch :data="getMatchDetails(data.gameId) || {}" :details-open="showDetails" />
  </li>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import DetailedMatch from '@/components/Match/DetailedMatch'
import MatchItems from '@/components/Match/MatchItems'
import Ripple from '@/components/Ripple.vue'

export default {
  components: {
    DetailedMatch,
    MatchItems,
    Ripple,
  },

  props: {
    data: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      showDetails: false
    }
  },

  computed: {
    ...mapState({
      roles: state => state.roles
    }),
    ...mapGetters('detailedMatch', ['getMatchDetails']),
  },

  methods: {
    displayDetails() {
      this.showDetails = !this.showDetails

      if (!this.getMatchDetails(this.data.gameId)) {
        this.matchDetails(this.data.gameId)
      }
    },
    isSummonerProfile(allyName) {
      return {
        'font-bold': this.$route.params.name.toLowerCase() === allyName.toLowerCase()
      }
    },
    ...mapActions('detailedMatch', ['matchDetails']),
  }
}
</script>

<style scoped>
.match {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.game-status {
  top: 50%;
  left: 6px;
  transform: translateY(-50%) rotate(-90deg);
}

.crop-champion {
  background-size: 74px;
  background-position: center;
}

.gold {
  color: #f3a05a;
}

.damage {
  color: #e25656;
}

.kp {
  color: #b78787;
}
</style>
