<template>
  <div
    :class="oneRow ? 'ml-2 items-center' : 'items-2-rows flex-wrap'"
    class="flex"
  >
    <Tooltip v-for="(item, index) in items" :key="index">
      <template v-slot:trigger>
        <div
          :style="{ backgroundImage: itemLink(item) }"
          :class="[
            oneRow ? 'ml-2px w-6 h-6' : 'ml-1 w-8 h-8',
            { 'cursor-pointer': item !== null },
          ]"
          class="bg-center bg-cover rounded-md bg-blue-1000"
        ></div>
      </template>
      <template v-if="item !== null" v-slot:default>
        <div class="flex max-w-md p-2 text-xs text-left text-white select-none">
          <div
            :style="{ backgroundImage: itemLink(item) }"
            class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-blue-1000"
          ></div>
          <div class="ml-2 leading-none">
            <div class="text-base">{{ item.name }}</div>
            <div class="mt-1">
              <span class="text-blue-200">Price:</span>
              <span class="ml-1 text-sm font-semibold text-yellow-500">{{
                item.price
              }}</span>
            </div>
            <div
              v-html="item.description"
              class="mt-1 font-light text-blue-200 item-description"
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
    Tooltip
  },

  props: {
    oneRow: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    }
  },

  methods: {
    itemLink(item) {
      if (!item) {
        return null
      }

      // Fix to still make work the old items links (before season 11)
      const originalUrl = item.image
      const newUrl = originalUrl.includes('/global/default/assets/items/') ? originalUrl : originalUrl.replace('latest', '10.22')
      return `url('${newUrl}')`
    }
  }
}
</script>

<style scoped>
.items-2-rows {
  width: 7rem;
  height: 4.5rem;
}

.item-description >>> stats {
  color: #fff;
  line-height: 1.25;
}

.item-description >>> br + br {
  display: none;
}

.item-description >>> stats br {
  display: block;
}

.item-description >>> unique,
.item-description >>> passive,
.item-description >>> active {
  color: #fff;
  font-weight: bold;
  display: block;
  margin-top: 0.5rem;
}

.item-description >>> font {
  color: #63b3ed;
}
</style>