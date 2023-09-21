<template>
  <router-link
    @click.native="close"
    :to="{ name: 'summoner', params: { region: player.region, name: player.name } }"
    :title="player.name"
    :class="selected ? 'bg-blue-760' : 'bg-blue-900'"
    class="bypass-click mt-1 flex w-full cursor-pointer select-none items-center justify-between rounded-md px-4 py-3 text-blue-200 shadow-md"
    role="option"
  >
    <div class="flex items-center">
      <svg v-if="favoritesList" class="h-5 w-5 text-yellow-400">
        <use xlink:href="#star-outline" />
      </svg>
      <svg v-else class="h-5 w-5">
        <use xlink:href="#time" />
      </svg>
      <div class="w-20">
        <div
          class="ml-6 inline-flex rounded bg-blue-800 px-2 py-1 text-xs font-semibold uppercase text-white"
        >
          {{ player.region }}
        </div>
      </div>
      <div
        :style="{
          backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.icon}.jpg')`,
        }"
        class="ml-2 h-6 w-6 rounded-full bg-cover bg-center"
      ></div>
      <div class="ml-2 text-base">{{ player.name }}</div>
    </div>
    <div class="flex items-center space-x-1">
      <button
        v-if="!favoritesList"
        @click.prevent="favoriteClick"
        class="flex items-center justify-center rounded-full p-2 hover:bg-blue-700 hover:text-yellow-400"
      >
        <svg class="h-4 w-4">
          <use xlink:href="#star" />
        </svg>
      </button>
      <button
        @click.prevent="closeClick"
        class="cursor-pointerhover:text-white rounded-full p-2 hover:bg-blue-700"
      >
        <svg class="h-4 w-4">
          <use xlink:href="#times" />
        </svg>
      </button>
    </div>
  </router-link>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    favoritesList: {
      type: Boolean,
      default: false,
    },
    player: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },
    closeClick() {
      if (this.favoritesList) {
        this.updateFavorite(this.player)
        return
      }
      this.removeRecentSearch(this.player)
    },
    favoriteClick() {
      this.updateFavorite(this.player)
    },
    ...mapActions('settings', ['removeRecentSearch', 'updateFavorite']),
  },
}
</script>
