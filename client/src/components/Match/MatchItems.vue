<template>
  <div :class="oneRow ? 'ml-2 items-center' : 'items-2-rows flex-wrap'" class="flex">
    <Tooltip v-for="(item, index) in items" :key="index">
      <template #trigger>
        <div class="relative">
          <div
            :style="{ backgroundImage: itemLink(item) }"
            :class="[
              oneRow ? 'ml-0.5 h-6 w-6' : 'ml-1 h-8 w-8',
              { 'cursor-pointer': item !== null },
            ]"
            class="relative z-10 rounded-md bg-blue-1000 bg-cover bg-center"
          >
            <div v-if="isMythic(item)" class="mythic-inside h-full w-full rounded-md"></div>
          </div>
          <div
            v-if="isMythic(item)"
            class="mythic absolute rounded-md"
            :class="oneRow ? 'mythic-sm' : 'mythic-xl'"
          ></div>
        </div>
      </template>
      <template v-if="item !== null" #default>
        <div class="flex max-w-md select-none p-2 text-left text-xs text-white">
          <div
            :style="{ backgroundImage: itemLink(item) }"
            class="ml-1 h-12 w-12 flex-shrink-0 rounded-md bg-blue-1000 bg-cover bg-center"
          ></div>
          <div class="ml-2 leading-none">
            <div class="text-base">{{ itemName(item.name) }}</div>
            <div class="mt-1">
              <span class="text-blue-200">Price:</span>
              <span class="ml-1 text-sm font-semibold text-yellow-500">{{ item.price }}</span>
            </div>
            <div
              v-html="item.description"
              class="item-description mt-1 font-light text-blue-200"
            ></div>
          </div>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    oneRow: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
  },

  methods: {
    isMythic(item) {
      return item && item.isMythic
    },
    itemLink(item) {
      if (!item) {
        return null
      }

      // Fix to still make work the old items links (before season 11)
      const originalUrl = item.image
      const newUrl = originalUrl.includes('/global/default/assets/items/')
        ? originalUrl
        : originalUrl.replace('latest', '10.22')
      return `url('${newUrl}')`
    },
    itemName(name) {
      // Remove placeholders in item names (e.g.: for Ornn items)
      return name.replace(/%[^%]*%/, '')
    },
  },
}
</script>

<style scoped>
.mythic {
  background: linear-gradient(
    195deg,
    rgb(255, 197, 47) 0%,
    rgb(255, 231, 146) 50%,
    rgb(214, 128, 0) 100%
  );
}

.mythic-sm {
  top: -1px;
  left: 1px;
  width: calc(1.5rem + 2px);
  height: calc(1.5rem + 2px);
}

.mythic-xl {
  top: -2px;
  left: 2px;
  width: calc(2rem + 4px);
  height: calc(2rem + 4px);
}

.mythic-inside {
  box-shadow: rgb(26, 32, 44) 0px 0px 0px 1px inset;
}

.items-2-rows {
  width: 7rem;
  height: 4.5rem;
}

.item-description >>> stats {
  @apply leading-tight text-white;
}

.item-description >>> br + br {
  @apply hidden;
}

.item-description >>> stats br {
  @apply block;
}

.item-description >>> li {
  @apply mt-2 block;
}

.item-description >>> passive {
  @apply font-normal text-white;
}

.item-description >>> active {
  @apply mt-2 inline-block font-bold text-white;
}

.item-description >>> unique,
.item-description >>> li > passive:first-child,
.item-description >>> rarityMythic {
  @apply mt-2 block font-bold text-white;
}

.item-description >>> font {
  @apply text-blue-400;
}

.item-description >>> rules {
  @apply mt-2 inline-block italic text-blue-400;
}

.item-description >>> rules active {
  @apply inline font-normal text-white;
}
</style>
