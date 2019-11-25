<template>
  <table :class="{'rounded-b-lg overflow-hidden': !allyTeam}" class="w-full table-fixed">
    <thead class="leading-none">
      <tr :class="`heading-${data.result}`" class="heading-detailed text-blue-200 font-semibold">
        <th class="w-players py-5 border-r border-blue-700">
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
    <tbody :class="[{'border-b border-blue-700': allyTeam}, data.result]" class="leading-none">
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
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${player.champion.id}.png')`}"
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
                <div
                  :style="{backgroundImage: `url(${player.firstSum})`}"
                  class="w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
                <div
                  :style="{backgroundImage: `url(${player.secondSum})`}"
                  class="w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
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
                  :class="{'font-semibold text-yellow-400': $route.params.name.toLowerCase() === player.name.toLowerCase()}"
                  class="w-24 text-sm text-white text-left overflow-hidden text-overflow whitespace-no-wrap hover:text-blue-200"
                >{{ player.name }}</router-link>
                <div
                  v-else
                  class="w-24 text-sm text-white text-left overflow-hidden text-overflow whitespace-no-wrap"
                >{{ player.name }}</div>
                <div class="text-xs text-teal-500">{{ player.champion.name }}</div>
              </div>
            </div>
            <div class="flex items-center">
              <div v-show="false" class="ml-1">
                <svg class="w-6 h-6">
                  <use xlink:href="#rank-silver" />
                </svg>
                <div class="-mt-1 text-blue-200 text-xs">S2</div>
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
        >{{ player[statsFormat].gold }}</td>
        <td
          :style="bgColor(player, '156, 71, 109', 'dmgChamp')"
          class="p-2 text-white text-sm"
        >{{ player[statsFormat].dmgChamp }}</td>
        <td
          :style="bgColor(player, '156, 71, 109', 'dmgObj')"
          class="p-2 text-white text-sm text-red"
        >{{ player[statsFormat].dmgObj }}</td>
        <td
          :style="bgColor(player, '146, 145, 106', 'dmgTaken')"
          class="p-2 text-white text-sm"
        >{{ player[statsFormat].dmgTaken }}</td>
        <td
          :style="bgColor(player, '71, 132, 116', 'kp')"
          class="p-2 text-white text-sm"
        >{{ player.stats.kp }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MatchItems from '@/components/Match/MatchItems'

export default {
  components: {
    MatchItems,
  },

  props: {
    allPlayers: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      allyTeam: this.data.players.some(p => p.name.toLowerCase().replace(/ /g, '') === this.$route.params.name.toLowerCase().replace(/ /g, ''))
    }
  },

  computed: {
    statsFormat() {
      return this.percentSettings === 'true' ? 'percentStats' : 'stats'
    },
    ...mapGetters('ddragon', ['version']),
    ...mapState({
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
    }
  }
}
</script>

<style scoped>
.heading-detailed {
  box-shadow: #2b6cb0 0px -1px inset;
}

.heading-Win {
  background-image: linear-gradient(
      90deg,
      rgba(1, 97, 28, 0.3) 0%,
      rgba(44, 82, 130, 0) 45%
    ),
    linear-gradient(#2a4365 0%, #2b4c77 55%, #235a93 100%);
}

.heading-Fail {
  background-image: linear-gradient(
      90deg,
      rgba(140, 0, 0, 0.3) 0%,
      rgba(44, 82, 130, 0) 45%
    ),
    linear-gradient(#2a4365 0%, #2b4c77 55%, #235a93 100%);
}

.heading-Remake {
  background-image: linear-gradient(
      90deg,
      rgba(233, 169, 75, 0.3) 0%,
      rgba(44, 82, 130, 0) 45%
    ),
    linear-gradient(#2a4365 0%, #2b4c77 55%, #235a93 100%);
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
