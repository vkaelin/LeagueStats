<template>
  <div class="mt-4 bg-blue-800 rounded-lg">
    <div class="pb-2">
      <div class="flex items-center justify-center py-4 heading rounded-t-lg text-blue-200">
        <svg class="w-5 h-5" style="transform: rotate(-5deg);">
          <use xlink:href="#people" />
        </svg>
        <span class="mx-4 text-lg font-bold uppercase">FRIENDS</span>
        <svg class="w-5 h-5" style="transform: rotate(5deg);">
          <use xlink:href="#people" />
        </svg>
      </div>
      <div v-if="hasMates" class="px-4 py-2 text-sm text-left">
        <div class="flex font-bold text-base text-blue-400">
          <div class="w-2/4">Summoner</div>
          <div class="w-1/4">W / L</div>
          <div class="w-1/4">Winrate</div>
        </div>
        <ul class="mt-1 text-gray-100">
          <li
            v-for="mate in mates.slice(0, maxMates)"
            :key="mate.name"
            class="flex justify-between items-center"
          >
            <router-link
              :to="{ name: 'summoner', params: { region: $route.params.region, name: mate.name }}"
              class="w-2/4 hover:text-teal-200"
            >{{ mate.name }}</router-link>
            <div class="w-1/4">{{ mate.wins }} / {{ mate.losses }}</div>
            <div class="w-1/4">
              <Dropdown>
                <template v-slot:trigger>
                  <div class="bg-blue-900 rounded-full h-2 cursor-pointer">
                    <div
                      :class="getWinrateColor(mate.winrate)"
                      :style="{width: mate.winrate}"
                      class="rounded-full h-full"
                    ></div>
                  </div>
                </template>
                <template v-slot:default>
                  <div class="px-2 text-white text-center text-xs">
                    <div>Winrate</div>
                    <div>
                      <span
                        :class="getWinrateColor(mate.winrate, false)"
                        class="font-bold"
                      >{{ mate.winrate }}</span>
                    </div>
                  </div>
                </template>
              </Dropdown>
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
import Dropdown from '@/components/Dropdown.vue'

export default {
  components: {
    Dropdown,
  },

  data() {
    return {
      maxMates: 15
    }
  },

  computed: {
    hasMates() {
      return this.mates.length > 0
    },
    ...mapState({
      mates: state => state.summoner.infos.mates
    }),
  },

  methods: {
    getWinrateColor(winrate, background = true) {
      winrate = winrate.slice(0, -1)
      if (winrate >= 70) {
        return background ? 'bg-yellow-400' : 'text-yellow-400'
      } else if (winrate >= 60) {
        return background ? 'bg-teal-500' : 'text-teal-500'
      } else if (winrate >= 50) {
        return background ? 'bg-teal-300' : 'text-teal-300'
      }
      return background ? 'bg-teal-200' : 'text-teal-200'
    }
  }
}
</script>
