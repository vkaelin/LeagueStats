<template>
  <div key="records">
    <template v-if="!recordsLoaded || (recordsLoaded && records.maxKda)">
      <div
        class="relative pl-6 text-2xl text-blue-200 border-b-2 border-blue-800 category blue-900"
      >Basics</div>
      <div class="flex flex-wrap -mx-2">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#63b3ed"
            text-color="text-blue-400"
            border-color="border-blue-400"
            property="kda"
            :record="records.maxKda"
            title="KDA"
          />
          <RecordCard
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            property="kills"
            :record="records.maxKills"
            title="Kills"
          />
          <RecordCard
            color="#9F7AEA"
            text-color="text-purple-500"
            border-color="border-purple-500"
            property="assists"
            :record="records.maxAssists"
            title="Assists"
          />
          <RecordCard
            color="#F56565"
            text-color="text-red-500"
            border-color="border-red-500"
            property="deaths"
            :record="records.maxDeaths"
            title="Deaths"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-600"
            border-color="border-yellow-600"
            property="gold"
            :record="records.maxGold"
            title="Gold earned"
          />
          <RecordCard
            color="#81E6D9"
            text-color="text-teal-300"
            border-color="border-teal-300"
            property="minions"
            :record="records.maxMinions"
            title="Minions killed"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 6"
            :key="index"
            style="width: 176px; height: 294px;"
            class="mx-2 mt-6"
          >
            <content-loader
              :height="294"
              :width="176"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="176" height="294" />
            </content-loader>
          </div>
        </template>
      </div>
      <div class="relative pl-6 mt-3 text-2xl text-blue-200 border-b-2 border-blue-800 blue-900 category">Game impact</div>
      <div class="flex flex-wrap -mx-2">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#FC8181"
            text-color="text-red-400"
            border-color="border-red-400"
            property="dmgChamp"
            :record="records.maxDmgChamp"
            title="Damage champions"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            property="dmgObj"
            :record="records.maxDmgObj"
            title="Damage objectives"
          />
          <RecordCard
            color="#FC8181"
            text-color="text-red-400"
            border-color="border-red-400"
            property="dmgTaken"
            :record="records.maxDmgTaken"
            title="Damage taken"
          />
          <RecordCard
            v-if="records.maxTowers"
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            property="towers"
            :record="records.maxTowers"
            title="Towers"
          />
          <RecordCard
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            property="kp"
            :record="records.maxKp"
            title="Kill participation"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            property="vision"
            :record="records.maxVision"
            title="Vision score"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 6"
            :key="index"
            style="width: 176px; height: 294px;"
            class="mx-2 mt-6"
          >
            <content-loader
              :height="294"
              :width="176"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="176" height="294" />
            </content-loader>
          </div>
        </template>
      </div>
      <div class="relative pl-6 mt-3 text-2xl text-blue-200 border-b-2 border-blue-800 category">Miscellaneous</div>
      <div class="flex flex-wrap -mx-2">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#4299E1"
            text-color="text-blue-500"
            border-color="border-blue-500"
            property="time"
            :record="records.maxTime"
            title="Longest game"
          />
          <RecordCard
            v-if="records.maxLiving"
            color="#4299E1"
            text-color="text-blue-500"
            border-color="border-blue-500"
            property="longestLiving"
            :record="records.maxLiving"
            title="Longest living"
          />
          <RecordCard
            v-if="records.maxCriticalStrike"
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            property="criticalStrike"
            :record="records.maxCriticalStrike"
            title="Critical Strike"
          />
          <RecordCard
            v-if="records.maxHeal"
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            property="heal"
            :record="records.maxHeal"
            title="Heal"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 4"
            :key="index"
            style="width: 176px; height: 294px;"
            class="mx-2 mt-6"
          >
            <content-loader
              :height="294"
              :width="176"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="176" height="294" />
            </content-loader>
          </div>
        </template>
      </div>
      <div v-if="records.maxDouble" class="relative pl-6 mt-3 text-2xl text-blue-200 border-b-2 border-blue-800 category">Multi kills</div>
      <div v-if="records.maxDouble" class="flex flex-wrap -mx-2">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#FEFCBF"
            text-color="text-yellow-200"
            border-color="border-yellow-200"
            property="doubleKills"
            :record="records.maxDouble"
            title="Double kills"
          />
          <RecordCard
            color="#F6E05E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            property="tripleKills"
            :record="records.maxTriple"
            title="Triple kills"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-600"
            border-color="border-yellow-600"
            property="quadraKills"
            :record="records.maxQuadra"
            title="Quadra kills"
          />
          <RecordCard
            color="#F56565"
            text-color="text-red-500"
            border-color="border-red-500"
            property="pentaKills"
            :record="records.maxPenta"
            title="Penta kills"
          />
          <RecordCard
            color="#63b3ed"
            text-color="text-blue-400"
            border-color="border-blue-400"
            property="killingSpree"
            :record="records.maxKillingSpree"
            title="Killing Spree"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 5"
            :key="index"
            style="width: 176px; height: 294px;"
            class="mx-2 mt-6"
          >
            <content-loader
              :height="294"
              :width="176"
              :speed="2"
              primary-color="#17314f"
              secondary-color="#2b6cb0"
            >
              <rect x="0" y="0" rx="8" ry="8" width="176" height="294" />
            </content-loader>
          </div>
        </template>
      </div>
    </template>
    <template v-if="recordsLoaded && !records.maxKda">
      <div class="flex flex-col items-center mt-4">
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
  },

  metaInfo() {
    return {
      title: 'Summoner Records',
    }
  }
}
</script>

<style scoped>
.category:before {
  @apply w-2 h-2 bg-blue-200 absolute block left-0 ml-1;
  content: "";
  top: 35%;
  transform: rotate(45deg);
}
</style>
