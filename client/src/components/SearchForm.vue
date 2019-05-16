<template>
  <form @submit.prevent="formSubmit" class="flex text-teal-100 text-lg w-full">
    <div class="relative w-full">
      <input
        type="text"
        autofocus
        class="input w-full px-2 py-4 rounded-lg outline-none pl-8 pr-16 font-bold"
        v-model="summoner"
      >
      <div class="absolute right-0 vertical-center flex items-center h-full mr-2">
        <div
          @click="dropdown = !dropdown"
          :class="{'bg-teal-600' : dropdown}"
          class="cursor-pointer flex items-center px-2 py-1 rounded transition-all transition-fast ease-in-quad ease-out-quad hover:text-white"
        >
          <span class="selected font-bold">{{ selectedRegion }}</span>
          <v-icon name="caret-down" class="ml-1"></v-icon>
        </div>
      </div>
      <transition
        enter-active-class="transition-all transition-fastest ease-out-quad"
        leave-active-class="transition-all transition-faster ease-in-quad"
        enter-class="opacity-0 scale-70"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-70"
      >
        <div
          v-if="dropdown"
          @click="dropdown = !dropdown"
          class="absolute right-0 text-white rounded-b shadow cursor-pointer mr-2 offsetDropDown"
        >
          <div
            v-for="(region, index) in regions"
            :key="region"
            @click="selectedRegion = region"
            :class="classRegions(index)"
            class="relative px-4b py-1 text-xs bg-teal-600 hover:bg-teal-500"
          >
            <v-icon 
              v-if="region === selectedRegion"
              name="check" 
              scale="0.7"
              class="absolute vertical-center offsetIcon">
            </v-icon>
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
  data() {
    return {
      summoner: '',
      dropdown: false,
      regions: [
        'BR',
        'EUNE',
        'EUW',
        'JP',
        'KR',
        'LAN',
        'LAS',
        'NA',
        'OCE',
        'TR',
        'RU'
      ],
      selectedRegion: 'EUW'
    };
  },
  methods: {
    classRegions(index) {
      return {
        'rounded-t': index === 0,
        'rounded-b': index === this.regions.length - 1
      };
    },
    formSubmit() {
      console.log('form submit child');
      this.$emit('formSubmit', this.summoner, this.selectedRegion.toLowerCase());
    }
  }
};
</script>

<style scoped>
.offsetDropDown {
  top: 57px;
  right: 1px;
}

.offsetIcon {
  left: 4px;
}
</style>
