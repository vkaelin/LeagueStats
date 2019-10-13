<template>
  <div>
    <!-- trigger -->
    <div
      @mouseenter="isOpen = true"
      @mousemove="mousemove"
      @mouseleave="isOpen = false"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <slot name="trigger"></slot>
    </div>

    <!-- dropdown content -->
    <div
      v-show="isOpen"
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
    openMethod: {
      type: String,
      default: 'click'
    },
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
      top: 0
    }
  },

  computed: {
    position() {
      return {
        left: `${this.left + this.offset}px`,
        top: `${this.top + this.offset}px`,
      }
    }
  },

  methods: {
    mousemove(event) {
      this.left = event.clientX
      this.top = event.clientY
    }
  }
}
</script>
