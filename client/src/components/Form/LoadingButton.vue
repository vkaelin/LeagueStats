<template>
  <button
    @click="btnClicked"
    :class="[btnClass, { loading: loading }, { 'pr-12': loading }]"
    :disabled="loading"
    class="relative select-none"
    type="button"
  >
    <slot>Send</slot>
    <span class="spinner absolute left-auto opacity-0">
      <span
        class="absolute right-0 inline-block h-4 w-4 rounded-full border-[3px] border-white opacity-100"
      ></span>
      <span
        class="absolute right-0 inline-block h-4 w-4 rounded-full border-[3px] border-white opacity-100"
      ></span>
      <span
        class="absolute right-0 inline-block h-4 w-4 rounded-full border-[3px] border-white opacity-100"
      ></span>
      <span
        class="absolute right-0 inline-block h-4 w-4 rounded-full border-[3px] border-white opacity-100"
      ></span>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    btnClass: {
      type: String,
      required: false,
      default: '',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    btnClicked() {
      this.$emit('clicked')
    },
  },
}
</script>

<style scoped>
button {
  transition: all 0.2s;
  transition-timing-function: ease-in;
}

.spinner {
  top: 50%;
  right: 1.7rem;
  margin: -0.5rem;
  transition-property: padding, opacity;
  transition-duration: 0.2s, 0.2s;
  transition-timing-function: ease-in, ease;
  transition-delay: 0s, 0.2s;
}

.spinner span {
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}

.spinner span:nth-child(1) {
  animation-delay: 0.45s;
}

.spinner span:nth-child(2) {
  animation-delay: 0.3s;
}

.spinner span:nth-child(3) {
  animation-delay: 0.15s;
}

.loading .spinner {
  opacity: 1;
}

button:not(:disabled) .spinner span {
  box-shadow: 0 0 0 0.2rem #4fd1c5 inset;
  border: 7.4px solid transparent;
  transition: all 0.4s;
}

button:not(:disabled) .spinner span:nth-child(1) {
  transform: rotate(0deg);
}

button:not(:disabled) .spinner span:nth-child(2) {
  transform: rotate(90deg);
}

button:not(:disabled) .spinner span:nth-child(3) {
  transform: rotate(180deg);
}

button:not(:disabled) .spinner span:nth-child(4) {
  transform: rotate(270deg);
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
