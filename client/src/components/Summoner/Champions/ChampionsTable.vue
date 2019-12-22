<template>
  <table class="w-full table-auto bg-blue-800 rounded-lg text-center leading-none">
    <thead>
      <tr class="heading rounded-t-lg text-sm select-none">
        <th
          @click="sortBy('index')"
          :class="sortedClasses('index')"
          class="relative px-2 py-4 rounded-tl-lg font-normal cursor-pointer hover:bg-blue-700"
        >rank</th>
        <th
          v-for="(heading, index) in headings"
          :key="`champHeading-${index}`"
          @click="sortBy(heading.props)"
          v-html="heading.name"
          :class="[{'rounded-tr-lg': index === headings.length - 1}, sortedClasses(heading.props)]"
          class="relative px-2 py-4 font-normal cursor-pointer hover:bg-blue-700"
        ></th>
      </tr>
    </thead>
    <tbody class="bg-blue-760">
      <tr
        v-for="(champion, index) in championsFull"
        :key="champion._id"
        :class="{'rounded-b-lg': index === championsFull.length - 1}"
      >
        <td
          :class="{'rounded-bl-lg': index === championsFull.length - 1}"
          class="relative px-2 py-3 bg-blue-800 border-t-table border-t-table-70 text-white text-sm"
        >{{ champion.index + 1 }}</td>
        <td class="relative px-2 py-3 bg-blue-800 border-t-table text-white text-sm">
          <div class="flex items-center">
            <div
              :style="{backgroundImage: `url('${champion.champion.icon}')`}"
              class="w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
            ></div>
            <div class="ml-2">{{ champion.champion.name }}</div>
          </div>
        </td>
        <td
          :style="bgColor(champion, '71, 132, 116', 'winrate')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.winrate|percent }}</td>
        <td
          :style="bgColor(champion, '55, 118, 179', 'playrate')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.playrate|percent }}</td>
        <td
          :style="bgColor(champion, '71, 132, 116', 'wins')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.wins }}</td>
        <td
          :style="bgColor(champion, '55, 118, 179', 'count')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.count }}</td>
        <td :style="bgColor(champion, '55, 118, 179', 'kda')" class="px-2 py-3 text-white text-sm">
          <div>{{ champion.kda|round }}</div>
          <div class="mt-1 text-xxs text-blue-200">
            {{ champion.kills/champion.count|round(1) }}
            /
            {{ champion.deaths/champion.count|round(1) }}
            /
            {{ champion.assists/champion.count|round(1) }}
          </div>
        </td>
        <td
          :style="bgColor(champion, '71, 132, 116', 'kp')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.kp|percent }}</td>
        <td
          :style="bgColor(champion, '140, 101, 182', 'minions')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.minions|round(0) }}</td>
        <td
          :style="bgColor(champion, '146, 100, 79', 'gold')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.gold|kilo }}</td>
        <td
          :style="bgColor(champion, '156, 71, 109', 'dmgChamp')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.dmgChamp|kilo }}</td>
        <td
          :style="bgColor(champion, '146, 145, 106', 'dmgTaken')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.dmgTaken|kilo }}</td>
        <td
          :style="bgColor(champion, '71, 132, 116', 'gameLength')"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.gameLength|secToTime }}</td>
        <td
          :class="{'rounded-br-lg': index === championsFull.length - 1}"
          class="px-2 py-3 text-white text-sm"
        >{{ champion.lastPlayed }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { timeDifference } from '@/helpers/functions.js'

export default {
  props: {
    champions: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      headings: [
        {
          name: 'name',
          props: 'champion.name'
        },
        {
          name: 'win rate',
          props: 'winrate'
        },
        {
          name: 'play <br> rate',
          props: 'playrate'
        },
        {
          name: 'wins',
          props: 'wins'
        },
        {
          name: 'plays',
          props: 'count'
        },
        {
          name: 'kda',
          props: 'kda'
        },
        {
          name: 'kp',
          props: 'kp'
        },
        {
          name: 'minions',
          props: 'minions'
        },
        {
          name: 'gold',
          props: 'gold'
        },
        {
          name: 'dmg <br> champ',
          props: 'dmgChamp'
        },
        {
          name: 'dmg <br> taken',
          props: 'dmgTaken'
        },
        {
          name: 'game <br> length',
          props: 'gameLength'
        },
        {
          name: 'last played',
          props: 'date'
        }
      ],
      championsFull: [],
      sortProps: 'index',
      order: -1
    }
  },

  computed: {
    totalGames() {
      return this.champions.reduce((agg, champ) => agg + champ.count, 0)
    }
  },

  mounted() {
    this.championsFull = this.champions.map((champ, index) => {
      return {
        ...champ,
        winrate: champ.wins * 100 / champ.count,
        playrate: champ.count * 100 / this.totalGames,
        kda: (champ.kills + champ.assists) / champ.deaths,
        index,
        lastPlayed: timeDifference(champ.date)
      }
    })
  },

  methods: {
    bgColor(champion, rgb, stats) {
      const value = parseFloat(champion[stats])
      const biggestValue = Math.max(...this.championsFull.map(c => parseFloat(c[stats])), 0)
      const opacity = (value / biggestValue).toFixed(2)

      return {
        backgroundColor: `rgba(${rgb}, ${opacity})`
      }
    },
    sortBy(props) {
      // Change order of the sort
      if (props === this.sortProps) {
        this.order *= -1
      } else {
        this.order = -1
      }

      this.championsFull.sort((a, b) => {
        const aProp = props.split('.').reduce((p, c) => p && p[c] || null, a)
        const bProp = props.split('.').reduce((p, c) => p && p[c] || null, b)
        let order = aProp > bProp ? this.order : this.order * -1

        // Revert order for rank and champion name
        if (props === 'index' || props === 'champion.name') {
          order *= -1
        }
        return order
      })
      this.sortProps = props
    },
    sortedClasses(props) {
      return {
        'sorted': this.sortProps === props,
        'sorted-asc': this.sortProps === props && this.order === 1,
        'sorted-desc': this.sortProps === props && this.order === -1,
      }
    }
  }

}
</script>

<style scoped>
.heading {
  box-shadow: none;
}

.border-t-table::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(190, 227, 248, 0.2);
}

.border-t-table-70::after {
  width: 70%;
}

.sorted::after {
  content: "";
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
</style>
