<template>
  <div ref="container" @mousedown="addRipple" class="relative cursor-pointer overflow-hidden">
    <transition-group
      class="pointer-events-none absolute left-0 top-0 h-full w-full"
      name="grow"
      tag="div"
    >
      <div
        v-for="ripple in ripples"
        :key="ripple.id"
        class="pointer-events-none absolute h-full w-full rounded-full opacity-0"
        :style="{
          top: ripple.top,
          left: ripple.left,
          width: ripple.width,
          height: ripple.height,
          background: color,
        }"
      ></div>
    </transition-group>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'rgba(255, 255, 255, 0.3)',
    },
  },

  data() {
    return {
      ripples: [],
      rippleWidth: 0,
      halfRippleWidth: 0,
    }
  },

  mounted() {
    const width = this.$refs.container.offsetWidth
    const height = this.$refs.container.offsetHeight
    this.rippleWidth = width > height ? width : height
    this.halfRippleWidth = this.rippleWidth / 2

    window.addEventListener('mouseup', this.purgeRipples)
  },

  beforeDestroy() {
    window.removeEventListener('mouseup', this.purgeRipples)
  },

  methods: {
    addRipple(e) {
      const { left, top } = this.$refs.container.getBoundingClientRect()
      const rippleId = Date.now()
      this.ripples.push({
        width: `${this.rippleWidth}px`,
        height: `${this.rippleWidth}px`,
        left: `${e.clientX - left - this.halfRippleWidth}px`,
        top: `${e.clientY - top - this.halfRippleWidth}px`,
        id: rippleId,
      })

      // Remove ripple
      setTimeout(() => {
        this.ripples = this.ripples.filter((r) => r.id !== rippleId)
      }, 400)
    },
    purgeRipples() {
      this.ripples = []
    },
  },
}
</script>
