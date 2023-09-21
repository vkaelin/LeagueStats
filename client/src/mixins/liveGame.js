import { gameModes } from '@/data/data.js'
import { sortTeamByRole } from '@/helpers/functions.js'
import { mapState } from 'vuex'

export const liveGame = {
  data() {
    return {
      gameLength: 0,
    }
  },

  computed: {
    allyTeam() {
      if (!this.current || !this.current.participants) {
        return []
      }
      return this.current.participants
        .filter((p) => p.teamId === this.teamColor)
        .sort(this.sortTeamByRole)
    },
    displayStartTime() {
      if (this.current.gameStartTime === 0) {
        return 'Not started yet'
      }
      return this.$options.filters.secToTime(this.gameLength, true)
    },
    enemyTeam() {
      if (!this.current || !this.current.participants) {
        return []
      }
      return this.current.participants
        .filter((p) => p.teamId !== this.teamColor)
        .sort(this.sortTeamByRole)
    },
    gamemode() {
      if (this.current.participants) {
        return this.current.gameType === 'CUSTOM_GAME'
          ? { type: '', name: 'Custom Game' }
          : gameModes[this.current.gameQueueConfigId]
      } else {
        return { type: '', name: '' }
      }
    },
    gameStartTime() {
      return this.current ? this.current.gameStartTime : 0
    },
    teamColor() {
      return this.current.participants.find((p) => p.summonerId === this.account.id).teamId
    },
    ...mapState({
      account: (state) => state.summoner.basic.account,
      current: (state) => state.summoner.live.match,
    }),
  },

  created() {
    this.updateGameLength()

    setInterval(() => {
      this.gameLength++
    }, 1000)
  },

  watch: {
    gameStartTime() {
      this.updateGameLength()
    },
  },

  methods: {
    updateGameLength() {
      if (this.gameStartTime === 0) {
        return (this.gameLength = 0)
      }

      this.gameLength = (new Date() - new Date(this.gameStartTime)) / 1000
    },
    sortTeamByRole,
  },
}
