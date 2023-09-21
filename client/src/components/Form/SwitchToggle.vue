<template>
  <div class="switch relative z-10 select-none text-sm leading-tight text-teal-400">
    <input
      v-model="selected"
      id="toggle-on"
      class="toggle toggle-left hidden"
      :value="true"
      type="radio"
    />
    <label
      :class="{ 'selected-label': selected }"
      for="toggle-on"
      class="inline-block cursor-pointer rounded-l-full border-b-2 border-l-2 border-r border-t-2 border-teal-500 py-1"
      >{{ leftLabel }}</label
    >
    <input
      v-model="selected"
      id="toggle-off"
      class="toggle toggle-right hidden"
      :value="false"
      type="radio"
    />
    <label
      :class="{ 'selected-label': !selected }"
      for="toggle-off"
      class="inline-block cursor-pointer rounded-r-full border-b-2 border-l border-r-2 border-t-2 border-teal-500 py-1"
      >{{ rightLabel }}</label
    >
    <div
      :class="selected ? 'left-checked' : 'right-checked'"
      class="selector absolute inset-0 w-1/2 bg-teal-500"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    leftLabel: {
      type: String,
      required: true,
    },
    rightLabel: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    selected: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('updateValue', value)
      },
    },
  },
}
</script>

<style scoped>
.switch label {
  min-width: 45px;
}

.selected-label {
  cursor: default;
  color: #fff;
  transition: color 200ms;
}

.selector {
  z-index: -1;
  transition:
    left 200ms cubic-bezier(0.77, 0, 0.175, 1),
    border-radius 200ms cubic-bezier(0.77, 0, 0.175, 1);
}

.left-checked {
  left: 0;
  border-radius: 999px 0 0 999px;
}

.right-checked {
  left: 50%;
  border-radius: 0 999px 999px 0;
}
</style>
