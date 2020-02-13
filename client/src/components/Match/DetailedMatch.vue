<template>
  <transition name="slide">
    <div v-if="data.status === 'loaded' && detailsOpen" class="bg-blue-800 rounded-b-lg">
      <DetailedMatchTeam
        :data="allyTeam"
        :all-players="[...allyTeam.players, ...enemyTeam.players]"
        :ally-team="true"
      />

      <div class="px-3 py-2 flex justify-between items-start">
        <DetailedMatchGlobalStats :team="allyTeam" :ally-team="true" />
        <SwitchToggle class="mt-2"></SwitchToggle>
        <DetailedMatchGlobalStats :team="enemyTeam" :ally-team="false" />
      </div>

      <DetailedMatchTeam
        :data="enemyTeam"
        :all-players="[...allyTeam.players, ...enemyTeam.players]"
        :ally-team="false"
      />
    </div>
    <div v-else-if="data.status === 'loading' && detailsOpen">
      <p class="bg-blue-800 py-5 text-blue-100 text-lg font-semibold">Loading...</p>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import DetailedMatchGlobalStats from '@/components/Match/DetailedMatchGlobalStats.vue'
import DetailedMatchTeam from '@/components/Match/DetailedMatchTeam.vue'
import SwitchToggle from '@/components/Form/SwitchToggle.vue'

export default {
  components: {
    DetailedMatchGlobalStats,
    DetailedMatchTeam,
    SwitchToggle,
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
      return this.data.blueTeam.players.some(p => p.summonerId === this.account.id) ? this.data.blueTeam : this.data.redTeam
    },
    enemyTeam() {
      return this.data.blueTeam.players.some(p => p.summonerId === this.account.id) ? this.data.redTeam : this.data.blueTeam
    },
    ...mapState({
      account: state => state.summoner.basic.account
    }),
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
