<template>
  <div class="bg-blue-800 rounded-lg">
    <div class="pb-2">
      <div class="flex items-center justify-center py-4 heading rounded-t-lg text-blue-200">
        <svg
          class="w-5 h-5"
          style="transform: rotate(-5deg);"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span class="mx-4 text-lg font-bold uppercase">FRIENDS</span>
        <svg
          class="w-5 h-5"
          style="transform: rotate(5deg);"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div v-if="hasMates" class="px-4 py-2 text-sm text-left">
        <div class="flex font-bold text-base text-teal-400">
          <div class="w-2/4">Summoner</div>
          <div class="w-1/4">W / L</div>
          <div class="w-1/4">Winrate</div>
        </div>
        <ul class="mt-1 text-gray-100">
          <li v-for="mate in mates.slice(0, maxMates)" :key="mate.name" class="flex justify-between items-center">
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

<style scoped>
.heading {
  background: linear-gradient(
    to top,
    rgb(34, 92, 155) 0%,
    rgb(34, 92, 135) 100%
  );
  box-shadow: rgba(235, 248, 255, 0.1) 0px -1px inset;
}
</style>
