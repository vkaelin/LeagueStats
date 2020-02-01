<template>
  <div key="records">
    <template v-if="!recordsLoaded || (recordsLoaded && records.maxKda)">
      <div class="mx-4 text-blue-200 text-2xl border-b-2 border-blue-800 blue-900">basics</div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="text-blue-400"
            property="kda"
            :record="records.maxKda"
            title="best kda"
          />
          <RecordCard
            color="text-green-400"
            property="kills"
            :record="records.maxKills"
            title="most kills"
          />
          <RecordCard
            color="text-blue-500"
            property="assists"
            :record="records.maxAssists"
            title="most assists"
          />
          <RecordCard
            color="text-red-500"
            property="deaths"
            :record="records.maxDeaths"
            title="most deaths"
          />
          <RecordCard
            color="text-yellow-600"
            property="gold"
            :record="records.maxGold"
            title="most gold earned"
          />
          <RecordCard
            color="text-white"
            property="time"
            :record="records.maxTime"
            title="longest game"
          />
          <RecordCard
            color="text-pink-500"
            property="minions"
            :record="records.maxMinions"
            title="most minions killed"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 7"
            :key="index"
            style="width: 288px; height: 146px;"
            class="mt-6 mx-2"
          >
            <content-loader
              :height="146"
              :width="288"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="288" height="146" />
            </content-loader>
          </div>
        </template>
      </div>
      <div
        class="mt-3 mx-4 text-blue-200 text-2xl border-b-2 border-blue-800 blue-900"
      >game impact</div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="text-yellow-400"
            property="dmgTaken"
            :record="records.maxDmgTaken"
            title="highest damage taken"
          />
          <RecordCard
            color="text-red-400"
            property="dmgChamp"
            :record="records.maxDmgChamp"
            title="highest damage to champions"
          />
          <RecordCard
            color="text-yellow-400"
            property="dmgObj"
            :record="records.maxDmgObj"
            title="highest damage to objectives"
          />
          <RecordCard
            color="text-green-400"
            property="kp"
            :record="records.maxKp"
            title="highest kill participation"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 4"
            :key="index"
            style="width: 288px; height: 146px;"
            class="mt-6 mx-2"
          >
            <content-loader
              :height="146"
              :width="288"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="288" height="146" />
            </content-loader>
          </div>
        </template>
      </div>
      <div class="mt-3 mx-4 text-blue-200 text-2xl border-b-2 border-blue-800 blue-900">team work</div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="text-blue-500"
            property="vision"
            :record="records.maxVision"
            title="highest vision score"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 1"
            :key="index"
            style="width: 288px; height: 146px;"
            class="mt-6 mx-2"
          >
            <content-loader
              :height="146"
              :width="288"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="288" height="146" />
            </content-loader>
          </div>
        </template>
      </div>
    </template>
    <template v-if="recordsLoaded && !records.maxKda">
      <div class="mt-4 flex flex-col items-center">
        <div>No records have been found.</div>
        <div>😕</div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { ContentLoader } from 'vue-content-loader'
import RecordCard from '@/components/Summoner/Records/RecordCard.vue'

export default {
  components: {
    ContentLoader,
    RecordCard,
  },

  computed: {
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      records: state => state.summoner.records.list,
      recordsLoaded: state => state.summoner.records.recordsLoaded,
    })
  },

  watch: {
    recordsLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (!this.recordsLoaded && this.summonerFound) {
        this.recordsRequest()
      }
    },
    ...mapActions('summoner', ['recordsRequest']),
  }
}
</script>
