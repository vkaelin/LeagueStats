<template>
  <div :style="{ width: width }" class="spinner text-center">
    <div :style="dotStyle" class="bounce1 inline-block rounded-full"></div>
    <div :style="dotStyle" class="bounce2 inline-block rounded-full"></div>
    <div :style="dotStyle" class="bounce3 inline-block rounded-full"></div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#90cdf4',
    },
    dotWidth: {
      type: String,
      default: '18px',
    },
    width: {
      type: String,
      default: '70px',
    },
  },

  computed: {
    dotStyle() {
      return {
        backgroundColor: this.color,
        height: this.dotWidth,
        width: this.dotWidth,
      }
    },
  },
}
</script>

<style scoped>
.spinner > div {
  animation: bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

@keyframes bouncedelay {
  0%,
  60%,
  100% {
    transform: scale(0);
  }

  30% {
    transform: scale(0.8);
  }
}
</style>
