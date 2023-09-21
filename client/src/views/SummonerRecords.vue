<template>
  <div key="records">
    <template v-if="!recordsLoaded || (recordsLoaded && records.assists)">
      <div
        class="category blue-900 relative border-b-2 border-blue-800 pl-6 text-2xl text-blue-200"
      >
        Basics
      </div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#63b3ed"
            text-color="text-blue-400"
            border-color="border-blue-400"
            :record="records.kda"
            title="KDA"
          />
          <RecordCard
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            :record="records.kills"
            title="Kills"
          />
          <RecordCard
            color="#9F7AEA"
            text-color="text-purple-500"
            border-color="border-purple-500"
            :record="records.assists"
            title="Assists"
          />
          <RecordCard
            color="#F56565"
            text-color="text-red-500"
            border-color="border-red-500"
            :record="records.deaths"
            title="Deaths"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-600"
            border-color="border-yellow-600"
            :record="records.gold"
            title="Gold earned"
          />
          <RecordCard
            color="#81E6D9"
            text-color="text-teal-300"
            border-color="border-teal-300"
            :record="records.minions"
            title="Minions killed"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 6"
            :key="index"
            style="width: 176px; height: 294px"
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
      <div
        class="blue-900 category relative mt-3 border-b-2 border-blue-800 pl-6 text-2xl text-blue-200"
      >
        Game impact
      </div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#FC8181"
            text-color="text-red-400"
            border-color="border-red-400"
            :record="records.damage_dealt_champions"
            title="Damage champions"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            :record="records.damage_dealt_objectives"
            title="Damage objectives"
          />
          <RecordCard
            color="#FC8181"
            text-color="text-red-400"
            border-color="border-red-400"
            :record="records.damage_taken"
            title="Damage taken"
          />
          <RecordCard
            v-if="records.maxTowers"
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            :record="records.turret_kills"
            title="Towers"
          />
          <RecordCard
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            :record="records.kp"
            title="Kill participation"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            :record="records.vision_score"
            title="Vision score"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 6"
            :key="index"
            style="width: 176px; height: 294px"
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
      <div class="category relative mt-3 border-b-2 border-blue-800 pl-6 text-2xl text-blue-200">
        Miscellaneous
      </div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#4299E1"
            text-color="text-blue-500"
            border-color="border-blue-500"
            :record="records.game_duration"
            title="Longest game"
          />
          <RecordCard
            color="#4299E1"
            text-color="text-blue-500"
            border-color="border-blue-500"
            :record="records.time_spent_living"
            title="Longest living"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            :record="records.critical_strike"
            title="Critical Strike"
          />
          <RecordCard
            color="#68D391"
            text-color="text-green-400"
            border-color="border-green-400"
            :record="records.heal"
            title="Heal"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 4"
            :key="index"
            style="width: 176px; height: 294px"
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
      <div class="category relative mt-3 border-b-2 border-blue-800 pl-6 text-2xl text-blue-200">
        Multi kills
      </div>
      <div class="-mx-2 flex flex-wrap">
        <template v-if="recordsLoaded">
          <RecordCard
            color="#FEFCBF"
            text-color="text-yellow-200"
            border-color="border-yellow-200"
            :record="records.double_kills"
            title="Double kills"
          />
          <RecordCard
            color="#F6E05E"
            text-color="text-yellow-400"
            border-color="border-yellow-400"
            :record="records.triple_kills"
            title="Triple kills"
          />
          <RecordCard
            color="#D69E2E"
            text-color="text-yellow-600"
            border-color="border-yellow-600"
            :record="records.quadra_kills"
            title="Quadra kills"
          />
          <RecordCard
            color="#F56565"
            text-color="text-red-500"
            border-color="border-red-500"
            :record="records.penta_kills"
            title="Penta kills"
          />
          <RecordCard
            color="#63b3ed"
            text-color="text-blue-400"
            border-color="border-blue-400"
            :record="records.killing_spree"
            title="Killing Spree"
          />
        </template>
        <template v-else>
          <div
            v-for="index in 5"
            :key="index"
            style="width: 176px; height: 294px"
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
    <template v-if="recordsLoaded && !records.assists">
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
      records: (state) => state.summoner.records.list,
      recordsLoaded: (state) => state.summoner.records.recordsLoaded,
    }),
  },

  watch: {
    recordsLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    },
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
  },
}
</script>

<style scoped>
.category:before {
  @apply absolute left-0 ml-1 block h-2 w-2 bg-blue-200;
  content: '';
  top: 35%;
  transform: rotate(45deg);
}
</style>
