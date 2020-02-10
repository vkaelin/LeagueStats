<template>
  <div
    @mousedown="clickDropdown"
    class="mt-1 absolute z-30 w-full px-3 py-2 bg-blue-900 rounded-lg shadow"
  >
    <div v-if="favorites.length">
      <div class="text-base text-blue-100">favorites:</div>
      <div class="-mx-1 flex items-center flex-wrap text-xs leading-none">
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
      <div class="text-base text-blue-100">recent searches:</div>
      <div class="-mx-1 flex items-center flex-wrap text-xs leading-none">
        <template v-if="recentSearches.length">
          <SearchFormDropdownPlayer
            v-for="player in recentSearches"
            :key="player.name"
            :player="player"
            :favorite="isFavorite(player.name)"
          />
        </template>
        <template v-else>
          <svg class="ml-4 mt-1 w-4 h-4 text-blue-200">
            <use xlink:href="#info" />
          </svg>
          <div class="ml-1 mt-1 text-sm text-blue-200">Example :</div>
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
import SearchFormDropdownPlayer from '@/components/SearchFormDropdownPlayer.vue'

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
