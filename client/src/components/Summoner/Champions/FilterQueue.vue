<template>
  <div class="relative inline-block text-white">
    <select
      v-model="queue"
      @change="filterQueue"
      class="block appearance-none bg-blue-800 hover:bg-blue-700 w-full px-4 py-2 pr-8 rounded-md font-semibold lowercase cursor-pointer focus:outline-none"
    >
      <option v-for="(key) in Object.keys(choices)" :key="key" :value="key">{{ choices[key].name }}</option>
    </select>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
    >
      <svg class="text-white w-5 h-5">
        <use xlink:href="#chevron-down" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    choices: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      queue: ''
    }
  },

  created() {
    // Show all queues when loading the page
    this.queue = -1
  },

  methods: {
    filterQueue() {
      this.$emit('filter-queue', this.queue)
    }
  }
}
</script>
