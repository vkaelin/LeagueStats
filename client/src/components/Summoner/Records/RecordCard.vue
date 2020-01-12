<template>
  <div
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{
      backgroundImage:
        `${hover ? gradientHover : gradient},
         url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${record.champion.id}/${record.champion.id}000.jpg')`
    }"
    class="mt-6 mx-2 record-card w-full bg-cover bg-center p-2 rounded-lg leading-none"
  >
    <div class="text-5xl">{{ record[property] }}</div>
    <div>
      <span class="text-gray-500">{{ title.substr(0, title.indexOf(' ')) }}</span>
      <span :class="color" class="ml-1">{{ title.substr(title.indexOf(' ') + 1) }}</span>
    </div>
    <div class="text-sm">
      <div class="mt-3">
        <span
          :class="record.result === 'Win' ? 'text-green-400' : 'text-red-400'"
        >{{ record.result === 'Win' ? 'won' : 'lost' }}</span>
        <span class="ml-1 font-bold">{{ timeDifference(record.date) }}</span>
      </div>
      <div class="text-gray-500">
        as
        <span class="text-white font-bold">{{ record.champion.name }}</span>
      </div>
    </div>
    <div class="mt-3 text-gray-200 text-sm opacity-25">match {{ record.gameId }}</div>
  </div>
</template>

<script>
import { timeDifference } from '@/helpers/functions.js'
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    property: {
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
      gradient: 'linear-gradient(180deg, rgba(42, 67, 101, 0.3) 0%, rgba(42, 67, 101, 0.8) 60%, rgba(42, 67, 101, 1) 100%)',
      gradientHover: 'linear-gradient(rgba(42, 67, 101, 0.1) 0%, rgba(42, 67, 101, 0.3) 60%, rgba(42, 67, 101, 0.5) 100%)',
      hover: false,
    }
  },

  methods: {
    timeDifference
  }
}
</script>

<style scoped>
.record-card {
  max-width: 18rem;
}

.record-card:hover {
  filter: brightness(1.2);
}
</style>
