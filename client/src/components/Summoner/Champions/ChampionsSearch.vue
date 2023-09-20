<template>
  <Ripple color="rgba(43, 108, 176, 0.7)" class="relative inline-block rounded-lg">
    <input
      v-model="championName"
      @input="search"
      class="px-2 py-2 pl-10 rounded-lg outline-none input-color focus:bg-blue-1000"
      type="text"
      placeholder="Search Champions"
    />
    <svg class="absolute left-0 w-4 h-4 ml-3 vertical-center">
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
