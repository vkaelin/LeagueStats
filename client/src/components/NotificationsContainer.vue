<template>
  <div class="pr-2 pb-2 fixed bottom-0 right-0 z-50">
    <PopupNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import PopupNotification from '@/components/PopupNotification.vue'
import { mapState } from 'vuex' 

export default {
  components: {
    PopupNotification
  },

  computed: {
    ...mapState('notification', ['notifications'])
  }
}
</script>
