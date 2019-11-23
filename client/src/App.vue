<template>
  <div id="app" class="font-sans bg-blue-900 antialiased min-h-screen">

    <SVGContainer />
    <NotificationsContainer />
    <router-view />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NotificationsContainer from '@/components/NotificationsContainer.vue'
import SVGContainer from '@/components/SVGContainer.vue'

export default {
  components: {
    NotificationsContainer,
    SVGContainer
  },

  created() {
    this.updatePercent()
  },

  methods: {
    ...mapActions('settings', ['updatePercent']),
  }
}
</script>
