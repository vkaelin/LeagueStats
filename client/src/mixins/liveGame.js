import { compareSummonernames } from '@/helpers/functions.js'
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
      return this.current.participants.filter(p => p.teamId === this.teamColor)
    },
    enemyTeam() {
      return this.current.participants.filter(p => p.teamId !== this.teamColor)
    },
    gamemode() {
      return gameModes[this.current.gameQueueConfigId]
    },
    teamColor() {
      return this.current.participants.find(p => p.summonerId === this.account.id).teamId
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      current: state => state.summoner.basic.current,
    })
  },

  created() {
    this.gameLength = this.current ? this.current.gameLength : 0

    setInterval(() => {
      this.gameLength++
    }, 1000)
  },

  methods: {
    compareSummonernames,
  }
}
