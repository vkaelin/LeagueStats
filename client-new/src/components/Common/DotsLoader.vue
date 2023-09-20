<template>
  <div :style="{ width: width }" class="text-center spinner">
    <div :style="dotStyle" class="inline-block rounded-full bounce1"></div>
    <div :style="dotStyle" class="inline-block rounded-full bounce2"></div>
    <div :style="dotStyle" class="inline-block rounded-full bounce3"></div>
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
