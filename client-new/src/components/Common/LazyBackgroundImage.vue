<template>
  <transition :name="transitionName">
    <div
      v-show="imageState === 'loaded'"
      :class="[imageClass, imageState]"
      :style="computedStyle"
      :data-state="imageState"
    ></div>
  </transition>
</template>

<script>
export default {
  props: {
    imageSource: {
      type: String,
      required: true,
    },
    imageClass: {
      type: String,
      required: false,
      default: '',
    },
    backgroundSize: {
      type: String,
      required: false,
      default: 'cover',
    },
    moreBackgrounds: {
      type: String,
      required: false,
      default: '',
    },
    transitionName: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      imageState: 'loading',
      asyncImage: new Image(),
    }
  },

  computed: {
    computedStyle() {
      if (this.imageState === 'loaded') {
        return `background-image: ${this.moreBackgrounds} url(${this.asyncImage.src}); background-size: ${this.backgroundSize}`
      }
      return ''
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchImage()
    })
  },

  methods: {
    fetchImage() {
      this.asyncImage.onload = this.imageOnLoad
      this.imageState = 'loading'
      this.asyncImage.src = this.imageSource
    },
    imageOnLoad() {
      this.imageState = 'loaded'
    },
  },
}
</script>
