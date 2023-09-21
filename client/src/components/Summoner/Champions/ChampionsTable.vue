<template>
  <table class="w-full table-fixed rounded-lg bg-blue-800 text-center leading-none">
    <thead>
      <tr class="heading select-none rounded-t-lg text-sm">
        <th
          @click="sortBy('index')"
          :class="sortedClasses('index')"
          class="relative cursor-pointer rounded-tl-lg px-2 py-4 font-normal hover:bg-blue-700"
        >
          rank
        </th>
        <th
          v-for="(heading, index) in headings"
          :key="`champHeading-${index}`"
          @click="sortBy(heading.props)"
          v-html="heading.name"
          :class="[
            {
              'rounded-tr-lg': index === headings.length - 1,
              'w-name': heading.name === 'Name',
              'w-kda': heading.name === 'KDA',
            },
            sortedClasses(heading.props),
          ]"
          class="relative cursor-pointer px-2 py-4 font-normal hover:bg-blue-700"
        ></th>
      </tr>
    </thead>
    <tbody v-if="champions.length" class="bg-blue-760">
      <tr
        v-for="(champion, index) in championsToDisplay"
        :key="champion._id"
        :class="{ 'rounded-b-lg': index === championsToDisplay.length - 1 }"
      >
        <td
          :class="{ 'rounded-bl-lg': index === championsToDisplay.length - 1 }"
          class="border-t-table relative bg-blue-800 px-2 py-3 text-sm text-white"
        >
          {{ champion.index + 1 }}
        </td>
        <td class="border-t-table relative bg-blue-800 px-2 py-3 text-sm text-white">
          <div class="flex items-center">
            <div
              :style="{ backgroundImage: `url('${champion.champion.icon}')` }"
              class="h-6 w-6 flex-shrink-0 rounded-full bg-blue-1000 bg-cover bg-center"
            ></div>
            <div class="ml-2">{{ champion.champion.name }}</div>
          </div>
        </td>
        <td :style="bgColor(champion, 'winrate')" class="px-2 py-3 text-sm text-white">
          {{ champion.winrate | percent }}
        </td>
        <td :style="bgColor(champion, 'playrate')" class="px-2 py-3 text-sm text-white">
          {{ champion.playrate | percent }}
        </td>
        <td :style="bgColor(champion, 'wins')" class="px-2 py-3 text-sm text-white">
          {{ champion.wins }}
        </td>
        <td :style="bgColor(champion, 'count')" class="px-2 py-3 text-sm text-white">
          {{ champion.count }}
        </td>
        <td :style="bgColor(champion, 'kda')" class="px-2 py-3 text-sm text-white">
          <div>{{ champion.kda | round }}</div>
          <div class="mt-1 whitespace-nowrap text-xxs text-blue-200">
            {{ (champion.kills / champion.count) | round(1) }}
            /
            {{ (champion.deaths / champion.count) | round(1) }}
            /
            {{ (champion.assists / champion.count) | round(1) }}
          </div>
        </td>
        <td :style="bgColor(champion, 'kp')" class="px-2 py-3 text-sm text-white">
          {{ champion.kp | percent }}
        </td>
        <td :style="bgColor(champion, 'minions')" class="px-2 py-3 text-sm text-white">
          {{ champion.minions | round(0) }}
        </td>
        <td :style="bgColor(champion, 'gold')" class="px-2 py-3 text-sm text-white">
          {{ champion.gold | kilo }}
        </td>
        <td :style="bgColor(champion, 'dmgChamp')" class="px-2 py-3 text-sm text-white">
          {{ champion.dmgChamp | kilo }}
        </td>
        <td :style="bgColor(champion, 'dmgTaken')" class="px-2 py-3 text-sm text-white">
          {{ champion.dmgTaken | kilo }}
        </td>
        <td :style="bgColor(champion, 'gameLength')" class="px-2 py-3 text-sm text-white">
          {{ champion.gameLength | secToTime }}
        </td>
        <td
          :class="{ 'rounded-br-lg': index === championsToDisplay.length - 1 }"
          class="px-2 py-3 text-xs text-white"
        >
          {{ champion.lastPlayed }}
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="index in 11" :key="index">
        <td colspan="14">
          <content-loader
            :height="50"
            :width="1200"
            :speed="2"
            primary-color="#17314f"
            secondary-color="#2b6cb0"
          >
            <rect x="31" y="16" rx="3" ry="3" width="20" height="20" />
            <circle cx="101" cy="26" r="12" />
            <rect x="119" y="16" rx="3" ry="3" width="50" height="20" />
            <rect x="234.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="316.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="398.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="480.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="565" y="14" rx="3" ry="3" width="40" height="10" />
            <rect x="558" y="30" rx="3" ry="3" width="55" height="10" />
            <rect x="644.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="726.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="808.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="890.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="972.5" y="16" rx="3" ry="3" width="45" height="20" />
            <rect x="1052" y="16" rx="3" ry="3" width="50" height="20" />
            <rect x="1129" y="16" rx="3" ry="3" width="60" height="20" />
          </content-loader>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { colors } from '@/data/data.js'
