<template>
  <div :class="allyTeam ? 'text-left' : 'text-right'">
    <div v-if="team.bans">
      <Tooltip
        v-for="ban in team.bans"
        :key="'ban-' + ban.pickTurn"
        :class="{ 'ml-2': ban.pickTurn !== 6 && ban.pickTurn !== 1 }"
        class="inline-block"
      >
        <template #trigger>
          <div
            :class="[allyTeam ? 'ban-blue border-teal-500' : 'ban-red border-red-500']"
            class="ban relative cursor-pointer rounded-full border-2"
          >
            <div
              :style="[ban.champion.id ? { backgroundImage: `url('${ban.champion.icon}')` } : '']"
              class="ban-img h-6 w-6 rounded-full bg-blue-1000 bg-cover bg-center"
            ></div>
            <div
              :class="[textLightColor, bgColor]"
              class="ban-order absolute flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold"
            >
              {{ ban.pickTurn }}
            </div>
          </div>
        </template>
        <template #default>
          <div class="select-none px-2 text-center text-xs leading-tight text-white">
            <div>{{ ban.champion.id ? ban.champion.name : 'No ban' }}</div>
          </div>
        </template>
      </Tooltip>
    </div>
    <div
      :class="allyTeam ? 'text-left' : 'flex-row-reverse text-right'"
      class="mt-2 flex leading-tight"
    >
      <div>
        <div :class="textColor" class="text-sm font-medium">
          {{ `${team.teamStats.kills}/${team.teamStats.deaths}/${team.teamStats.assists}` }}
        </div>
        <div class="text-xs text-white">K / D / A</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'">
        <div :class="textColor" class="text-sm font-medium">
          {{ +(team.teamStats.gold / 1000).toFixed(1) + 'k' }}
        </div>
        <div class="text-xs text-white">Gold</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'">
        <div :class="textColor" class="text-sm font-medium">
          {{ +(team.teamStats.dmgChamp / 1000).toFixed(1) + 'k' }}
        </div>
        <div class="text-xs text-white">Dmg</div>
      </div>
      <div :class="allyTeam ? 'ml-3' : 'mr-3'" class="flex flex-col justify-end">
        <div class="text-sm font-medium text-teal-400"></div>
        <div class="flex text-xs text-white">
          <div :class="allyTeam ? '' : 'mr-2'">
            <span :class="textColor">{{ team.towers }}</span> Towers
          </div>
          <div :class="allyTeam ? 'ml-2' : 'mr-2'">
            <span :class="textColor">{{ team.dragons }}</span> Dragons
          </div>
          <div :class="allyTeam ? 'ml-2' : ''">
            <span :class="textColor">{{ team.barons }}</span> Barons
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    team: {
      type: Object,
      required: true,
    },
    allyTeam: {
      type: Boolean,
      default: false,
    },
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
  },
}
</script>
