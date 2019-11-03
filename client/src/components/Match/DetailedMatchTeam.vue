<template>
  <table :class="{'rounded-b-lg overflow-hidden': !blueTeam}" class="w-full table-auto">
    <thead class="leading-none">
      <tr :class="`heading-${data.result}`" class="heading text-blue-200 font-semibold">
        <th class="py-5 border-r border-blue-700">
          <div class="flex justify-between">
            <span
              :class="data.color === 'Blue' ? 'text-teal-400' : 'text-red-400'"
              class="pl-2"
            >{{ data.color }} Team</span>
            <span>{{ `${data.teamStats.kills}/${data.teamStats.deaths}/${data.teamStats.assists}` }}</span>
            <div class="flex pr-2">
              <svg class="w-4 h-4 items-center">
                <use xlink:href="#gold" />
              </svg>
              <span class="ml-2px">{{ +(data.teamStats.gold / 1000).toFixed(2) + 'k' }}</span>
            </div>
          </div>
        </th>
        <th class="px-2 py-5 text-sm">K</th>
        <th class="px-2 py-5 text-sm">D</th>
        <th class="px-2 py-5 text-sm">A</th>
        <th class="px-2 py-5 text-sm">cs/m</th>
        <th class="px-2 py-5 text-sm">vs/m</th>
        <th class="px-2 py-5 text-sm">gold</th>
        <th class="px-2 py-5 text-sm">
          dmg
          <br />champ
        </th>
        <th class="px-2 py-5 text-sm">
          dmg
          <br />obj
        </th>
        <th class="px-2 py-5 text-sm">
          dmg
          <br />taken
        </th>
        <th class="px-2 py-5 text-sm">kp</th>
      </tr>
    </thead>
    <tbody :class="[{'border-b border-blue-700': blueTeam}, data.result]" class="leading-none">
      <tr v-for="(player, index) in data.players" :key="player.name + index">
        <td class="py-2 border-r border-blue-700">
          <div class="px-2 flex justify-between">
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
                class="ml-3 relative w-8 h-8 bg-cover bg-center bg-blue-1000 rounded-full"
              >
                <div
                  class="absolute level-position bottom-0 w-5 h-5 bg-blue-900 rounded-full text-teal-100 text-xs"
                >
                  <span class="leading-relaxed">{{ player.level }}</span>
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
            <div>
              <div v-if="false" class="ml-2">
                <svg class="w-6 h-6">
                  <use xlink:href="#rank-silver" />
                </svg>
                <div class="text-blue-200 text-xs">S2</div>
              </div>
              <div class="ml-2 flex items-center">
                <div
                  v-for="(item, indexItem) in player.items"
                  :key="indexItem"
                  :style="{backgroundImage: item}"
                  class="ml-2px w-6 h-6 rounded-md bg-blue-1000 bg-center bg-cover"
                ></div>
              </div>
            </div>
          </div>
        </td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.kills }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.deaths }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.assists }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.percentStats.minions }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.percentStats.vision }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.stats.gold }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.stats.dmgChamp }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.stats.dmgObj }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.stats.dmgTaken }}</td>
        <td
          :class="{'border-b border-blue-700': displayBorderbottom(index)}"
          class="p-2 text-white text-xs font-semibold"
        >{{ player.kp }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      blueTeam: this.data.color === 'Blue'
    }
  },

  computed: {
    ...mapGetters('ddragon', ['version']),
  },

  methods: {
    displayBorderbottom(index) {
      return this.blueTeam || index !== this.data.players.length - 1
    }
  }
}
</script>

<style scoped>
.heading {
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

.team::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.Win {
  background-image: linear-gradient(
    90deg,
    rgba(1, 97, 28, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.Fail {
  background-image: linear-gradient(
    90deg,
    rgba(140, 0, 0, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.Remake {
  background-image: linear-gradient(
    90deg,
    rgba(233, 169, 75, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.level-position {
  left: -10px;
}
</style>
