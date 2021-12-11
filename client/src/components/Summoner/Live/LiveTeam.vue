<template>
  <div class="px-5 py-4 mt-2 bg-blue-800 rounded-lg">
    <table
      class="w-full leading-none text-center table-fixed"
      style="border-collapse:separate; border-spacing:0 0.5rem;"
    >
      <thead>
        <tr class="text-left">
          <th
            :class="[ally ? 'text-teal-400 ' : 'text-red-400 ']"
            class="font-semibold w-team"
          >{{ ally ? 'Ally' : 'Enemy' }} Team</th>
          <th class="text-sm font-normal text-blue-200 w-ranked">SoloQ Stats</th>
          <th class="text-sm font-normal text-blue-200 w-ranked">Flex Stats</th>
          <th class="px-2 text-sm font-normal text-right text-blue-200 w-bans">Bans</th>
        </tr>
      </thead>
      <tbody v-if="liveLoaded">
        <tr
          v-for="(player, index) in team"
          :key="player.summonerId"
          :style="getCSSVars(player.championId)"
          class="relative live-team-row"
        >
          <td class="py-1 pl-2 rounded-l-lg">
            <div class="flex items-center">
              <div
                v-if="player.perks"
                @click="selectRunes(player)"
                :class="{ 'cursor-pointer': player.perks }"
                class="flex flex-col items-center runes"
              >
                <div
                  :style="{backgroundImage: `url('${getPrimarRune(player.perks)}')`}"
                  class="w-6 h-6 bg-center bg-cover"
                ></div>
                <div
                  :style="{backgroundImage: `url('${getSecondaryRune(player.perks)}')`}"
                  class="w-3 h-3 mt-1 bg-center bg-cover"
                ></div>
              </div>
              <div v-else class="w-6"></div>
              <div
                :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png')`}"
                :class="borderChampion(player.summonerId)"
                class="relative w-12 h-12 ml-2 bg-center bg-cover border-2 rounded-full bg-blue-1000"
              >
                <div
                  v-if="player.role && player.role !== 'NONE'"
                  :class="borderChampion(player.summonerId)"
                  class="absolute border rounded-full p-2px bg-blue-1000"
                  style="bottom: -5px; right: -5px;"
                >
                  <div
                    :style="{backgroundImage: `url(${require('@/assets/img/roles/' + player.role + '.png')})`}"
                    class="w-4 h-4 bg-center bg-cover"
                  ></div>
                </div>
              </div>
              <div class="flex flex-col ml-2">
                <div
                  :style="{backgroundImage: `url(${player.summonerSpell1.icon})`}"
                  class="w-4 h-4 bg-center bg-cover rounded-md bg-blue-1000"
                ></div>
                <div
                  :style="{backgroundImage: `url(${player.summonerSpell2.icon})`}"
                  class="w-4 h-4 mt-1 bg-center bg-cover rounded-md bg-blue-1000"
                ></div>
              </div>
              <div class="ml-3 text-sm leading-tight text-left">
                <router-link
                  v-if="!player.bot"
                  :to="{ name: 'summoner', params: { region: $route.params.region, name: player.summonerName }}"
                  :class="[player.summonerId === account.id ? 'text-yellow-500' : 'hover:text-blue-200']"
                  class="font-semibold"
                >{{ player.summonerName }}</router-link>
                <div
                  :class="[ally ? 'text-teal-300 ' : 'text-red-400 ']"
                  class="text-xs"
                >{{ player.champion.name }}
                </div>
              </div>
            </div>
          </td>
          <td class="py-1 text-left">
            <div class="px-2">
              <div v-if="player.rank.soloQ" class="flex items-center">
                <div class="inline-block text-center">
                  <svg class="w-5 h-5">
                    <use :xlink:href="`#rank-${player.rank.soloQ.tier.toLowerCase()}`" />
                  </svg>
                  <div
                    class="text-xs font-semibold text-blue-300 mt-2px"
                  >{{ player.rank.soloQ.shortName }}</div>
                </div>
                <div class="ml-5 text-center">
                  <div class="font-semibold">{{ player.rank.soloQ.winrate }}</div>
                  <div
                    class="mt-1 text-xs text-blue-300"
                  >{{ player.rank.soloQ.wins + player.rank.soloQ.losses }} games</div>
                </div>
              </div>
              <div v-else class="w-5 h-5">
                <div class="-mt-1 text-2xl text-blue-300">-</div>
              </div>
            </div>
          </td>
          <td class="py-1 text-left">
            <div class="px-2">
              <div v-if="player.rank.flex5v5" class="flex items-center">
                <div class="inline-block text-center">
                  <svg class="w-5 h-5">
                    <use :xlink:href="`#rank-${player.rank.flex5v5.tier.toLowerCase()}`" />
                  </svg>
                  <div
                    class="text-xs font-semibold text-blue-300 mt-2px"
                  >{{ player.rank.flex5v5.shortName }}</div>
                </div>
                <div class="ml-5 text-center">
                  <div class="font-semibold">{{ player.rank.flex5v5.winrate }}</div>
                  <div
                    class="mt-1 text-xs text-blue-300"
                  >{{ player.rank.flex5v5.wins + player.rank.flex5v5.losses }} games</div>
                </div>
              </div>
              <div v-else class="w-5 h-5">
                <div class="-mt-1 text-2xl text-blue-300">-</div>
              </div>
            </div>
          </td>
          <td class="py-1 text-right rounded-r-lg">
            <div class="inline-block px-2">
              <div
                v-if="live.bannedChampions.length"
                :class="[ally ? 'ban-blue border-teal-500' : 'ban-red border-red-500']"
                class="relative border-2 rounded-full ban"
              >
                <div
                  :style="[
                    banChamp(index, player.teamId) ? 
                      {backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${banChamp(index, player.teamId).championId}.png')`}
                      : ''
                  ]"
                  class="w-6 h-6 bg-center bg-cover rounded-full ban-img bg-blue-1000"
                ></div>
                <div
                  :class="[ally ? 'text-teal-100 bg-teal-500' : 'text-red-100 bg-red-500']"
                  class="absolute flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full ban-order"
                >{{ banChamp(index, player.teamId).pickTurn }}</div>
              </div>
              <div v-else class="w-5 h-5 text-left">
                <div class="text-2xl text-blue-300">-</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="index in 5" :key="index">
          <td colspan="4" class="rounded-lg bg-blue-760">
            <content-loader
              :height="54"
              :width="1160"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="12" y="12" rx="3" ry="3" width="14" height="14" />
              <rect x="12" y="32" rx="3" ry="3" width="14" height="14" />
              <circle cx="64" cy="28" r="24" />
              <rect x="96" y="10" rx="3" ry="3" width="16" height="16" />
              <rect x="96" y="31" rx="3" ry="3" width="16" height="16" />
              <rect x="124" y="32" rx="3" ry="3" width="50" height="12" />
              <rect x="124" y="13" rx="3" ry="3" width="70" height="14" />
              <rect x="640" y="35" rx="3" ry="3" width="40" height="10" />
              <rect x="691" y="33" rx="3" ry="3" width="55" height="10" />
              <rect x="647" y="8" rx="3" ry="3" width="25" height="20" />
              <rect x="696" y="12" rx="3" ry="3" width="41" height="15" />
              <rect x="860" y="35" rx="3" ry="3" width="40" height="10" />
              <rect x="911" y="33" rx="3" ry="3" width="55" height="10" />
              <rect x="867" y="8" rx="3" ry="3" width="25" height="20" />
              <rect x="916" y="12" rx="3" ry="3" width="41" height="15" />
              <circle cx="1137" cy="27" r="14" />
            </content-loader>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getPrimarRune, getSecondaryRune } from '@/helpers/summoner.js'
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader,
  },

  props: {
    team: {
      type: Array,
      required: true
    },
    ally: {
      type: Boolean,
      default: true,
    },
    gamemode: {
      type: String,
      default: '',
    }
  },

  data() {
    return {
      clashGameBanOrder: {
        100: [1, 3, 5, 8, 10],
        200: [2, 4, 6, 7, 9]
      },
      customGameBanOrder: {
        100: [1, 3, 5, 2, 4],
        200: [2, 4, 6, 1, 3]
      }
    }
  },

  computed: {
    isClash() {
      return this.gamemode === 'CLASH'
    },
    isCustom() {
      return this.gamemode === 'Custom Game'
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      live: state => state.summoner.live.match,
      liveLoaded: state => state.summoner.live.liveLoaded,
    })
  },

  methods: {
    banChamp(index, teamId) {
      if (teamId === 200 && !this.isCustom && !this.isClash) {
        index += 5
      }

      let toFind = index + 1
      if (this.isClash) {
        toFind = this.clashGameBanOrder[teamId][index]
      } else if (this.isCustom) {
        toFind = this.customGameBanOrder[teamId][index]
      }

      return this.live.bannedChampions.find(b => b.pickTurn === toFind && b.teamId === teamId)
    },
    borderChampion(id) {
      if (id === this.account.id) {
        return 'border-yellow-500'
      }

      return this.ally ? 'border-teal-400' : 'border-red-400'
    },
    getCSSVars(championId) {
      return {
        '--bg-img': `linear-gradient(90deg, rgba(42, 67, 101, 0.3) 0%, rgba(42, 67, 101, 0.8) 40%, rgba(42, 67, 101, 1) 100%),
            url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${championId}/${championId}000.jpg')`,
      }
    },
    selectRunes(player) {
      if(!player.perks)
        return
      this.displayOrHideRunes(player.perks)
    },
    getPrimarRune,
    getSecondaryRune,
     ...mapActions('cdragon', ['displayOrHideRunes']),
  }
}
</script>

<style scoped>
.w-team {
  width: 40rem;
}
.w-ranked {
  width: 13.75rem;
}

.w-bans {
  width: 5rem;
}

.live-team-row td {
  position: relative;
  z-index: 20;
}

.live-team-row td:first-child:before {
  content: "";
  position: absolute;
  z-index: -10;
  top: 0;
  left: 0;
  bottom: 0;
  width: 1160px;
  background-image: var(--bg-img);
  background-position: center;
  background-size: cover;
  border-radius: 0.5rem;
}

.runes {
  @apply transition-all duration-150 ease-in-out;
}

.runes:hover {
  filter: brightness(1.3);
}
</style>
