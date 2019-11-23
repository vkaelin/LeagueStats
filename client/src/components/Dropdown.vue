<template>
  <div>
    <!-- trigger -->
    <div
      @mouseenter="showDropdown"
      @mousemove="mousemove"
      @mouseleave="hideDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <slot name="trigger"></slot>
    </div>

    <!-- dropdown content -->
    <div
      v-show="isOpen"
      ref="content"
      class="fixed z-40 bg-blue-1000 py-2 rounded-md shadow"
      :style="{ width, ...position }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'auto'
    }
  },

  data() {
    return {
      isOpen: false,
      left: 0,
      offset: 12,
      top: 0,
      directionBottom: true,
      directionChecked: false,
    }
  },

  computed: {
    position() {
      const valuetoRemove = this.directionBottom ? 0 : this.height()
      return {
        left: `${this.left + this.offset}px`,
        top: `${this.top + this.offset - valuetoRemove}px`,
      }
    }
  },

  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    checkDropdownVisibility() {
      this.directionChecked = true
      const rect = this.$refs.content.getBoundingClientRect()
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
      this.directionBottom = (rect.bottom + this.offset) < viewHeight
    },
    handleScroll() {
      this.isOpen = false
    },
    height() {
      return this.$refs.content ? this.$refs.content.clientHeight : 0
    },
    hideDropdown() {
      this.isOpen = false
      this.directionBottom = true
      this.directionChecked = false
    },
    async mousemove(event) {
      this.left = event.clientX
      this.top = event.clientY

      if (!this.directionChecked) {
        await this.$nextTick()
        this.checkDropdownVisibility()
      }
    },
    showDropdown(event) {
      this.left = event.clientX
      this.top = event.clientY
      this.isOpen = true
    }
  }
}
</script>
