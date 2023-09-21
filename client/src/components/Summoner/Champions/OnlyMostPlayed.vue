<template>
  <div class="flex items-center space-x-2 text-base">
    <input
      @change="change"
      id="onlyMostPlayed"
      :checked="value"
      class="form-checkbox"
      type="checkbox"
    />
    <Tooltip>
      <template #trigger>
        <label for="onlyMostPlayed" class="cursor-pointer select-none">Only most played</label>
      </template>
      <template #default>
        <div class="px-2 text-center text-xs text-white">
          Hide champions with less than
          <br />
          <span class="font-bold text-teal-400">1% playrate</span>
          to be able to compare
          <br />statistics more easily.
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    change(e) {
      this.$emit('input', e.target.checked)
    },
  },
}
</script>
