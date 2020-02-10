<template>
  <div id="app" class="font-sans bg-blue-900 antialiased min-h-screen">
    <SVGContainer />
    <NotificationsContainer />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Default from '@/layouts/Default.vue'
import Home from '@/layouts/Home.vue'
import NotificationsContainer from '@/components/NotificationsContainer.vue'
import SVGContainer from '@/components/SVGContainer.vue'

export default {
  components: {
    Default,
    Home,
    NotificationsContainer,
    SVGContainer
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || 'Default')
    }
  },

  created() {
    this.updatePercent()
    this.updateSettings({name: 'region'})
    this.updateSettings({name: 'recent_searches', isJson: true})
    this.updateSettings({name: 'favorites', isJson: true})
  },

  methods: {
    ...mapActions('settings', ['updatePercent', 'updateSettings']),
  }
}
</script>
