<template>
  <Ripple color="rgba(43, 108, 176, 0.7)" class="relative inline-block rounded-lg">
    <input
      v-model="championName"
      @input="search"
      class="input-color rounded-lg px-2 py-2 pl-10 outline-none focus:bg-blue-1000"
      type="text"
      placeholder="Search Champions"
    />
    <svg class="vertical-center absolute left-0 ml-3 h-4 w-4">
      <use xlink:href="#search" />
    </svg>
  </Ripple>
</template>

<script>
import Ripple from '@/components/Common/Ripple.vue'

export default {
  components: {
    Ripple,
  },

  data() {
    return {
      championName: '',
    }
  },

  methods: {
    search() {
      this.$emit('search-champions', this.championName)
    },
  },
}
</script>

<style scoped>
.input-color::placeholder {
  color: #fff;
  font-weight: 300;
}
</style>
