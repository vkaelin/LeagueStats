<template>
  <form @submit.prevent="formSubmit" :class="formClasses" class="flex text-teal-100 text-lg w-full">
    <div v-if="dropdown" @click="dropdown = false" class="fixed z-20 inset-0"></div>
    <div class="relative w-full">
      <input
        v-model="summoner"
        type="text"
        :class="[inputClasses]"
        class="input w-full rounded-lg outline-none pl-6 pr-32 font-bold"
      />
      <div class="absolute right-0 z-30 vertical-center flex items-center h-full mr-12">
        <div
          @click="dropdown = !dropdown"
          :class="{'border-2 border-teal-200' : dropdown}"
          class="border border-transparent cursor-pointer flex items-center px-2 py-1 rounded transition-all transition-fast ease-in-quad ease-out-quad hover:text-white"
        >
          <span class="selected font-bold select-none">{{ selectedRegion }}</span>
          <svg
            class="ml-1 -mr-1 w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
            />
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
          v-if="dropdown"
          :class="[dropdownClasses]"
          class="absolute right-0 z-30 text-white rounded-b shadow cursor-pointer"
        >
          <div
            v-for="(region, index) in regions"
            :key="region"
            @click="selectedRegion = region"
            :class="classRegions(index)"
            class="relative pr-2 pl-5 py-1 text-xs dropdown text-right"
          >
            <svg
              v-if="region === selectedRegion"
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
        class="absolute right-0 z-30 btn rounded-lg h-full hover:text-teal-500"
        type="submit"
      >
        <svg
          class="absolute vertical-center horizontal-center w-4 h-4 fill-current "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
          />
        </svg>
      </button>
    </div>
  </form>
</template>

<script>
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
      selectedRegion: 'EUW'
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
        'py-4 px-2': this.size === 'xl'
      }
    },
    dropdownClasses() {
      return {
        'offsetDropDown': this.size === 'small',
        'offsetDropDownXl': this.size === 'xl'
      }
    }
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
        this.$emit('formSubmit', search, this.selectedRegion.toLowerCase())
      }
    }
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

.input, .dropdown {
  background: rgba(23,49,79,0.60);
}

.dropdown:hover {
  background: rgba(23,49,79,0.90);
}

.input:focus{
  background: rgba(23,49,79,0.70);
}
</style>
