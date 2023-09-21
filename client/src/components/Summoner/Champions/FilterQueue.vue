<template>
  <div class="relative inline-block text-white">
    <select
      v-model="queue"
      @change="filterQueue"
      class="block w-full cursor-pointer appearance-none rounded-md bg-blue-800 px-4 py-2 pr-8 font-semibold capitalize hover:bg-blue-700 focus:outline-none"
      style="width: 144px"
    >
      <option v-for="key in Object.keys(choices)" :key="key" :value="key">
        {{ choices[key].name }}
      </option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
    >
      <svg class="h-5 w-5 text-white">
        <use xlink:href="#chevron-down" />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    choices: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      queue: '',
    }
  },

  created() {
    // Show all queues when loading the page
    this.queue = 0
  },

  destroyed() {
    // Reload all champions stats for next user visit of the champions tab
    if (this.queue !== 0) this.championsNotLoaded()
  },

  methods: {
    filterQueue() {
      this.$emit('filter-queue', this.queue)
    },
    ...mapActions('summoner', ['championsNotLoaded']),
  },
}
</script>
