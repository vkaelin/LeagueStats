<template>
  <div class="ml-6 leading-none">
    <div class="relative inline-block text-white">
      <select
        v-model="selectedKey"
        class="block appearance-none bg-select w-full px-4 py-2 pr-8 rounded-md leading-tight text-lg font-extrabold cursor-pointer focus:outline-none"
      >
        <option
          v-for="(data, leagueName) in ranked"
          :key="leagueName"
          :value="leagueName"
        >{{ data.name }}</option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="text-white fill-current h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>

    <div class="mt-1 text-teal-500 text-4xl uppercase font-extrabold">{{ selectedLeague.rank }}</div>
    <div class="mt-4 flex items-start bg-gradient px-4 py-3 rounded-lg">
      <div class="flex items-center">
        <div
          class="w-20 h-20 bg-blue-1000"
          :style="{background: `url(${selectedLeague.rankImgLink}) center/cover`}"
        ></div>
        <div class="ml-2 text-xl font-extrabold">{{ selectedLeague.leaguePoints }} LP</div>
      </div>
      <div class="ml-10 mt-2 font-extrabold uppercase leading-none">
        <div class="text-teal-500 text-base">Record</div>
        <div class="flex">
          <div class="mt-2 text-sm leading-tight text-right">
            <div>{{ selectedLeague.wins }}</div>
            <div>{{ selectedLeague.losses }}</div>
          </div>
          <div class="ml-2 mt-2 text-sm leading-tight">
            <div class="text-teal-500">Wins</div>
            <div class="text-red-300">Losses</div>
          </div>
        </div>
      </div>
      <div class="ml-10 mt-2 font-extrabold">
        <div class="text-teal-500 text-base uppercase">Winrate</div>
        <div class="mt-2 text-xl leading-tight">{{ selectedLeague.winrate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ranked: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedKey: Object.keys(this.ranked)[0]
    }
  },

  computed: {
    selectedLeague() {
      return this.ranked[this.selectedKey]
    }
  }
}
</script>

<style scoped>
.bg-select {
  background-color: rgba(49, 130, 206, 0.2);
}

.bg-select:focus {
  background-color: #2c5282;
}
</style>
