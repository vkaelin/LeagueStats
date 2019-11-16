<template>
  <div class="ml-2 leading-none flex">
    <div
      class="w-24 h-24"
      :style="{background: `url(${selectedLeague.rankImgLink}) center/cover`}"
    ></div>
    <div class="flex flex-col justify-center">
      <div class="flex items-center">
        <div class="text-teal-500 text-4xl uppercase font-extrabold">{{ selectedLeague.fullRank }}</div>
        <div class="ml-4 text-3xl font-extrabold">{{ selectedLeague.leaguePoints }} LP</div>
      </div>
      <div class="flex mt-2 items-center">
        <div class="relative inline-block text-white">
          <select
            v-model="selectedKey"
            class="block appearance-none bg-blue-800 hover:bg-blue-700 w-full px-4 py-2 pr-8 rounded-md leading-tight text-lg font-extrabold cursor-pointer focus:outline-none"
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
        <div class="ml-2 p-2 flex bg-blue-800 rounded items-center">
          <div class="text-base uppercase font-bold">Record</div>
          <div class="ml-2 text-green-400 font-bold">{{ selectedLeague.wins }}</div>
          <span class="mx-1"> - </span>
          <div class="text-red-400 font-bold">{{ selectedLeague.losses }}</div>
          <div class="ml-3 text-base uppercase font-bold">Winrate</div>
          <div :class="['ml-2 text-base leading-tight font-bold', parseFloat(selectedLeague.winrate) > 50 ? 'text-green-400' : 'text-red-400', parseFloat(selectedLeague.winrate) == 50 ? 'text-blue-100' : '' ]">{{ selectedLeague.winrate }}</div>
        </div>
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
