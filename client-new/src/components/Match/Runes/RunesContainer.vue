<template>
  <transition leave-active-class="duration-300">
    <div
      v-show="runesOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-class="transform opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div
          v-if="runesOpen"
          @click="close"
          class="fixed inset-0 bg-gray-900 bg-opacity-75"
        ></div>
      </transition>

      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="runesOpen"
          class="relative overflow-hidden bg-gray-900 rounded-md shadow-lg"
          style="width: 800px; height: 500px"
        >
          <LazyBackground
            :image-source="`/img/runes/${primaryStyle.name.toLowerCase()}.jpg`"
            image-class="absolute inset-0"
            more-backgrounds="linear-gradient(rgba(26, 32, 44, 0.6), rgba(26, 32, 44, 0.8)),"
            transition-name="fade-fast"
            style="filter: blur(2px)"
          >
          </LazyBackground>
          <div class="relative flex items-start h-full px-4 py-2">
            <div class="w-1/2">
              <RuneStyle :primary="true" :rune-style="primaryStyle" />
            </div>
            <div class="w-1/2">
              <RuneStyle :primary="false" :rune-style="secondaryStyle" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { createCDragonAssetUrl } from '@/helpers/functions'
import LazyBackground from '@/components/Common/LazyBackgroundImage.vue'
import RuneStyle from '@/components/Match/Runes/RuneStyle.vue'

export default {
  components: {
    LazyBackground,
    RuneStyle,
  },

  computed: {
    primaryStyle() {
      return this.runes.perkstyles[this.selectedRunes.primaryStyle]
    },
    secondaryStyle() {
      return this.runes.perkstyles[this.selectedRunes.secondaryStyle]
    },
    ...mapState({
      runes: state => state.cdragon.runes,
      runesOpen: state => state.cdragon.runesOpen,
      selectedRunes: state => state.cdragon.selectedRunes
    }),
  },

  created() {
    document.addEventListener('keydown', this.handleEscape)
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.handleEscape)
  },

  methods: {
    close() {
      this.displayOrHideRunes({})
    },
    handleEscape(e) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.displayOrHideRunes({})
      }
    },
    createCDragonAssetUrl,
    ...mapActions('cdragon', ['displayOrHideRunes'])
  }
}
</script>
