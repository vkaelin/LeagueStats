<template>
  <div
    :style="{ width: size, height: size, margin }"
    class="relative"
    style="transform: rotateZ(45deg)"
  >
    <div class="cube-1 cube relative float-left h-1/2 w-1/2"></div>
    <div class="cube-2 cube relative float-left h-1/2 w-1/2"></div>
    <div class="cube-4 cube relative float-left h-1/2 w-1/2"></div>
    <div class="cube-3 cube relative float-left h-1/2 w-1/2"></div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#bee3f8',
    },
    size: {
      type: String,
      default: '30px',
    },
    margin: {
      type: String,
      default: '0 auto',
    },
  },
}
</script>

<style scoped>
.cube {
  transform: scale(1.1);
}

.cube:before {
  content: '';
  @apply absolute left-0 top-0 h-full w-full bg-blue-300;
  animation: cubeAngle 2.4s infinite linear both;
  transform-origin: 100% 100%;
}

.cube-2 {
  transform: scale(1.1) rotateZ(90deg);
}

.cube-3 {
  transform: scale(1.1) rotateZ(180deg);
}

.cube-4 {
  transform: scale(1.1) rotateZ(270deg);
}

.cube-2:before {
  animation-delay: 0.3s;
}

.cube-3:before {
  animation-delay: 0.6s;
}

.cube-4:before {
  animation-delay: 0.9s;
}

@keyframes cubeAngle {
  0%,
  10% {
    @apply opacity-0;
    transform: perspective(130px) rotateX(-180deg);
  }
  25%,
  75% {
    @apply opacity-100;
    transform: perspective(130px) rotateX(0deg);
  }
  90%,
  100% {
    @apply opacity-0;
    transform: perspective(130px) rotateY(180deg);
  }
}
</style>
