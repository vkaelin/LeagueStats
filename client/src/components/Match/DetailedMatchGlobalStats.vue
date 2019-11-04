<template>
  <div :class="allyTeam ? 'text-left' : 'text-right'">
    <div v-if="team.bans">
      <div
        v-for="ban in team.bans"
        :key="'ban-' + ban.pickTurn"
        :class="[{'ml-2': ban.pickTurn !== 6 && ban.pickTurn !== 1}, allyTeam ? 'ban-blue border-teal-500' : 'ban-red border-red-500']"
        class="relative ban inline-block border-2 rounded-full"
      >
        <div
          :style="[ban.champion.id ? {backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban.champion.id}.png')`} : '']"
          class="ban-img w-6 h-6 bg-cover bg-center bg-blue-1000 rounded-full"
        ></div>
        <div
          :class="[textLightColor, bgColor]"
          class="absolute ban-order w-4 h-4 flex items-center justify-center text-xs font-bold rounded-full"
        >{{ ban.pickTurn }}</div>
      </div>
    </div>
    <div
      :class="allyTeam ? 'text-left' : 'text-right flex-row-reverse'"
      class="mt-2 flex leading-tight"
    >
      <div>
        <div
          :class="textColor"
          class="text-base font-semibold"
        >{{ `${team.teamStats.kills}/${team.teamStats.deaths}/${team.teamStats.assists}` }}</div>
        <div class="text-white text-xs">k / d / a</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'">
        <div
          :class="textColor"
          class="text-base font-semibold"
        >{{ +(team.teamStats.gold / 1000).toFixed(2) + 'k' }}</div>
        <div class="text-white text-xs">gold</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'">
        <div
          :class="textColor"
          class="text-base font-semibold"
        >{{ +(team.teamStats.dmgChamp / 1000).toFixed(2) + 'k' }}</div>
        <div class="text-white text-xs">dmg</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'" class="flex flex-col justify-end">
        <div class="text-base text-teal-400 font-semibold"></div>
        <div class="flex text-white text-xs">
          <div :class="allyTeam ? '' : 'mr-2'">
            <span :class="textColor">{{ team.towers }}</span> towers
          </div>
          <div :class="allyTeam ? 'ml-2' : 'mr-2'">
            <span :class="textColor">{{ team.dragons }}</span> dragons
          </div>
          <div :class="allyTeam ? 'ml-2' : ''">
            <span :class="textColor">{{ team.barons }}</span> barons
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    team: {
      type: Object,
      required: true
    },
    allyTeam: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    textLightColor() {
      return this.allyTeam ? 'text-teal-100' : 'text-red-100'
    },
    textColor() {
      return this.allyTeam ? 'text-teal-400' : 'text-red-400'
    },
    bgColor() {
      return this.allyTeam ? 'bg-teal-500' : 'bg-red-500'
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
</style>
