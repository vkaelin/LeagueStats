<template>
  <div
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style="{
      backgroundImage: `${hover ? gradientHover : gradient},
         url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${
           record.champion_id
         }/${record.champion_id}000.jpg')`,
    }"
    :class="borderColor"
    class="record-card relative mx-2 mt-6 w-full rounded-lg border bg-cover bg-center p-4 leading-none"
  >
    <div
      :class="[
        { 'bg-blue-1000 bg-opacity-75': hover },
        title.length > 15 ? 'text-sm' : 'text-base',
      ]"
      :style="{ borderColor: hover ? color : 'transparent' }"
      class="absolute left-0 top-0 ml-2 mt-2 rounded-md border border-transparent px-3 py-2 font-medium leading-4 transition-colors duration-500 ease-in-out"
    >
      <span :class="textColor" class="ml-0">{{ title }}</span>
    </div>
    <img
      :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${record.champion_id}.png`"
      :class="[{ 'scale-125 opacity-0': hover }, borderColor]"
      class="mx-auto mt-10 block h-16 w-16 transform rounded-full border-2 transition duration-500 ease-in"
      alt="Champion Played"
    />
    <div :style="{ textShadow: `-2px 1px 6px ${color}` }" class="mt-6 text-4xl">
      {{ record.amount }}
    </div>

    <div class="text-sm">
      <div class="mt-6">
        <span :class="record.result ? 'text-green-400' : 'text-red-400'">{{
          record.result ? 'Won' : 'Lost'
        }}</span>
        <span class="ml-1 font-semibold">{{ timeDifference(record.date) }}</span>
      </div>
      <div class="mt-2 text-gray-500">
        As
        <span class="font-semibold text-white">{{ record.champion.name }}</span>
      </div>
    </div>
    <div class="mt-6 text-right text-xs font-light text-gray-200 opacity-25">
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
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    textColor: {
      type: String,
      required: true,
    },
    record: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      gradient:
        'linear-gradient(180deg, rgba(42, 67, 101, 0.8) 0%, rgba(42, 67, 101, 0.95) 60%, rgba(42, 67, 101, 1) 100%)',
      gradientHover:
        'linear-gradient(rgba(42, 67, 101, 0.1) 0%, rgba(42, 67, 101, 0.3) 60%, rgba(42, 67, 101, 0.5) 100%)',
      hover: false,
      gameModes,
    }
  },

  methods: {
    timeDifference,
  },
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
