<template>
  <div>
    <!-- trigger -->
    <div
      ref="trigger"
      @mouseenter="showTooltip"
      @mousemove="mousemove"
      @mouseleave="hideTooltip"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <slot name="trigger"></slot>
    </div>

    <!-- tooltip content -->
    <portal v-if="isOpen" to="tooltip-destination">
      <div
        v-show="isOpen"
        ref="content"
        class="fixed z-50 rounded-md bg-blue-1000 py-2 shadow"
        :style="{ ...position }"
      >
        <slot></slot>
      </div>
    </portal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      left: 0,
      offset: 12,
      top: 0,
      directionBottom: true,
      directionRight: true,
      directionChecked: false,
      width: 0,
    }
  },

  computed: {
    position() {
      const valuetoRemove = this.directionBottom ? 0 : this.height()
      const leftValue = this.directionRight
        ? this.left + this.offset
        : this.left - this.width - this.offset / 2
      return {
        left: `${leftValue}px`,
        top: `${this.top + this.offset - valuetoRemove}px`,
      }
    },
  },

  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    checkTooltipVisibility() {
      this.directionChecked = true
      const contentRect = this.$refs.content.getBoundingClientRect()
      const triggerRect = this.$refs.trigger.getBoundingClientRect()
      this.width = contentRect.width
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
      const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth)
      this.directionBottom = contentRect.bottom + this.offset < viewHeight
      this.directionRight = this.left + this.width + triggerRect.width + this.offset < viewWidth
    },
    handleScroll() {
      this.isOpen = false
    },
    height() {
      return this.$refs.content ? this.$refs.content.clientHeight : 0
    },
    hideTooltip() {
      this.isOpen = false
      this.directionBottom = true
      this.directionRight = true
      this.directionChecked = false
    },
    async mousemove(event) {
      this.left = event.clientX
      this.top = event.clientY

      if (!this.directionChecked) {
        // Component has been destroyed
        if (!this.$refs.content || !this.$refs.trigger) {
          return
        }

        await this.$nextTick()
        this.checkTooltipVisibility()
      }
    },
    showTooltip(event) {
      this.left = event.clientX
      this.top = event.clientY
      this.isOpen = true
    },
  },
}
</script>
