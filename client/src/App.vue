<template>
  <div id="app" class="min-h-screen bg-blue-900 font-sans antialiased">
    <SVGContainer />
    <NotificationsContainer />
    <RunesContainer />
    <portal-target name="tooltip-destination" />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Default from '@/layouts/Default.vue'
import Home from '@/layouts/Home.vue'
import NotificationsContainer from '@/components/Global/NotificationsContainer.vue'
import RunesContainer from '@/components/Match/Runes/RunesContainer.vue'
import SVGContainer from '@/components/Global/SVGContainer.vue'

export default {
  components: {
    Default,
    Home,
    NotificationsContainer,
    RunesContainer,
    SVGContainer,
  },

  computed: {
    layout() {
      return this.$route.meta.layout || 'Default'
    },
  },

  created() {
    this.updatePercent()
    this.updateSettings({ name: 'region' })
    this.updateSettings({ name: 'recentSearches', isJson: true })
    this.updateSettings({ name: 'favorites', isJson: true })
  },

  methods: {
    ...mapActions('settings', ['updatePercent', 'updateSettings']),
  },
}
</script>