import { ContentLoader } from 'vue-content-loader'
import { timeDifference } from '@/helpers/functions.js'

export default {
  components: {
    ContentLoader,
  },

  props: {
    champions: {
      type: Array,
      required: true,
    },
    onlyMostPlayed: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      headings: [
        {
          name: 'Name',
          props: 'champion.name',
        },
        {
          name: 'Win <br> rate',
          props: 'winrate',
        },
        {
          name: 'Play <br> rate',
          props: 'playrate',
        },
        {
          name: 'Wins',
          props: 'wins',
        },
        {
          name: 'Plays',
          props: 'count',
        },
        {
          name: 'KDA',
          props: 'kda',
        },
        {
          name: 'KP',
          props: 'kp',
        },
        {
          name: 'Minions',
          props: 'minions',
        },
        {
          name: 'Gold',
          props: 'gold',
        },
        {
          name: 'Dmg <br> champ',
          props: 'dmgChamp',
        },
        {
          name: 'Dmg <br> taken',
          props: 'dmgTaken',
        },
        {
          name: 'Game <br> length',
          props: 'gameLength',
        },
        {
          name: 'Last <br> played',
          props: 'date',
        },
      ],
      championsFull: [],
      sortProps: 'index',
      order: -1,
    }
  },

  computed: {
    championsToDisplay() {
      return this.championsFull.filter((c) => {
        const playedEnough = this.onlyMostPlayed ? c.playrate >= 1 : true
        const searched = c.champion.name.toLowerCase().includes(this.search.toLowerCase())
        return playedEnough && searched
      })
    },
    totalGames() {
      return this.champions.reduce((agg, champ) => agg + champ.count, 0)
    },
  },

  watch: {
    champions() {
      this.updateChampionsList()
    },
    championsToDisplay() {
      this.reApplySorts()
    },
  },

  created() {
    this.updateChampionsList()
  },

  methods: {
    bgColor(champion, stats) {
      const biggestValue = Math.max(
        ...this.championsToDisplay
          .filter((c) => c[stats] !== Infinity)
          .map((c) => parseFloat(c[stats])),
        0
      )
      // Take the second biggest Value if it's an Infinity KDA
      const value = champion[stats] === Infinity ? biggestValue : parseFloat(champion[stats])
      const opacity = (value / biggestValue).toFixed(2)

      return {
        backgroundColor: `rgba(${colors[stats]}, ${opacity})`,
      }
    },
    sortBy(props) {
      // Change order of the sort
      if (props === this.sortProps) {
        this.order *= -1
      } else {
        this.order = -1
      }

      this.championsToDisplay.sort((a, b) => {
        const aProp = props.split('.').reduce((p, c) => p && p[c], a)
        const bProp = props.split('.').reduce((p, c) => p && p[c], b)
        let order = typeof aProp === 'string' ? aProp.localeCompare(bProp) : aProp - bProp

        if (this.order == -1) order *= -1

        // Revert order for rank and champion name
        if (props === 'index' || props === 'champion.name') {
          order *= -1
        }

        // Second sort by champion name
        return order || a.champion.name.localeCompare(b.champion.name)
      })
      this.sortProps = props
    },
    reApplySorts() {
      this.order *= -1
      this.sortBy(this.sortProps)
    },
    sortedClasses(props) {
      return {
        'sorted': this.sortProps === props,
        'sorted-asc': this.sortProps === props && this.order === 1,
        'sorted-desc': this.sortProps === props && this.order === -1,
      }
    },
    updateChampionsList() {
      this.championsFull = this.champions.map((champ, index) => {
        let kda =
          champ.kills === 0 && champ.assists === 0 && champ.deaths === 0
            ? 0
            : (champ.kills + champ.assists) / champ.deaths
        return {
          ...champ,
          winrate: (champ.wins * 100) / champ.count,
          playrate: (champ.count * 100) / this.totalGames,
          kda,
          index,
          lastPlayed: timeDifference(champ.date),
          show: true,
        }
      })
    },
  },
}
</script>

<style scoped>
.heading {
  box-shadow: none;
}

.border-t-table::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(190, 227, 248, 0.2);
}

.sorted::after {
  content: '';
  position: absolute;
  top: -15px;
  left: 0;
  height: 24px;
  width: 100%;
  background-color: rgb(34, 92, 135);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px 16px;
  border-radius: 0.5rem 0.5rem 0 0;
}

.sorted-asc::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='white' d='M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z'%3E%3C/path%3E%3C/svg%3E");
}

.sorted-desc::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='white' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z' /%3E%3C/svg %3E");
}

.sorted:hover::after {
  background-color: #2b6cb0;
}

.w-name {
  width: 135px;
}

.w-kda {
  width: 90px;
}
</style>
