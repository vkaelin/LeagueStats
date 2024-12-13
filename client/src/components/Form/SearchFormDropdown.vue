<template>
  <div
    :class="homepage ? 'mt-2' : 'mt-1'"
    class="absolute z-30 w-full rounded-lg bg-blue-800 shadow-md"
  >
    <div class="shadow">
      <div class="pt-3">
        <div v-if="!homepage" class="bypass-click relative px-3">
          <button class="absolute h-full w-12 text-blue-200 hover:text-white" type="submit">
            <svg class="vertical-center horizontal-center absolute h-4 w-4">
              <use xlink:href="#search" />
            </svg>
          </button>
          <input
            ref="input"
            @input="$emit('input', $event.target.value)"
            :value="value"
            class="summoner-input w-full rounded-md border border-blue-500 bg-blue-700 py-2 pl-12 pr-32 placeholder-blue-200 placeholder-opacity-75 outline-none focus:bg-blue-760"
            type="text"
            placeholder="Search summoner"
            spellcheck="false"
          />
          <button
            v-if="!homepage && value.length"
            @click="$emit('input', '')"
            class="vertical-center absolute right-0 mr-24 flex items-center justify-center rounded-full p-1 text-blue-200 hover:text-white"
            type="button"
          >
            <svg class="h-4 w-4">
              <use xlink:href="#times" />
            </svg>
          </button>
          <div v-if="!homepage" ref="region-dropdown">
            <SearchFormRegion @toggle="toggle" :dropdown="dropdown" :homepage="homepage" />
          </div>
        </div>
        <div
          :style="{ maxHeight: homepage ? '300px' : '480px' }"
          class="light-scrollbar overflow-y-auto px-3 pb-6"
        >
          <div :class="{ 'mt-4': !homepage }">
            <div v-if="recentSearches.length" class="text-base text-blue-100">Recent</div>
            <div v-else-if="favorites.length === 0" class="flex items-center space-x-2">
              <svg class="h-4 w-4 text-blue-100">
                <use xlink:href="#info" />
              </svg>
              <div class="text-base text-blue-100">Summoner example</div>
            </div>
            <div
              ref="searches"
              @keydown.prevent.stop.enter="onOptionSelect()"
              @keydown.prevent.stop.space="onOptionSelect()"
              role="listbox"
              tabindex="-1"
              class="flex flex-wrap items-center text-xs leading-none focus:outline-none"
            >
              <template v-if="recentSearches.length">
                <SearchFormDropdownPlayer
                  v-for="(player, index) in recentSearchesSliced"
                  :key="player.name + player.region"
                  @close="close"
                  @mousemove.native="onHover(index + 1)"
                  :selected="index === selected - 1"
                  :player="player"
                  :favorites-list="false"
                />
              </template>
              <template v-else-if="favorites.length === 0">
                <SearchFormDropdownPlayer
                  @close="close"
                  @mousemove.native="onHover(1)"
                  :player="{ name: 'KC NEXT ADKING#EUW', icon: 29, region: 'euw' }"
                  :selected="selected === 1"
                  :favorites-list="false"
                />
              </template>
            </div>
          </div>
          <div v-if="favorites.length" :class="{ 'mt-4': recentSearches.length }">
            <div class="text-base text-blue-100">Favorites</div>
            <div
              ref="favorites"
              @keydown.prevent.stop.enter="onOptionSelect()"
              @keydown.prevent.stop.space="onOptionSelect()"
              role="listbox"
              tabindex="-1"
              class="flex flex-wrap items-center text-xs leading-none"
            >
              <SearchFormDropdownPlayer
                v-for="(player, index) in favorites"
                :key="player.name + player.region"
                @close="close"
                @mousemove.native="onHover(index + recentSearchesCount + 1)"
                :player="player"
                :selected="index === selected - 1 - recentSearchesCount"
                :favorites-list="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-b-md bg-blue-1000 px-4 py-4">
        <div class="flex select-none items-center justify-between text-xxs">
          <div class="space-x-2">
            <span class="key rounded-md bg-blue-100 text-xs font-medium text-blue-700">Enter</span>
            <span>to select</span>
          </div>
          <div class="space-x-2">
            <span class="key rounded-md bg-blue-100 text-xs font-medium text-blue-700"
              >&darr; &uarr;</span
            >
            <span>to navigate</span>
          </div>
          <div class="space-x-2">
            <span class="key rounded-md bg-blue-100 text-xs font-medium text-blue-700">Escape</span>
            <span>to close</span>
          </div>
          <div class="space-x-2">
            <span class="key rounded-md bg-blue-100 text-xs font-medium text-blue-700">CTRL K</span>
            <span>to open</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchFormRegion from '@/components/Form/SearchFormRegion.vue'
