<template>
  <li class="relative ml-4">
    <Ripple
      @click.native="displayDetails"
      color="rgba(43, 108, 176, 0.7)"
      :class="[data.result, showDetails ? 'rounded-t-lg' : 'rounded-lg', {'mt-4': indexMatch !== 0 }]"
      class="relative text-base text-white bg-blue-800 cursor-pointer match hover:shadow-xl"
    >
      <div class="relative flex flex-wrap px-5 py-3">
        <div
          v-if="data.newMatch"
          class="absolute top-0 right-0 px-2 rounded-full new-match text-xxs"
          style="margin: 0.35rem 0.35rem 0 0; background-color: rgba(99,179,237, .2);"
        >New</div>
        <div class="w-4/12 text-left first">
          <div>
            <div
              class="h-6 text-lg font-extrabold leading-none text-teal-500 uppercase"
            >{{ data.champion.name }}</div>

            <div class="flex">
              <div class="flex flex-col items-center justify-end">
                <div
                  v-if="data.role !== 'NONE'"
                  :style="{backgroundImage: `url(${require('@/assets/img/roles/' + data.role + '.png')})`}"
                  class="w-10 h-10 bg-center bg-cover"
                ></div>
                <div
                  class="w-10 text-xs font-extrabold text-center text-teal-500"
                >LVL {{ data.level }}</div>
              </div>
              <div
                :style="{backgroundImage: `url('${data.champion.icon}')`}"
                class="w-16 h-16 ml-2 rounded-lg crop-champion bg-blue-1000"
              ></div>
              <div class="flex flex-col justify-around ml-2">
                <div
                  v-if="data.summonerSpell1"
                  :style="{backgroundImage: `url(${data.summonerSpell1.icon})`}"
                  class="w-6 h-6 bg-center bg-cover rounded-md bg-blue-1000"
                ></div>
                <div
                  v-else
                  class="w-6 h-6 rounded-md bg-blue-1000"
                ></div>
                <div
                  v-if="data.summonerSpell2"
                  :style="{backgroundImage: `url(${data.summonerSpell2.icon})`}"
                  class="w-6 h-6 bg-center bg-cover rounded-md bg-blue-1000"
                ></div>
                <div
                  v-else
                  class="w-6 h-6 rounded-md bg-blue-1000"
                ></div>
              </div>
              <div class="flex flex-col justify-around ml-1">
                <div
                  :style="[data.primaryRune ? {background: `url(${data.primaryRune}) center/cover`} : '']"
                  class="w-6 h-6 rounded-md bg-blue-1000"
                ></div>
                <div
                  :style="[data.secondaryRune ? {background: `url(${data.secondaryRune}) center/cover`} : '']"
                  class="w-6 h-6 rounded-md bg-blue-1000"
                ></div>
              </div>
              <div class="flex flex-col items-center justify-center mx-auto leading-none">
                <div class="text-xl font-extrabold text-teal-500">
                  <span class>{{ data.stats.kills }}</span>
                  <span class>/</span>
                  <span class>{{ data.stats.deaths }}</span>
                  <span class>/</span>
                  <span class>{{ data.stats.assists }}</span>
                </div>
                <div
                  class="relative z-30 mt-2 text-xs font-extrabold text-white"
                >{{ data.stats.kda }} KDA</div>
              </div>
            </div>

            <div
              class="relative z-30 flex items-end h-6 text-sm font-extrabold leading-none text-white"
            >{{ data.gamemode.name }}</div>
          </div>
        </div>

        <div class="flex items-center w-3/12 py-6 second">
          <MatchItems :items="data.items" />

          <div class="relative z-30 ml-4 leading-none">
            <div class="flex items-center">
              <svg style="width: 15px; height: 15px;">
                <use xlink:href="#creeps" />
              </svg>
              <div class="ml-1 text-sm font-bold text-teal-300">
                {{ data.stats.minions }}
                <span class="font-normal">cs</span>
              </div>
            </div>
            <div class="flex items-center">
              <svg style="width: 15px; height: 15px;">
                <use xlink:href="#gold" />
              </svg>
              <div class="ml-1 text-sm font-bold gold">{{ data.stats.gold|kilo }}</div>
            </div>
            <div class="flex items-center">
              <svg style="width: 15px; height: 15px;">
                <use xlink:href="#damage" />
              </svg>
              <div class="ml-1 text-sm font-bold damage">{{ data.stats.dmgChamp|kilo }}</div>
            </div>
            <div class="flex items-center">
              <svg style="width: 15px; height: 15px;">
                <use xlink:href="#kill-participation" />
              </svg>
              <div class="ml-1 text-sm font-bold kp">{{ data.stats.kp|percent }}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center w-5/12 py-1 third">
          <div v-if="data.allyTeam.length > 1">
            <div
              v-for="(ally, index) in data.allyTeam"
              :key="'player-' + index"
              class="flex items-center ml-4 leading-none"
            >
              <router-link
                v-if="ally.account_id !== '0' && account.accountId !== ally.account_id"
                @click.native="$event.stopImmediatePropagation()"
                :to="{ name: 'summoner', params: { region: $route.params.region, name: ally.name }}"
                :class="isSummonerProfile(ally.account_id)"
                class="w-16 overflow-hidden text-xs font-medium text-right whitespace-no-wrap hover:text-white text-overflow"
              >{{ ally.name }}</router-link>
              <div
                v-else
                :class="isSummonerProfile(ally.account_id)"
                class="w-16 overflow-hidden text-xs font-medium text-right whitespace-no-wrap text-overflow"
              >{{ ally.name }}</div>
              <div
                :class="index !== 0 ? '-mt-1': ''"
                :style="{backgroundImage: `url('${ally.champion.icon}')`}"
                class="w-6 h-6 ml-1 overflow-hidden bg-center bg-cover rounded-full bg-blue-1000"
              ></div>
              <div
                :style="{backgroundImage: data.role !== 'NONE' ? `url(${require('@/assets/img/roles/' + roles[index] + '.png')})` : null}"
                class="w-4 h-4 mx-2 bg-center bg-cover"
              ></div>
              <div
                :class="index !== 0 ? '-mt-1' : ''"
                :style="{backgroundImage: `url('${data.enemyTeam[index].champion.icon}')`}"
                class="w-6 h-6 bg-center bg-cover rounded-full bg-blue-1000"
              ></div>
              <router-link
                v-if="data.enemyTeam[index].account_id !== '0'"
                @click.native="$event.stopImmediatePropagation()"
                :to="{ name: 'summoner', params: { region: $route.params.region, name: data.enemyTeam[index].name }}"
                class="w-16 ml-1 overflow-hidden text-xs font-medium text-left text-blue-200 whitespace-no-wrap hover:text-white text-overflow"
              >{{ data.enemyTeam[index].name }}</router-link>
              <div
                v-else
                class="w-16 ml-1 overflow-hidden text-xs font-medium text-left text-blue-200 whitespace-no-wrap text-overflow"
              >{{ data.enemyTeam[index].name }}</div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center ml-auto">
            <svg class="w-5 h-5 text-blue-200">
              <use xlink:href="#stopwatch" />
            </svg>
            <div class="text-lg font-medium text-teal-400">{{ (data.time)|secToTime }}</div>
            <Tooltip>
              <template #trigger>
                <div class="text-xs font-medium text-white">{{ data.date }}</div>
              </template>
              <template #default>
                <div class="px-2 text-xs leading-tight text-center text-white select-none">
                  <svg class="w-4 h-4 mx-auto text-teal-400">
                    <use xlink:href="#time" />
                  </svg>
                  <div class="mt-1">{{ data.fullDate.date }}</div>
                  <div>{{ data.fullDate.time }}</div>
                </div>
              </template>
            </Tooltip>
          </div>
        </div>
      </div>
    </Ripple>
    <DetailedMatch :data="getMatchDetails(data.matchId) || {}" :details-open="showDetails" />
  </li>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Tooltip from '@/components/Common/Tooltip.vue'
import DetailedMatch from '@/components/Match/DetailedMatch.vue'
import MatchItems from '@/components/Match/MatchItems.vue'
import Ripple from '@/components/Common/Ripple.vue'

export default {
  components: {
    DetailedMatch,
    Tooltip,
    MatchItems,
    Ripple,
  },

  props: {
    data: {
      type: Object,
      required: true
    },
    indexMatch: {
      type: Number,
      default: -1,
    }
  },

  data() {
    return {
      showDetails: false
    }
  },

  computed: {
    ...mapState({
      account: state => state.summoner.basic.account,
      roles: state => state.roles
    }),
    ...mapGetters('detailedMatch', ['getMatchDetails']),
  },

  methods: {
    displayDetails() {
      this.showDetails = !this.showDetails

      if (!this.getMatchDetails(this.data.matchId)) {
        this.matchDetails(this.data.matchId)
      }
    },
    isSummonerProfile(account_id) {
      return {
        'font-bold text-white': this.account.accountId === account_id,
        'text-blue-200': this.account.accountId !== account_id
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
