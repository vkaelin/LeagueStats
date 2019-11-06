<template>
  <transition name="slide">
    <div v-if="data.status === 'loaded' && detailsOpen" class="bg-blue-800 rounded-b-lg">
      <DetailedMatchTeam :data="allyTeam" :all-players="[...allyTeam.players, ...enemyTeam.players]" />

      <div class="px-3 py-2 flex justify-between">
        <DetailedMatchGlobalStats :team="allyTeam" :ally-team="true" />
        <DetailedMatchGlobalStats :team="enemyTeam" :ally-team="false" />
      </div>

      <DetailedMatchTeam :data="enemyTeam" :all-players="[...allyTeam.players, ...enemyTeam.players]" />
    </div>
    <div v-else-if="data.status === 'loading' && detailsOpen">
      <p class="bg-blue-800 py-5 text-blue-100 text-lg font-semibold">Loading...</p>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import DetailedMatchGlobalStats from '@/components/Match/DetailedMatchGlobalStats.vue'
import DetailedMatchTeam from '@/components/Match/DetailedMatchTeam.vue'
export default {
  components: {
    DetailedMatchGlobalStats,
    DetailedMatchTeam
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    detailsOpen: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    allyTeam() {
      return this.data.blueTeam.players.some(p => p.name.toLowerCase() === this.$route.params.name.toLowerCase()) ? this.data.blueTeam : this.data.redTeam
    },
    enemyTeam() {
      return this.data.blueTeam.players.some(p => p.name.toLowerCase() === this.$route.params.name.toLowerCase()) ? this.data.redTeam : this.data.blueTeam
    },
    ...mapGetters('ddragon', ['version']),
  }
}
</script>

<style scoped>
.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 737px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
