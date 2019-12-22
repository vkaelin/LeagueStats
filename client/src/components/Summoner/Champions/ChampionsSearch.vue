<template>
  <Ripple color="rgba(44, 82, 130, 0.7)" class="relative inline-block rounded-lg bg-blue">
    <input
      v-model="championName"
      @input="search"
      class="input-color px-2 pl-10 py-2 rounded-lg outline-none focus:bg-blue-1000"
      type="text"
      placeholder="Search Champions"
    />
    <svg class="ml-3 absolute left-0 vertical-center w-4 h-4">
      <use xlink:href="#search" />
    </svg>
  </Ripple>
</template>

<script>
import Ripple from '@/components/Ripple.vue'

export default {
  components: {
    Ripple,
  },

  data() {
    return {
      championName: ''
    }
  },

  methods: {
    search() {
      this.$emit('search-champions', this.championName)
    }
  }
}
</script>

<style scoped>
.input-color::placeholder {
  color: #fff;
}
</style>
