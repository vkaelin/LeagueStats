<template>
  <router-link
    @click.native="close"
    :to="{ name: 'summoner', params: { region: player.region, name: player.name } }"
    :title="player.name"
    :class="selected ? 'bg-blue-760' : 'bg-blue-900'"
    class="flex items-center justify-between w-full px-4 py-3 mt-1 text-blue-200 rounded-md shadow-md cursor-pointer select-none bypass-click"
    role="option"
  >
    <div class="flex items-center">
      <svg v-if="favoritesList" class="w-5 h-5 text-yellow-400">
        <use xlink:href="#star-outline" />
      </svg>
      <svg v-else class="w-5 h-5">
        <use xlink:href="#time" />
      </svg>
      <div class="w-20">
        <div
          class="inline-flex px-2 py-1 ml-6 text-xs font-semibold text-white uppercase bg-blue-800 rounded"
        >
          {{ player.region }}
        </div>
      </div>
      <div
        :style="{
          backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.icon}.jpg')`,
        }"
        class="w-6 h-6 ml-2 bg-center bg-cover rounded-full"
      ></div>
      <div class="ml-2 text-base">{{ player.name }}</div>
    </div>
    <div class="flex items-center space-x-1">
      <button
        v-if="!favoritesList"
        @click.prevent="favoriteClick"
        class="flex items-center justify-center p-2 rounded-full hover:text-yellow-400 hover:bg-blue-700"
      >
        <svg class="w-4 h-4">
          <use xlink:href="#star" />
        </svg>
      </button>
      <button
        @click.prevent="closeClick"
        class="p-2 rounded-full cursor-pointerhover:text-white hover:bg-blue-700"
      >
        <svg class="w-4 h-4">
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
