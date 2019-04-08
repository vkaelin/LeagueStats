<template>
  <form @submit.prevent="formSubmit" class="flex">
    <div class="relative">
      <v-icon name="search" class="absolute ml-2 vertical-center"></v-icon>
      <input 
        type="text" 
        placeholder="Entre un pseudo." 
        class="bg-gray-300 p-2 rounded-l outline-none focus:bg-gray-400 pl-8 pr-16" 
        v-model="summoner"
      >
      <div class="absolute right-0 vertical-center flex items-center h-full mr-1">
        <div 
          @click="dropdown = !dropdown"
          class="cursor-pointer flex items-center px-2 py-1 rounded-lg hover:bg-gray-200"
        >
          <span class="selected">{{ selectedRegion }}</span>
          <v-icon name="caret-down" class="ml-1"></v-icon>
        </div>
      </div>

      <div
        v-if="dropdown"
        @click="dropdown = !dropdown"
        class="absolute right-0 text-white rounded-b-lg shadow cursor-pointer"
      >
        <div 
          v-for="(region, index) in regions" 
          :key="region"
          @click="selectedRegion = region"
          class="px-4 py-1 text-sm bg-teal-500 hover:bg-teal-400"
          :class="classRegions(index)"
        >
          {{ region }}
        </div>
      </div>

    </div>

    <button class="bg-teal-500 p-2 text-white rounded-r hover:bg-teal-400" type="submit">Rechercher</button>
  </form>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
      summoner: '',
      dropdown: false,
      regions: ['BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'TR', 'RU'],
      selectedRegion: 'EUW'
    };
  },
  methods: {
    classRegions(index) {
      return {
        'rounded-t-lg': index === 0,
        'rounded-b-lg': index === this.regions.length - 1
      }
    },
    formSubmit() {
      console.log('form submit child');
      this.$emit('formSubmit', this.summoner, this.selectedRegion.toLowerCase());
    }
  }
}
</script>

<style scoped>
.vertical-center {
  top: 50%;
  transform: translateY(-50%);
}
</style>
