<template>
  <li class="match bg-white shadow text-sm md:text-base" :class="data.result ? 'win' : 'lose'">

 

    <div class="match-container">
      <!-- Responsive  -->
      <div class="flex justify-between lg:hidden text-sm text-gray-800 px-2 border-gray-300 border-b">
        <div class="flex">
          <div class="gamemode mr-1">{{ data.gamemode }}</div>
          <span>•</span>
          <div class="date ml-1">Il y a {{ data.date }}</div>
        </div>
        <div>
          <div class="date">{{ data.time }}</div>
        </div>
      </div>

      <div class="flex-container">

      <div class="first col w-1/3 lg:w-1/4">
        <div class="icon-and-sums flex flex-col sm:flex-row">
          <div class="relative">
            <img :src="`https://cdn.valentinkaelin.ch/riot/champions/${data.champ}.png`" class="champion-icon mb-2px sm:mb-0 sm:mr-2px" alt="example design">
            <span class="level absolute bottom-0 left-0 text-white font-bold">{{ data.level }}</span>
          </div>
          <div class="summonerSpells flex flex-row sm:flex-col">
            <img class="spell-icon mr-2px sm:mr-0 sm:mb-2px" :src="data.firstSum" alt="Ignite">
            <img class="spell-icon" :src="data.secondSum" alt="Ignite">
          </div>
        </div>
        <span class="champion-name hidden sm:block">{{ data.champ }}</span>
      </div>

      <div class="second col hidden lg:block lg:w-1/4">
        <div class="map">{{ data.map }}</div>
        <div class="gamemode">{{ data.gamemode }}</div>
      </div>

      <div class="third col w-1/2 lg:w-1/4 flex-wrap md:flex-no-wrap">
        <div
          v-for="(item, index) in data.items" :key="index"
          :style="{background: item}" class="item"
         >
        </div>
      </div>

      <div class="fourth w-1/6 lg:w-1/4 flex-col items-center justify-center sm:flex-row sm:justify-around">
        <div class="score mb-2 sm:mb-0 font-bold">{{ data.kills }}/{{ data.deaths }}/{{ data.assists }}</div>
        <div class="gold-farm text-center">
          <div class="gold flex items-center justify-center mb-2 sm:mb-0">
            {{ data.gold }}
            <v-icon name="coins" class="h-3 ml-1 text-blue-800" />
            </div>
          <div class="farm flex items-center justify-center">
            {{ data.minions }}
            <v-icon name="skull-crossbones" class="h-3 ml-1 text-blue-800" />
          </div>
        </div>
        <div class="duration-date hidden lg:block">
          <div class="duration">{{ data.time }}</div>
          <div class="date">{{ data.date }}</div>
        </div>
      </div>

    </div>
    </div>
  </li>
</template>

<script>


export default {
  props: {
    data: Object
  }
}
</script>


<style scoped>
.match {
  /* padding: 10px 0; */
  border-bottom: 1px solid #dae1e7;
  margin: 16px 0;
}

.match .flex-container {
  display: flex;
  flex-wrap: wrap;
  padding: 16px 8px;
}

.match.win .match-container {
  border-left: 10px solid #48BB78;
}

.match.lose .match-container {
  border-left: 10px solid #F56565;
}

.match .col {
  /* flex: 1 0 0; */
}

/* First col */
.match .first {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* flex: 1 0 0; */
}

.champion-icon {
  width: 48px;
  height: 48px;
  display: block;
}

.match .summonerSpells {
  margin: 0 8px 0 0;
}

.spell-icon {
  width: 23px;
  height: 23px;
  display: block;
}

/* Second col */
.match .second {
  /* flex: 1 0 0; */
  text-align: left;
}

/* Third col */
.match .third {
  /* flex: 1 0 0; */
  display: flex;
}

.third .item {
  width: 48px;
  height: 48px;
  margin: 0 2px 0 0;
}

/* Fourth col */
.match .fourth {
  /* flex: 1 0 0; */
  display: flex;
  align-items: center;
}
</style>
