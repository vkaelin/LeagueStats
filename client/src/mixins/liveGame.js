import { gameModes } from '@/data/data.js'
import { mapState } from 'vuex'

export const liveGame = {
  data() {
    return {
      gameLength: 0
    }
  },

  computed: {
    allyTeam() {
      return this.current && this.current.participants ? this.current.participants.filter(p => p.teamId === this.teamColor) : []
    },
    displayStartTime() {
      if (this.current.gameStartTime === 0) {
        return 'Not started yet'
      }
      return this.$options.filters.secToTime(this.gameLength, true)
    },
    enemyTeam() {
      return this.current && this.current.participants ? this.current.participants.filter(p => p.teamId !== this.teamColor) : []
    },
    gamemode() {
      return gameModes[this.current.gameQueueConfigId]
    },
    gameStartTime() {
      return this.current.gameStartTime
    },
    teamColor() {
      return this.current.participants.find(p => p.summonerId === this.account.id).teamId
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      current: state => state.summoner.live.match,
    })
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
    }
  },

  methods: {
    updateGameLength() {
      if (this.gameStartTime === 0) {
        return this.gameLength = 0
      }

      this.gameLength = (new Date() - new Date(this.gameStartTime)) / 1000
    },
  }
}
