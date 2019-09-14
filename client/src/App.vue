<template>
  <div id="app" class="font-sans bg-blue-900 antialiased min-h-screen">

    <NotificationsContainer />
    <router-view />

  </div>
</template>

<script>
import NotificationsContainer from '@/components/NotificationsContainer.vue'

export default {
  components: {
    NotificationsContainer
  },
}
</script>
