<template>
  <table
    :class="[{ 'overflow-hidden rounded-b-lg': !allyTeam }, data.result]"
    class="w-full table-fixed"
  >
    <thead class="heading-detailed leading-none">
      <tr
        :style="getHeadingColor(data.result)"
        class="heading-row relative font-semibold text-blue-200"
      >
        <th class="w-players py-5">
          <div class="flex justify-between">
            <span :class="allyTeam ? 'text-teal-400' : 'text-red-400'" class="pl-2"
              >{{ allyTeam ? 'Ally' : 'Enemy' }} Team</span
            >
            <div
              v-if="data.result === 'Win'"
              :class="allyTeam ? 'text-teal-400' : 'text-red-400'"
              class="flex pr-2"
            >
              <svg class="h-4 w-4 items-center">
                <use xlink:href="#award" />
              </svg>
              <span class="ml-0.5">VICTORY</span>
            </div>
          </div>
        </th>
        <th class="w-kda px-2 py-5 text-sm font-medium">K</th>
        <th class="w-kda px-2 py-5 text-sm font-medium">D</th>
        <th class="w-kda px-2 py-5 text-sm font-medium">A</th>
        <th class="w-minions px-2 py-5 text-sm font-medium">
          {{ statsFormat === 'stats' ? 'Cs' : 'Cs/m' }}
        </th>
        <th class="w-vision px-2 py-5 text-sm font-medium">
          {{ statsFormat === 'stats' ? 'Vs' : 'Vs/m' }}
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm font-medium">Gold</th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm font-medium">
          Dmg
          <br />champ
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm font-medium">
          Dmg
          <br />obj
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm font-medium">
          Dmg
          <br />taken
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm font-medium">KP</th>
      </tr>
    </thead>
    <tbody :class="{ 'border-b border-blue-700': allyTeam }" class="leading-none">
      <tr v-for="(player, index) in data.players" :key="player.name + index">
        <td class="border-r border-blue-700 py-2">
          <div class="flex justify-between px-1">
            <div class="flex">
              <div class="flex items-center">
                <div
                  v-if="player.role !== 'NONE'"
                  :style="{
                    backgroundImage: `url(${'/img/roles/' + player.role + '.png'})`,
                  }"
                  class="h-4 w-4 bg-cover bg-center"
                ></div>
              </div>
              <div
                :style="{ backgroundImage: `url('${player.champion.icon}')` }"
                class="relative ml-2 h-8 w-8 rounded-full bg-blue-1000 bg-cover bg-center"
              >
                <div
                  :class="allyTeam ? 'bg-teal-500 text-teal-100' : 'bg-red-500 text-red-100'"
                  class="level-position absolute bottom-0 flex h-4 w-4 items-center justify-center rounded-full text-xxs"
                >
                  <span>{{ player.level }}</span>
                </div>
              </div>
              <div class="ml-1 flex flex-col justify-around">
                <Tooltip>
                  <template #trigger>
                    <div
                      :style="{
                        backgroundImage: `url(${
                          player.summonerSpell1 ? player.summonerSpell1.icon : null
                        })`,
                      }"
                      :class="{ 'cursor-pointer': player.summonerSpell1 }"
                      class="h-4 w-4 rounded-md bg-blue-1000 bg-cover bg-center"
                    ></div>
                  </template>
                  <template v-if="player.summonerSpell1" #default>
                    <div class="flex max-w-sm select-none p-2 text-left text-xs text-white">
                      <div
                        :style="{
                          backgroundImage: `url('${player.summonerSpell1.icon}')`,
                        }"
                        class="ml-1 h-12 w-12 flex-shrink-0 rounded-md bg-blue-1000 bg-cover bg-center"
                      ></div>
                      <div class="ml-2 leading-tight">
                        <div class="text-base leading-none">
                          {{ player.summonerSpell1.name }}
                        </div>
                        <div class="mt-1 font-light text-blue-200">
                          {{ player.summonerSpell1.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Tooltip>
                <Tooltip>
                  <template #trigger>
                    <div
                      :style="{
                        backgroundImage: `url(${
                          player.summonerSpell2 ? player.summonerSpell2.icon : null
                        })`,
                      }"
                      :class="{ 'cursor-pointer': player.summonerSpell2 }"
                      class="h-4 w-4 rounded-md bg-blue-1000 bg-cover bg-center"
                    ></div>
                  </template>
                  <template v-if="player.summonerSpell2" #default>
                    <div class="flex max-w-sm select-none p-2 text-left text-xs text-white">
                      <div
                        :style="{
                          backgroundImage: `url('${player.summonerSpell2.icon}')`,
                        }"
                        class="ml-1 h-12 w-12 flex-shrink-0 rounded-md bg-blue-1000 bg-cover bg-center"
                      ></div>
                      <div class="ml-2 leading-tight">
                        <div class="text-base leading-none">
                          {{ player.summonerSpell2.name }}
                        </div>
                        <div class="mt-1 font-light text-blue-200">
                          {{ player.summonerSpell2.description }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Tooltip>
              </div>
              <Tooltip>
                <template #trigger>
                  <div
                    @click="selectRunes(player)"
                    :class="{ 'cursor-pointer': player.perks }"
                    class="ml-0.5 flex cursor-pointer flex-col justify-around"
                  >
                    <div
                      :style="[
                        player.primaryRune
                          ? {
                              background: `url(${player.primaryRune}) center/cover`,
                            }
                          : '',
                      ]"
                      class="h-4 w-4 rounded-md bg-blue-1000"
                    ></div>
                    <div
                      :style="[
                        player.secondaryRune
                          ? {
                              background: `url(${player.secondaryRune}) center/cover`,
                            }
                          : '',
                      ]"
                      class="h-4 w-4 rounded-md bg-blue-1000"
                    ></div>
                  </div>
                </template>
                <template v-if="player.perks" #default>
                  <div class="select-none px-2 text-center text-sm leading-relaxed text-white">
                    <p>Click to display</p>
                    <p class="font-bold text-teal-400">full runes</p>
                  </div>
                </template>
              </Tooltip>
              <div class="ml-1 flex flex-col items-start justify-center leading-none">
                <router-link
                  v-if="player.summonerSpell1"
                  :to="{
                    name: 'summoner',
                    params: { region: $route.params.region, name: player.name },
                  }"
                  :class="{
                    'font-semibold text-yellow-400': account.id === player.summonerId,
                  }"
                  class="text-overflow w-[5.5rem] overflow-hidden whitespace-nowrap text-left text-xs text-white hover:text-blue-200"
                  >{{ player.name }}</router-link
                >
                <div
                  v-else
                  class="text-overflow w-[5.5rem] overflow-hidden whitespace-nowrap text-left text-xs text-white"
                >
                  {{ player.name }}
                </div>
                <div class="text-xxs text-teal-500">
                  {{ player.champion.name }}
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <div v-if="player.rank">
                <svg class="ml-auto h-5 w-5">
                  <use :xlink:href="`#rank-${player.rank.tier.toLowerCase()}`" />
                </svg>
                <div class="text-xxs text-blue-300">
                  {{ player.rank.shortName }}
                </div>
              </div>
              <div v-else-if="!ranksLoaded">
                <DotsLoader width="30px" dot-width="10px" />
              </div>
              <div v-else class="h-5 w-5">
                <div class="-mt-1 text-2xl text-blue-300">-</div>
              </div>
              <MatchItems :items="player.items" :one-row="true" />
            </div>
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'kills')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player.stats.kills }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'deaths')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player.stats.deaths }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'assists')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player.stats.assists }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'minions')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player[statsFormat].minions }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'vision')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player[statsFormat].vision }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'gold')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ roundStats(player[statsFormat].gold) }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'dmgChamp')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ roundStats(player[statsFormat].dmgChamp) }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'dmgObj')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ roundStats(player[statsFormat].dmgObj) }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'dmgTaken')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ roundStats(player[statsFormat].dmgTaken) }}
          </div>
        </td>
        <td class="relative">
          <div
            :style="bgColor(player, 'kp')"
            class="absolute inset-0 flex items-center justify-center p-2 text-sm text-white"
          >
            {{ player.stats.kp }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { colors } from '@/data/data.js'
import { mapActions, mapState } from 'vuex'
import DotsLoader from '@/components/Common/DotsLoader.vue'
import Tooltip from '@/components/Common/Tooltip.vue'
import MatchItems from '@/components/Match/MatchItems.vue'

export default {
  components: {
    DotsLoader,
    Tooltip,
    MatchItems,
  },

  props: {
    allPlayers: {
      type: Array,
      required: true,
    },
    allyTeam: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    ranksLoaded: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    statsFormat() {
      return this.percentSettings ? 'percentStats' : 'stats'
    },
    ...mapState({
      account: (state) => state.summoner.basic.account,
      percentSettings: (state) => state.settings.percent,
    }),
  },

  methods: {
    bgColor(player, stats) {
      const value = parseFloat(player.stats[stats])
      const biggestValue = Math.max(...this.allPlayers.map((p) => parseFloat(p.stats[stats])), 0)
      const opacity = (value / biggestValue).toFixed(2)
      const biggestValueStyle = {}
      if (value === biggestValue && value !== 0) {
        biggestValueStyle.boxShadow = 'rgba(181, 160, 122, 0.5) 0px 0px 10px'
        biggestValueStyle.border = '2px solid'
        biggestValueStyle.borderImageSlice = '1'
        biggestValueStyle.borderImageSource = 'linear-gradient(to top, #edb457, #f9e9ce)'
        biggestValueStyle.borderCollapse = 'separate'
      }

      return {
        backgroundColor: `rgba(${colors[stats]}, ${opacity})`,
        ...biggestValueStyle,
      }
    },
    displayBorderbottom(index) {
      return this.allyTeam || index !== this.data.players.length - 1
    },
    getHeadingColor(result) {
      switch (result) {
        case 'Win':
          return {
            '--bg-img':
              'linear-gradient(90deg, rgba(1, 97, 28, 0.3) 0%, rgba(44, 82, 130, 0) 45% )',
          }
        case 'Fail':
          return {
            '--bg-img':
              'linear-gradient(90deg, rgba(140, 0, 0, 0.3) 0%, rgba(44, 82, 130, 0) 45% )',
          }
        default:
          return {
            '--bg-img':
              'linear-gradient(90deg, rgba(233, 169, 75, 0.3) 0%, rgba(44, 82, 130, 0) 45% )',
          }
      }
    },
    roundStats(value) {
      return this.percentSettings ? value : this.$options.filters.kilo(value)
    },
    selectRunes(player) {
      if (!player.perks) {
        return
      }

      this.displayRunes(player.perks)
    },
    ...mapActions('cdragon', ['displayRunes']),
  },
}
</script>

<style scoped>
.heading-row th {
  position: relative;
  z-index: 20;
}

.heading-row th:first-child:before {
  content: '';
  position: absolute;
  z-index: -10;
  top: 0;
  left: 0;
  height: 67px;
  width: 884px;
  background-image: var(--bg-img), linear-gradient(#2a4365 0%, #2b4c77 55%, #235a93 100%);
}

.heading-row th:first-child:after {
  content: '';
  position: absolute;
  right: -1px;
  top: 0;
  width: 1px;
  background-color: #2b6cb0;
  height: 67px;
}

.heading-detailed {
  box-shadow: inset 0 -1px #2b6cb0;
}

.level-position {
  left: -5px;
}

.w-players {
  width: 392px;
}

.w-kda {
  width: 36px;
}

.w-minions {
  width: 45px;
}

.w-vision {
  width: 45px;
}

.w-gold-dmg-kp {
  width: 58px;
}
</style>
