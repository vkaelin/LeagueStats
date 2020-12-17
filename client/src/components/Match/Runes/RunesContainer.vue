<template>
  <div
    v-if="isOpen"
    @click="close"
    class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900"
  >
    <div class="text-3xl text-white bg-red-500">RUNES {{ runes.primary }}</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    runes: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isOpen: this.open,
    }
  },

  watch: {
    open () {
      this.isOpen = this.open
    }
  },

  methods: {
    close() {
      this.displayOrHideRunes({})
    },
    ...mapActions('cdragon', ['displayOrHideRunes'])
  }
}
</script>
