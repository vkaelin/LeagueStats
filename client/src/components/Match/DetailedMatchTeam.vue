<template>
  <table
    :class="[{'rounded-b-lg overflow-hidden': !allyTeam}, data.result]"
    class="w-full table-fixed"
  >
    <thead class="heading-detailed leading-none">
      <tr
        :style="getHeadingColor(data.result)"
        class="relative heading-row text-blue-200 font-semibold"
      >
        <th class="w-players py-5">
          <div class="flex justify-between">
            <span
              :class="allyTeam ? 'text-teal-400' : 'text-red-400'"
              class="pl-2"
            >{{ allyTeam ? 'Ally' : 'Enemy' }} Team</span>
            <div
              v-if="data.result === 'Win'"
              :class="allyTeam ? 'text-teal-400' : 'text-red-400'"
              class="flex pr-2"
            >
              <svg class="w-4 h-4 items-center">
                <use xlink:href="#award" />
              </svg>
              <span class="ml-2px">VICTORY</span>
            </div>
          </div>
        </th>
        <th class="w-kda px-2 py-5 text-sm">K</th>
        <th class="w-kda px-2 py-5 text-sm">D</th>
        <th class="w-kda px-2 py-5 text-sm">A</th>
        <th class="w-minions px-2 py-5 text-sm">{{ statsFormat === 'stats' ? 'cs' : 'cs/m' }}</th>
        <th class="w-vision px-2 py-5 text-sm">{{ statsFormat === 'stats' ? 'vs' : 'vs/m' }}</th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm">gold</th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm">
          dmg
          <br />champ
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm">
          dmg
          <br />obj
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm">
          dmg
          <br />taken
        </th>
        <th class="w-gold-dmg-kp px-2 py-5 text-sm">kp</th>
      </tr>
    </thead>
    <tbody :class="{'border-b border-blue-700': allyTeam}" class="leading-none">
      <tr v-for="(player, index) in data.players" :key="player.name + index">
        <td class="py-2 border-r border-blue-700">
          <div class="px-1 flex justify-between">
            <div class="flex">
              <div class="flex items-center">
                <div
                  v-if="player.role !== 'NONE'"
                  :style="{backgroundImage: `url(${require('@/assets/img/roles/' + player.role + '.png')})`}"
                  class="w-4 h-4 bg-center bg-cover"
                ></div>
              </div>
              <div
                :style="{backgroundImage: `url('${player.champion.icon}')`}"
                class="ml-2 relative w-8 h-8 bg-cover bg-center bg-blue-1000 rounded-full"
              >
                <div
                  :class="allyTeam ? 'bg-teal-500 text-teal-100' : 'bg-red-500 text-red-100'"
                  class="absolute level-position bottom-0 flex items-center justify-center w-4 h-4 rounded-full text-xxs"
                >
                  <span>{{ player.level }}</span>
                </div>
              </div>
              <div class="ml-1 flex flex-col justify-around">
                <Tooltip>
                  <template v-slot:trigger>
                    <div
                      :style="{backgroundImage: `url(${player.firstSum ? player.firstSum.icon : null})`}"
                      :class="{'cursor-pointer': player.firstSum}"
                      class="w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                    ></div>
                  </template>
                  <template v-if="player.firstSum" v-slot:default>
                    <div class="flex max-w-sm p-2 text-white text-left text-xs select-none">
                      <div
                        :style="{backgroundImage: `url('${player.firstSum.icon}')`}"
                        class="ml-1 w-12 h-12 flex-shrink-0 rounded-md bg-blue-1000 bg-center bg-cover"
                      ></div>
                      <div class="ml-2 leading-tight">
                        <div class="text-base leading-none">{{ player.firstSum.name }}</div>
                        <div class="mt-1 text-blue-200 font-light">{{ player.firstSum.description }}</div>
                      </div>
                    </div>
                  </template>
                </Tooltip>
                <Tooltip>
                  <template v-slot:trigger>
                    <div
                      :style="{backgroundImage: `url(${player.secondSum ? player.secondSum.icon : null})`}"
                      :class="{'cursor-pointer': player.secondSum}"
                      class="w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                    ></div>
                  </template>
                  <template v-if="player.secondSum" v-slot:default>
                    <div class="flex max-w-sm p-2 text-white text-left text-xs select-none">
                      <div
                        :style="{backgroundImage: `url('${player.secondSum.icon}')`}"
                        class="ml-1 w-12 h-12 flex-shrink-0 rounded-md bg-blue-1000 bg-center bg-cover"
                      ></div>
                      <div class="ml-2 leading-tight">
                        <div class="text-base leading-none">{{ player.secondSum.name }}</div>
                        <div
                          class="mt-1 text-blue-200 font-light"
                        >{{ player.secondSum.description }}</div>
                      </div>
                    </div>
                  </template>
                </Tooltip>
              </div>
              <div class="ml-2px flex flex-col justify-around">
                <div
                  :style="[player.primaryRune ? {background: `url(${player.primaryRune}) center/cover`} : '']"
                  class="w-4 h-4 bg-blue-1000 rounded-md"
                ></div>
                <div
                  :style="[player.secondaryRune ? {background: `url(${player.secondaryRune}) center/cover`} : '']"
                  class="w-4 h-4 bg-blue-1000 rounded-md"
                ></div>
              </div>
              <div class="ml-1 flex flex-col items-start justify-center leading-none">
                <router-link
                  v-if="player.firstSum"
                  :to="{ name: 'summoner', params: { region: $route.params.region, name: player.name }}"
                  :class="{'font-semibold text-yellow-400': account.id === player.summonerId}"
                  class="w-22 text-xs text-white text-left overflow-hidden text-overflow whitespace-no-wrap hover:text-blue-200"
                >{{ player.name }}</router-link>
                <div
                  v-else
                  class="w-22 text-xs text-white text-left overflow-hidden text-overflow whitespace-no-wrap"
                >{{ player.name }}</div>
                <div class="text-xxs text-teal-500">{{ player.champion.name }}</div>
              </div>
            </div>
            <div class="flex items-center">
              <div v-if="player.rank">
                <svg class="ml-auto w-5 h-5">
                  <use :xlink:href="`#rank-${player.rank.tier.toLowerCase()}`" />
                </svg>
                <div class="text-blue-300 text-xxs">{{ player.rank.shortName }}</div>
              </div>
              <div v-else-if="player.rank === undefined">
                <DotsLoader width="30px" dot-width="10px" />
              </div>
              <div v-else class="w-5 h-5">
                <div class="-mt-1 text-blue-300 text-2xl">-</div>
              </div>
              <MatchItems :items="player.items" :one-row="true" />
            </div>
          </div>
        </td>
        <td
          :style="bgColor(player, '71, 132, 116', 'kills')"
          class="p-2 text-white text-sm"
        >{{ player.stats.kills }}</td>
        <td
          :style="bgColor(player, '156, 71, 109', 'deaths')"
          class="p-2 text-white text-sm"
        >{{ player.stats.deaths }}</td>
        <td
          :style="bgColor(player, '146, 100, 79', 'assists')"
          class="p-2 text-white text-sm"
        >{{ player.stats.assists }}</td>
        <td
          class="p-2 text-white text-sm"
          :style="bgColor(player, '140, 101, 182', 'minions')"
        >{{ player[statsFormat].minions }}</td>
        <td
          class="p-2 text-white text-sm"
          :style="bgColor(player, '55, 118, 179', 'vision')"
        >{{ player[statsFormat].vision }}</td>
        <td
          class="p-2 text-white text-sm"
          :style="bgColor(player, '146, 100, 79', 'gold')"
        >{{ roundStats(player[statsFormat].gold) }}</td>
        <td
          :style="bgColor(player, '156, 71, 109', 'dmgChamp')"
          class="p-2 text-white text-sm"
        >{{ roundStats(player[statsFormat].dmgChamp) }}</td>
        <td
          :style="bgColor(player, '156, 71, 109', 'dmgObj')"
          class="p-2 text-white text-sm text-red"
        >{{ roundStats(player[statsFormat].dmgObj) }}</td>
        <td
          :style="bgColor(player, '146, 145, 106', 'dmgTaken')"
          class="p-2 text-white text-sm"
        >{{ roundStats(player[statsFormat].dmgTaken) }}</td>
        <td
          :style="bgColor(player, '71, 132, 116', 'kp')"
          class="p-2 text-white text-sm"
        >{{ player.stats.kp }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'
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
      required: true
    },
    allyTeam: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
  },

  computed: {
    statsFormat() {
      return this.percentSettings ? 'percentStats' : 'stats'
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      percentSettings: state => state.settings.percent
    }),
  },

  methods: {
    bgColor(player, rgb, stats) {
      const value = parseFloat(player.stats[stats])
      const biggestValue = Math.max(...this.allPlayers.map(p => parseFloat(p.stats[stats])), 0)
      const opacity = (value / biggestValue).toFixed(2)

      return {
        backgroundColor: `rgba(${rgb}, ${opacity})`,
        boxShadow: value === biggestValue && value !== 0 ? '#abb4d0 0px 0px 0px 2px inset' : ''
      }
    },
    displayBorderbottom(index) {
      return this.allyTeam || index !== this.data.players.length - 1
    },
    getHeadingColor(result) {
      switch (result) {
        case 'Win':
          return { '--bg-img': 'linear-gradient(90deg, rgba(1, 97, 28, 0.3) 0%, rgba(44, 82, 130, 0) 45% )' }
        case 'Fail':
          return { '--bg-img': 'linear-gradient(90deg, rgba(140, 0, 0, 0.3) 0%, rgba(44, 82, 130, 0) 45% )' }
        default:
          return { '--bg-img': 'linear-gradient(90deg, rgba(233, 169, 75, 0.3) 0%, rgba(44, 82, 130, 0) 45% )' }
      }
    },
    roundStats(value) {
      return this.percentSettings ? value : this.$options.filters.kilo(value)
    },
  }
}
</script>

<style scoped>
.heading-row th {
  position: relative;
  z-index: 20;
}

.heading-row th:first-child:before {
  content: "";
  position: absolute;
  z-index: -10;
  top: 0;
  left: 0;
  height: 67px;
  width: 884px;
  background-image: var(--bg-img),
    linear-gradient(#2a4365 0%, #2b4c77 55%, #235a93 100%);
}

.heading-row th:first-child:after {
  content: "";
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
