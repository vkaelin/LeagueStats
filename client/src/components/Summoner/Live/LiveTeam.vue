<template>
  <div class="mt-2 bg-blue-800 px-5 py-4 rounded-lg">
    <table
      class="w-full table-fixed text-center leading-none"
      style="border-collapse:separate; border-spacing:0 0.5rem;"
    >
      <thead>
        <tr class="text-left">
          <th
            :class="[ally ? 'text-teal-400 ' : 'text-red-400 ']"
            class="w-team font-semibold"
          >{{ ally ? 'Ally' : 'Enemy' }} Team</th>
          <th class="w-ranked text-blue-200 text-sm font-normal">SoloQ Stats</th>
          <th class="w-ranked text-blue-200 text-sm font-normal">Flex Stats</th>
          <th class="w-bans px-2 text-right text-blue-200 text-sm font-normal">Bans</th>
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
              <div class="flex flex-col items-center">
                <div
                  :style="{backgroundImage: `url('${player.runes.primaryRune}')`}"
                  class="w-6 h-6 bg-cover bg-center"
                ></div>
                <div
                  :style="{backgroundImage: `url('${player.runes.secondaryRune}')`}"
                  class="mt-1 w-3 h-3 bg-cover bg-center"
                ></div>
              </div>
              <div
                :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${player.championId}.png')`}"
                :class="borderChampion(player.summonerId)"
                class="ml-2 w-12 h-12 bg-cover bg-center bg-blue-1000 border-2 rounded-full"
              ></div>
              <div class="ml-2 flex flex-col">
                <div
                  :style="{backgroundImage: `url(${getSummonerLink(player.spell1Id)})`}"
                  class="w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
                <div
                  :style="{backgroundImage: `url(${getSummonerLink(player.spell2Id)})`}"
                  class="mt-1 w-4 h-4 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
              </div>
              <div class="ml-3 text-left text-sm leading-tight">
                <router-link
                  v-if="!player.bot"
                  :to="{ name: 'summoner', params: { region: $route.params.region, name: player.summonerName }}"
                  :class="[player.summonerId === account.id ? 'text-yellow-500' : 'hover:text-blue-200']"
                  class="font-semibold"
                >{{ player.summonerName }}</router-link>
                <div class="text-xs">Level {{ player.level }}</div>
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
                    class="mt-2px text-blue-300 text-xs font-semibold"
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
                <div class="-mt-1 text-blue-300 text-2xl">-</div>
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
                    class="mt-2px text-blue-300 text-xs font-semibold"
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
                <div class="-mt-1 text-blue-300 text-2xl">-</div>
              </div>
            </div>
          </td>
          <td class="py-1 text-right rounded-r-lg">
            <div class="px-2 inline-block">
              <div
                v-if="live.bannedChampions.length"
                :class="[ally ? 'ban-blue border-teal-500' : 'ban-red border-red-500']"
                class="relative ban border-2 rounded-full"
              >
                <div
                  :style="[
                    banChamp(index, player.teamId) ? 
                      {backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${banChamp(index, player.teamId).championId}.png')`}
                      : ''
                  ]"
                  class="ban-img w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
                ></div>
                <div
                  :class="[ally ? 'text-teal-100 bg-teal-500' : 'text-red-100 bg-red-500']"
                  class="absolute ban-order w-4 h-4 flex items-center justify-center text-xs font-bold rounded-full"
                >{{ banChamp(index, player.teamId).pickTurn }}</div>
              </div>
              <div v-else class="w-5 h-5 text-left">
                <div class="text-blue-300 text-2xl">-</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="index in 5" :key="index">
          <td colspan="4" class="bg-blue-760 rounded-lg">
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
import { mapState } from 'vuex'
import { getSummonerLink } from '@/helpers/summoner.js'
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
      customGameBanOrder: {
        100: [1, 3, 5, 2, 4],
        200: [2, 4, 6, 1, 3]
      }
    }
  },

  computed: {
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
      if (teamId === 200 && !this.isCustom) {
        index += 5
      }

      const toFind = this.isCustom ? this.customGameBanOrder[teamId][index] : index + 1
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
    getSummonerLink,
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
</style>
