<template>
  <transition name="slide">
    <div v-if="data.status === 'loaded' && detailsOpen" class="bg-blue-800 rounded-b-lg">
      <DetailedMatchTeam :data="allyTeam" />

      <div class="py-5">
        <div class="px-3 flex justify-between">
          <div v-if="allyTeam.bans">
            <div
              v-for="ban in allyTeam.bans"
              :key="'ban-' + ban.pickTurn"
              :class="[{'ml-2': ban.pickTurn !== 6 && ban.pickTurn !== 1}]"
              class="relative ban ban-blue inline-block border-2 border-teal-500 rounded-full"
            >
              <div
                :style="[ban.champion.id ? {backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban.champion.id}.png')`} : '']"
                class="ban-img w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
              ></div>
              <div
                class="absolute ban-order w-4 h-4 flex items-center justify-center text-xs text-teal-100 bg-teal-500 font-bold rounded-full"
              >{{ ban.pickTurn }}</div>
            </div>
          </div>

          <div v-if="enemyTeam.bans">
            <div
              v-for="ban in enemyTeam.bans"
              :key="'ban-' + ban.pickTurn"
              :class="[{'ml-2': ban.pickTurn !== 6 && ban.pickTurn !== 1}]"
              class="relative ban ban-red inline-block border-2 border-red-500 rounded-full"
            >
              <div
                :style="[ban.champion.id ? {backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban.champion.id}.png')`} : '']"
                class="ban-img w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
              ></div>
              <div
                class="absolute ban-order w-4 h-4 flex items-center justify-center text-xs text-red-100 bg-red-500 font-bold rounded-full"
              >{{ ban.pickTurn }}</div>
            </div>
          </div>
        </div>
      </div>

      <DetailedMatchTeam :data="enemyTeam" />
    </div>
    <div v-else-if="data.status === 'loading' && detailsOpen">
      <p class="bg-blue-800 py-5 text-blue-100 text-lg font-semibold">Loading...</p>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import DetailedMatchTeam from '@/components/Match/DetailedMatchTeam.vue'
export default {
  components: {
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
.ban::after {
  content: "";
  position: absolute;
  left: 0px;
  top: 50%;
  width: calc(100% + 1px);
  height: 2px;
  transform: rotate(-45deg);
}

.ban-blue::after {
  background: #38b2ac;
}

.ban-red::after {
  background: #f56565;
}

.ban-img {
  filter: grayscale(100%);
}

.ban-order {
  left: -7px;
  top: -5px;
}

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