import SearchFormDropdownPlayer from '@/components/Form/SearchFormDropdownPlayer.vue'

export default {
  components: {
    SearchFormRegion,
    SearchFormDropdownPlayer,
  },

  props: {
    dropdown: {
      type: Boolean,
      default: false,
    },
    homepage: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      bypassKeys: ['Esc', 'Escape', 'ArrowUp', 'ArrowDown', 'Enter', 'Space', '/'],
      favoritesCount: null,
      totalCount: null,
      recentSearchesCount: null,
      selected: null,
    }
  },

  computed: {
    allPlayers() {
      return [...this.recentSearchesSliced, ...this.favorites]
    },
    recentSearchesSliced() {
      return this.recentSearches.slice(0, 4)
    },
    ...mapState('settings', ['favorites', 'recentSearches']),
  },

  created() {
    window.addEventListener('mousedown', this.handleClick)
    window.addEventListener('keydown', this.handleKeyDown)
  },

  mounted() {
    const input = document.querySelector('.summoner-input')
    input.focus()
    this.recentSearchesCount = this.$refs.searches ? this.$refs.searches.children.length : 0
    this.favoritesCount = this.$refs.favorites ? this.$refs.favorites.children.length : 0
    this.totalCount = this.recentSearchesCount + this.favoritesCount

    if (this.totalCount > 0) {
      this.selected = 1
    }
  },

  beforeDestroy() {
    window.removeEventListener('mousedown', this.handleClick)
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  methods: {
    close() {
      this.$emit('close')
      // Close region dropdown if open while closing global dropdown
      if (this.dropdown) {
        this.toggle()
      }
    },
    handleClick(e) {
      const bypassElements = document.querySelectorAll('.bypass-click')
      for (const element of bypassElements) {
        if (e.target === element || element.contains(e.target)) return
      }

      // Click outside to close region dropdown
      if (
        this.$refs['region-dropdown'] &&
        e.target !== this.$refs['region-dropdown'] &&
        !this.$refs['region-dropdown'].contains(e.target) &&
        this.dropdown
      ) {
        this.toggle()
      }

      e.preventDefault()
      this.$refs.searches.focus()
    },
    handleKeyDown(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.$refs.searches.focus()
        if (e.key === 'ArrowUp') {
          this.onArrowUp()
        } else {
          this.onArrowDown()
        }
      }

      if (this.bypassKeys.includes(e.key) || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        return
      }
      const input = document.querySelector('.summoner-input')
      input.focus()
    },
    onArrow() {
      const scrollIntoBlock = this.selected === 1 ? 'end' : this.selected >= 7 ? 'start' : 'nearest'
      if (this.selected > this.recentSearchesCount) {
        this.$refs.favorites.children[this.selected - this.recentSearchesCount - 1].scrollIntoView({
          block: scrollIntoBlock,
        })
      } else {
        this.$refs.searches.children[this.selected - 1].scrollIntoView({ block: scrollIntoBlock })
      }
    },
    onArrowUp() {
      this.selected = this.selected - 1 < 1 ? this.totalCount : this.selected - 1
      this.onArrow()
    },
    onArrowDown() {
      this.selected = this.selected + 1 > this.totalCount ? 1 : this.selected + 1
      this.onArrow()
    },
    onHover(id) {
      this.selected = id

      if (this.$refs.searches && this.$refs.searches !== document.activeElement) {
        this.$refs.searches.focus()
        this.onArrow()
      }
    },
    onOptionSelect() {
      console.log('OPTION SELECT')
      if (this.selected === null) {
        return
      }
      const player = this.allPlayers[this.selected - 1]
      this.$router.push(`/summoner/${player.region}/${player.name}`).catch(() => {})
      this.close()
    },
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>

<style scoped>
.key {
  padding: 0.2rem 0.45rem;
  box-shadow:
    0 2px 0 0 #3182ce,
    0 5px 3px 0 rgba(0, 0, 0, 0.1),
    0 5px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
