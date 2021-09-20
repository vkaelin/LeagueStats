<template>
  <div
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{
      backgroundImage:
        `${hover ? gradientHover : gradient},
         url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${record.champion_id}/${record.champion_id}000.jpg')`
    }"
    :class="borderColor"
    class="relative w-full p-4 mx-2 mt-6 leading-none bg-center bg-cover border rounded-lg record-card"
  >
    <div
      :class="[
        {'bg-blue-1000 bg-opacity-75': hover},
        title.length > 15 ? 'text-sm' : 'text-base'
      ]"
      :style="{borderColor: hover ? color : 'transparent'}"
      class="absolute top-0 left-0 px-3 py-2 mt-2 ml-2 font-medium leading-4 transition-colors duration-500 ease-in-out border border-transparent rounded-md"
    >
      <span :class="textColor" class="ml-0">{{ title }}</span>
    </div>
    <img
      :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${record.champion_id}.png`"
      :class="[{'opacity-0 scale-125': hover}, borderColor]"
      class="block w-16 h-16 mx-auto mt-10 transition duration-500 ease-in transform border-2 rounded-full"
      alt="Champion Played"
    />
    <div :style="{textShadow: `-2px 1px 6px ${color}`}" class="mt-6 text-4xl">{{ record.amount }}</div>

    <div class="text-sm">
      <div class="mt-6">
        <span
          :class="record.result ? 'text-green-400' : 'text-red-400'"
        >{{ record.result ? 'Won' : 'Lost' }}</span>
        <span class="ml-1 font-semibold">{{ timeDifference(record.date) }}</span>
      </div>
      <div class="mt-2 text-gray-500">
        As
        <span class="font-semibold text-white">{{ record.champion.name }}</span>
      </div>
    </div>
    <div class="mt-6 text-xs font-light text-right text-gray-200 opacity-25">
      <span v-if="hover">{{ record.id }}</span>
      <span v-else>{{ gameModes[record.gamemode].name }}</span>
    </div>
  </div>
</template>

<script>
import { gameModes } from '@/data/data.js'
import { timeDifference } from '@/helpers/functions.js'

export default {
  props: {
    borderColor: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      required: true
    },
    record: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      gradient: 'linear-gradient(180deg, rgba(42, 67, 101, 0.8) 0%, rgba(42, 67, 101, 0.95) 60%, rgba(42, 67, 101, 1) 100%)',
      gradientHover: 'linear-gradient(rgba(42, 67, 101, 0.1) 0%, rgba(42, 67, 101, 0.3) 60%, rgba(42, 67, 101, 0.5) 100%)',
      hover: false,
      gameModes,
    }
  },

  methods: {
    timeDifference
  }
}
</script>

<style scoped>
.record-card {
  max-width: 11rem;
}

.record-card:hover {
  filter: brightness(1.2);
}
</style>
