<template>
  <form @submit.prevent="formSubmit" class="flex text-teal-100 text-lg w-full">
    <div class="relative w-full">
      <!-- <v-icon name="search" class="absolute ml-2 vertical-center"></v-icon> -->
      <input 
        type="text" 
        autofocus
        class="input w-full px-2 py-4 rounded-lg outline-none pl-8 pr-16 font-bold" 
        v-model="summoner"
      >
      <div class="absolute right-0 vertical-center flex items-center h-full mr-2">
        <div 
          @click="dropdown = !dropdown"
          class="cursor-pointer flex items-center px-2 py-1 rounded-lg hover:bg-teal-700"
        >
          <span class="selected font-bold">{{ selectedRegion }}</span>
          <v-icon name="caret-down" class="ml-1"></v-icon>
        </div>
      </div>
      <transition name="bounce">
        <div
          v-if="dropdown"
          @click="dropdown = !dropdown"
          class="absolute right-0 text-white rounded-b-lg shadow cursor-pointer mr-2"
        >
          <div 
            v-for="(region, index) in regions" 
            :key="region"
            @click="selectedRegion = region"
            class="px-4 py-1 text-sm bg-teal-600 hover:bg-teal-500"
            :class="classRegions(index)"
          >
            {{ region }}
          </div>
        </div>
      </transition>

    </div>

    <button class="input btn w-20 rounded-lg ml-2 relative" type="submit">
      <v-icon name="search" class="absolute vertical-center horizontal-center"></v-icon>
    </button>
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
.bounce-enter-active {
  animation: bounce-in .5s;
}

.bounce-leave-active {
  animation: bounce-in .5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
