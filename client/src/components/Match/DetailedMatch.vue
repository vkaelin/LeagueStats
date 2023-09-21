<template>
  <transition name="slide">
    <div v-if="data.status === 'loaded' && detailsOpen" class="rounded-b-lg bg-blue-800">
      <DetailedMatchTeam
        :data="allyTeam"
        :all-players="[...allyTeam.players, ...enemyTeam.players]"
        :ally-team="true"
        :ranks-loaded="data.ranksLoaded"
      />

      <div class="flex items-start justify-between px-3 py-2">
        <DetailedMatchGlobalStats :team="allyTeam" :ally-team="true" />
        <SwitchToggle
          @updateValue="updatePercent"
          left-label="%"
          right-label="Total"
          :value="percentSettings"
          class="mt-2"
        ></SwitchToggle>
        <DetailedMatchGlobalStats :team="enemyTeam" :ally-team="false" />
      </div>

      <DetailedMatchTeam
        :data="enemyTeam"
        :all-players="[...allyTeam.players, ...enemyTeam.players]"
        :ally-team="false"
        :ranks-loaded="data.ranksLoaded"
      />
    </div>
    <div v-else-if="data.status === 'loading' && detailsOpen">
      <div class="rounded-b-lg bg-blue-800 py-5">
        <CubeLoader />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CubeLoader from '@/components/Common/CubeLoader.vue'
import DetailedMatchGlobalStats from '@/components/Match/DetailedMatchGlobalStats.vue'
import DetailedMatchTeam from '@/components/Match/DetailedMatchTeam.vue'
import SwitchToggle from '@/components/Form/SwitchToggle.vue'

export default {
  components: {
    CubeLoader,
    DetailedMatchGlobalStats,
    DetailedMatchTeam,
    SwitchToggle,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    detailsOpen: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    allyTeam() {
      return this.data.blueTeam.players.some((p) => p.summonerId === this.account.id)
        ? this.data.blueTeam
        : this.data.redTeam
    },
    enemyTeam() {
      return this.data.blueTeam.players.some((p) => p.summonerId === this.account.id)
        ? this.data.redTeam
        : this.data.blueTeam
    },
    ...mapState({
      account: (state) => state.summoner.basic.account,
      percentSettings: (state) => state.settings.percent,
    }),
  },

  methods: {
    ...mapActions('settings', ['updatePercent']),
  },
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
