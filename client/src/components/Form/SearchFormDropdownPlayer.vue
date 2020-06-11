<template>
  <router-link
    :to="{ name: 'summoner', params: { region: player.region, name: player.name }}"
    :title="player.name"
    class="flex items-center p-1 mt-1 ml-1 text-blue-200 cursor-pointer select-none bg-blue-1000 hover:bg-blue-800"
  >
    <div class="p-1 font-bold text-white uppercase bg-blue-800 rounded text-xxs">{{ player.region }}</div>
    <div
      :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.icon}.jpg')`}"
      class="w-5 h-5 ml-1 bg-center bg-cover rounded"
    ></div>
    <div class="ml-1 truncate max-w-12">{{ player.name }}</div>
    <svg
      @click.prevent="favoriteClick"
      :class="favorite ? 'text-yellow-400' : 'hover:text-yellow-400 cursor-pointer'"
      class="ml-2 w-3p5 h-3p5"
    >
      <use xlink:href="#star" />
    </svg>
    <svg @click.prevent="closeClick" class="ml-2 cursor-pointer w-3p5 h-3p5 hover:text-white">
      <use xlink:href="#times" />
    </svg>
  </router-link>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    favorite: {
      type: Boolean,
      default: false,
    },
    favoritesList: {
      type: Boolean,
      default: false,
    },
    player: {
      type: Object,
      required: true,
    },
  },

  methods: {
    closeClick() {
      if (this.favoritesList) {
        this.updateFavorite(this.player)
        return
      }
      this.removeRecentSearch(this.player)
    },
    favoriteClick() {
      if (this.favorite) {
        return
      }
      this.updateFavorite(this.player)
    },
    ...mapActions('settings', ['removeRecentSearch', 'updateFavorite'])
  },
}
</script>
