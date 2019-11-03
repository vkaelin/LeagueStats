<template>
  <div id="app" class="font-sans bg-blue-900 antialiased min-h-screen">

    <SVGContainer />
    <NotificationsContainer />
    <router-view />

  </div>
</template>

<script>
import NotificationsContainer from '@/components/NotificationsContainer.vue'
import SVGContainer from '@/components/SVGContainer.vue'

export default {
  components: {
    NotificationsContainer,
    SVGContainer
  },
}
</script>
