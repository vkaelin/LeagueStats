<template>
  <transition name="slide-fade">
    <div
      :class="{
        'bg-red-500': notification.type === 'error',
        'bg-green-500': notification.type === 'success',
      }"
      class="relative mt-2 rounded-lg p-6 pr-10 text-white shadow-md"
      style="min-width: 240px"
    >
      <button
        @click="deleteNotification"
        class="absolute right-0 top-0 mx-1 my-1 block cursor-pointer rounded-full border border-transparent px-1 py-1 hover:border-white focus:outline-none"
      >
        <svg class="h-3 w-3 fill-current" viewBox="0 0 20 20">
          <path
            d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"
          />
        </svg>
      </button>
      <div class="flex items-center text-white">
        <svg v-if="notification.type === 'success'" class="w-6 fill-current" viewBox="0 0 20 20">
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"
          />
        </svg>
        <svg v-if="notification.type === 'error'" class="w-6 fill-current" viewBox="0 0 20 20">
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
          />
        </svg>
        <span class="ml-3">{{ notification.message }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      timeout: null,
    }
  },

  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  mounted() {
    this.timeout = setTimeout(() => this.deleteNotification(), 3000)
  },

  methods: {
    deleteNotification() {
      this.remove(this.notification)
    },
    ...mapActions('notification', ['remove']),
  },
}
</script>
