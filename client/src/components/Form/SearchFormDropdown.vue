<template>
  <div
    @mousedown="clickDropdown"
    class="absolute z-30 w-full px-3 py-2 mt-2 bg-blue-900 border border-blue-800 rounded-lg shadow"
  >
    <div v-if="favorites.length">
      <div class="text-base text-blue-100">Favorites:</div>
      <div class="flex flex-wrap items-center -mx-1 text-xs leading-none">
        <SearchFormDropdownPlayer
          v-for="player in favorites"
          :key="player.name"
          :player="player"
          :favorite="true"
          :favorites-list="true"
        />
      </div>
    </div>
    <div :class="{'mt-2': favorites.length}">
      <div class="text-base text-blue-100">Recent searches:</div>
      <div class="flex flex-wrap items-center -mx-1 text-xs leading-none">
        <template v-if="recentSearches.length">
          <SearchFormDropdownPlayer
            v-for="player in recentSearches"
            :key="player.name"
            :player="player"
            :favorite="isFavorite(player.name)"
          />
        </template>
        <template v-else>
          <svg class="w-4 h-4 mt-1 ml-4 text-blue-200">
            <use xlink:href="#info" />
          </svg>
          <div class="mt-1 ml-1 text-sm text-blue-200">Example :</div>
          <SearchFormDropdownPlayer
            :player="{name: 'Alderiate', icon: 1150, region: 'euw'}"
            :favorite="false"
            class="ml-2"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchFormDropdownPlayer from '@/components/Form/SearchFormDropdownPlayer.vue'

export default {
  components: {
    SearchFormDropdownPlayer,
  },

  computed: {
    ...mapState('settings', ['favorites', 'recentSearches'])
  },

  methods: {
    clickDropdown() {
      this.$emit('click-dropdown')
    },
    isFavorite(name) {
      return this.favorites.some(s => s.name === name)
    }
  }
}
</script>
