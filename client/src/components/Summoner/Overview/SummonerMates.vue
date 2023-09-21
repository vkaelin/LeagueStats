<template>
  <div class="mt-4 rounded-lg bg-blue-800">
    <div class="pb-2">
      <div class="heading flex items-center justify-center rounded-t-lg py-4 text-blue-200">
        <svg class="h-5 w-5" style="transform: rotate(-5deg)">
          <use xlink:href="#people" />
        </svg>
        <span class="mx-4 text-lg font-semibold uppercase">FRIENDS</span>
        <svg class="h-5 w-5" style="transform: rotate(5deg)">
          <use xlink:href="#people" />
        </svg>
      </div>
      <div v-if="hasMates" class="px-4 py-2 text-left text-sm">
        <div class="flex items-baseline text-xs font-semibold uppercase text-blue-300">
          <div class="w-2/4 text-base text-blue-400">Summoner</div>
          <div class="w-1/4">Record</div>
          <div class="w-1/4">Winrate</div>
        </div>
        <ul class="mt-1 text-gray-100">
          <li
            v-for="mate in mates.slice(0, maxMates)"
            :key="mate.name"
            class="flex items-center justify-between"
          >
            <router-link
              :to="{ name: 'summoner', params: { region: $route.params.region, name: mate.name } }"
              class="w-2/4 truncate hover:text-teal-200"
              >{{ mate.name }}</router-link
            >
            <div class="w-1/4">{{ mate.wins }} / {{ mate.losses }}</div>
            <div class="w-1/4">
              <Tooltip>
                <template #trigger>
                  <div class="h-2 cursor-pointer rounded-full bg-blue-900">
                    <div
                      :class="getWinrateColor(mate.wins, mate.count)"
                      :style="{ width: `${winrate(mate.wins, mate.count)}%` }"
                      class="h-full rounded-full"
                    ></div>
                  </div>
                </template>
                <template #default>
                  <div class="px-2 text-center text-xs text-white">
                    <div>Winrate</div>
                    <div>
                      <span
                        :class="getWinrateColor(mate.wins, mate.count, false)"
                        class="font-bold"
                        >{{ winrate(mate.wins, mate.count) | percent }}</span
                      >
                    </div>
                  </div>
                </template>
              </Tooltip>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="px-4 py-2 text-center">
        <div>No friends have been found.</div>
        <div>😕</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  data() {
    return {
      maxMates: 15,
    }
  },

  computed: {
    hasMates() {
      return this.mates.length > 0
    },
    ...mapState({
      mates: (state) => state.summoner.overview.stats.mates,
    }),
  },

  methods: {
    getWinrateColor(wins, count, background = true) {
      const winrate = this.winrate(wins, count)
      if (winrate >= 70) {
        return background ? 'bg-yellow-400' : 'text-yellow-400'
      } else if (winrate >= 60) {
        return background ? 'bg-teal-500' : 'text-teal-500'
      } else if (winrate >= 50) {
        return background ? 'bg-teal-300' : 'text-teal-300'
      }
      return background ? 'bg-teal-200' : 'text-teal-200'
    },
    winrate(wins, count) {
      return (wins * 100) / count
    },
  },
}
</script>
