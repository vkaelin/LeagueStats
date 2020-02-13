<template>
  <div class="switch relative z-10 text-teal-400 text-sm select-none leading-tight">
    <input
      v-model="selected"
      id="toggle-on"
      class="toggle toggle-left hidden"
      :value="true"
      type="radio"
    />
    <label
      :class="{'selected-label': selected}"
      for="toggle-on"
      class="inline-block py-1 rounded-l-full border-t-2 border-r border-b-2 border-l-2 border-teal-500 cursor-pointer"
    >%</label>
    <input
      v-model="selected"
      id="toggle-off"
      class="toggle toggle-right hidden"
      :value="false"
      type="radio"
    />
    <label
      :class="{'selected-label': !selected}"
      for="toggle-off"
      class="inline-block py-1 rounded-r-full border-t-2 border-r-2 border-b-2 border-l border-teal-500 cursor-pointer"
    >Total</label>
    <div
      :class="selected ? 'left-checked' : 'right-checked'"
      class="selector absolute w-1/2 inset-0 bg-teal-500"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    selected: {
      get() {
        return this.percentSettings
      },
      set(value) {
        this.updatePercent(value)
      }
    },
    ...mapState({
      percentSettings: state => state.settings.percent
    }),
  },

  methods: {
    ...mapActions('settings', ['updatePercent']),
  }
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
  transition: left 200ms cubic-bezier(0.77, 0, 0.175, 1),
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
