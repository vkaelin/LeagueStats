<template>
  <div>
    <div class="mt-3 min-h-screen">
      <ChampionsTable
        v-if="champions.length && championsLoaded"
        :champions="champions"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ChampionsTable from '@/components/Summoner/Champions/ChampionsTable.vue'

export default {
  components: {
    ChampionsTable,
  },

  computed: {
    ...mapState({
      champions: state => state.summoner.infos.champions,
      championsLoaded: state => state.summoner.championsLoaded
    })
  },

  created() {
    if (!this.championsLoaded) {
      console.log('FETCH CHAMPIONS')
      this.championStats()
    }
  },

  methods: {
    ...mapActions('summoner', ['championStats']),
  }
}
</script>
