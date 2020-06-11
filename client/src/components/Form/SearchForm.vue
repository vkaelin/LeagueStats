<template>
  <form @submit.prevent="formSubmit" :class="formClasses" class="flex w-full text-lg text-teal-100">
    <div class="relative w-full">
      <button
        ref="submit"
        :class="[btnClasses]"
        class="absolute z-30 h-full hover:text-teal-200"
        type="submit"
      >
        <svg class="absolute w-4 h-4 vertical-center horizontal-center">
          <use xlink:href="#search" />
        </svg>
      </button>
      <input
        ref="input"
        v-model="summoner"
        @focus="selected = true"
        :class="[inputClasses]"
        class="w-full font-bold outline-none summoner-input"
        spellcheck="false"
        type="text"
      />
      <transition name="scale-fade">
        <SearchFormDropdown v-if="selected" @click-dropdown="clickDropdown = true" />
      </transition>

      <div ref="region-dropdown">
        <div
          :class="{'mr-12': size === 'xl'}"
          class="absolute right-0 z-30 flex items-center h-full vertical-center"
        >
          <div
            @click="dropdown = !dropdown"
            :class="[selectRegionClasses]"
            class="flex items-center transition-all border-2 border-transparent rounded cursor-pointer transition-fast ease-in-quad ease-out-quad hover:text-white"
          >
            <span class="font-bold uppercase select-none selected">{{ selectedRegion }}</span>
            <svg class="w-4 h-4 ml-1 -mr-1">
              <use xlink:href="#caret-down" />
            </svg>
          </div>
        </div>
        <transition name="scale-fade">
          <div
            v-show="dropdown"
            :class="[dropdownClasses]"
            class="absolute right-0 z-30 text-white shadow cursor-pointer"
          >
            <div
              v-for="(region, index) in regions"
              :key="region"
              @click="updateSettings({name: 'region', value: region.toLowerCase()})"
              :class="classRegions(index)"
              class="relative py-1 pl-5 pr-2 text-xs text-right select-none bg-blue-1000 hover:bg-blue-800"
            >
              <svg
                v-if="region.toLowerCase() === selectedRegion"
                class="absolute w-3 h-3 fill-current vertical-center offsetIcon"
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
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SearchFormDropdown from '@/components/Form/SearchFormDropdown.vue'

export default {
  components: {
    SearchFormDropdown,
  },

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
      clickDropdown: false,
      selected: false,
    }
  },

  computed: {
    btnClasses() {
      return {
        'left-0 w-8': this.size === 'small',
        'right-0 w-12': this.size === 'xl'
      }
    },
    formClasses() {
      return {
        'max-w-lg': this.size === 'small',
      }
    },
    inputClasses() {
      return {
        'py-2 pl-12 pr-20 bg-transparent text-base border-b-2 border-blue-300 focus:border-white': this.size === 'small',
        'py-4 pl-6 pr-32 focus:bg-blue-1000 rounded-lg': this.size === 'xl',
        'input-color': !this.dropdown && this.size === 'xl',
        'bg-blue-1000': this.dropdown && this.size === 'xl',
      }
    },
    dropdownClasses() {
      return {
        '-mt-1 rounded': this.size === 'small',
        'offsetDropDownXl rounded-b': this.size === 'xl'
      }
    },
    selectRegionClasses() {
      return {
        'px-2 text-base rounded-md': this.size === 'small',
        'px-2 py-1': this.size === 'xl',
        'bg-blue-1000': this.dropdown && this.size === 'small',
        'border-teal-200': this.dropdown && this.size === 'xl',
      }
    },
    ...mapState({
      selectedRegion: state => state.settings.region
    }),
  },

  created() {
    if (!this.summoner.length) {
      this.summoner = this.$route.params.name
    }
    window.addEventListener('mousedown', this.globalClick)
    window.addEventListener('blur', this.windowBlur)
    document.addEventListener('click', this.clickOutsideRegionDropdown)
    document.addEventListener('keydown', this.handleEscape)
  },

  beforeDestroy() {
    window.removeEventListener('mousedown', this.globalClick)
    window.removeEventListener('blur', this.windowBlur)
    document.removeEventListener('click', this.clickOutsideRegionDropdown)
    document.removeEventListener('keydown', this.handleEscape)
  },

  methods: {
    classRegions(index) {
      return {
        'rounded-t': index === 0,
        'rounded-b': index === this.regions.length - 1
      }
    },
    clickOutsideRegionDropdown(e) {
      e.stopPropagation()
      if (e.target === this.$refs['region-dropdown'] || this.$refs['region-dropdown'].contains(e.target)) {
        return
      }
      this.dropdown = false
    },
    formSubmit() {
      const search = this.summoner.split(' ').join('')
      if (search.length) {
        this.$emit('formSubmit', search, this.selectedRegion)
      }
    },
    globalClick(e) {
      if (e.target === this.$refs.input || e.target === this.$refs.submit) return
      if (!this.clickDropdown) {
        this.selected = false
      }
      this.clickDropdown = false
    },
    handleEscape(e) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.dropdown = false
        this.selected = false
      }
    },
    windowBlur() {
      this.selected = false
    },
    ...mapActions('settings', ['updateSettings']),
  }
}
</script>

<style scoped>
.offsetDropDownXl {
  top: 58px;
  right: 50px;
}

.offsetIcon {
  left: 4px;
}
</style>
