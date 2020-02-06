<template>
  <form @submit.prevent="formSubmit" :class="formClasses" class="flex text-teal-100 text-lg w-full">
    <div v-if="dropdown" @click="dropdown = false" class="fixed z-20 inset-0"></div>
    <div class="relative w-full">
      <input
        v-model="summoner"
        type="text"
        :class="[inputClasses]"
        class="w-full rounded-lg outline-none pl-6 pr-32 font-bold focus:bg-blue-1000"
      />
      <div class="absolute right-0 z-30 vertical-center flex items-center h-full mr-12">
        <div
          @click="dropdown = !dropdown"
          :class="{'border-teal-200': dropdown}"
          class="border-2 border-transparent cursor-pointer flex items-center px-2 py-1 rounded transition-all transition-fast ease-in-quad ease-out-quad hover:text-white"
        >
          <span class="selected font-bold uppercase select-none">{{ selectedRegion }}</span>
          <svg class="ml-1 -mr-1 w-4 h-4">
            <use xlink:href="#caret-down" />
          </svg>
        </div>
      </div>
      <transition
        enter-active-class="transition-all transition-fastest ease-out-quad"
        leave-active-class="transition-all transition-faster ease-in-quad"
        enter-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-show="dropdown"
          :class="[dropdownClasses]"
          class="absolute right-0 z-30 text-white rounded-b shadow cursor-pointer"
        >
          <div
            v-for="(region, index) in regions"
            :key="region"
            @click="updateSettings({name: 'region', value: region.toLowerCase()})"
            :class="classRegions(index)"
            class="relative pr-2 pl-5 py-1 text-xs text-right bg-blue-1000 hover:bg-blue-800"
          >
            <svg
              v-if="region.toLowerCase() === selectedRegion"
              class="absolute vertical-center offsetIcon w-3 h-3 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
              />
            </svg>
            {{ region }}
          </div>
        </div>
      </transition>
      <button
        :class="[btnClasses]"
        class="absolute right-0 z-30 h-full hover:text-teal-200"
        type="submit"
      >
        <svg class="absolute vertical-center horizontal-center w-4 h-4">
          <use xlink:href="#search" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    size: {
      type: String,
      default: 'xl'
    }
  },
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
    }
  },
  computed: {
    btnClasses() {
      return {
        'w-8 mr-3': this.size === 'small',
        'w-12': this.size === 'xl'
      }
    },
    formClasses() {
      return {
        'max-w-md': this.size === 'small',
      }
    },
    inputClasses() {
      return {
        'py-2 px-1': this.size === 'small',
        'py-4 px-2': this.size === 'xl',
        'input-color': !this.dropdown,
        'bg-blue-1000': this.dropdown
      }
    },
    dropdownClasses() {
      return {
        'offsetDropDown': this.size === 'small',
        'offsetDropDownXl': this.size === 'xl'
      }
    },
    ...mapState({
      selectedRegion: state => state.settings.region
    }),
  },
  methods: {
    classRegions(index) {
      return {
        'rounded-b': index === this.regions.length - 1
      }
    },
    formSubmit() {
      const search = this.summoner.split(' ').join('')
      if (search.length) {
        this.$emit('formSubmit', search, this.selectedRegion)
      }
    },
    ...mapActions('settings', ['updateSettings']),
  }
}
</script>

<style scoped>
.offsetDropDown {
  top: 43px;
  right: 48px;
}

.offsetDropDownXl {
  top: 58px;
  right: 50px;
}

.offsetIcon {
  left: 4px;
}
</style>
