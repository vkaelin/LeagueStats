<template>
  <li class="match" :class="data.result ? 'win' : 'lose'">
    <div class="content-container">

      <div class="first">
        <img :src="`https://cdn.valentinkaelin.ch/riot/champions/${data.champ}.png`" class="champion-icon" alt="example design">
        <span class="level">{{ data.level }}</span>
        <div class="summonerSpells">
          <img class="spell-icon" src="https://cdn.valentinkaelin.ch/riot/spells/SummonerFlash.png" alt="Flash">
          <img class="spell-icon" src="https://cdn.valentinkaelin.ch/riot/spells/SummonerDot.png" alt="Ignite">
        </div>
        <span class="champion-name">{{ data.champ }}</span>
      </div>

      <div class="second">
        <div class="map">{{ data.map }}</div>
        <div class="gamemode">{{ data.gamemode }}</div>
      </div>

      <div class="third">
        <div
          v-for="(item, index) in data.items" :key="index"
          :style="{background: getItemLink(item)}" class="item"
         >
        </div>
      </div>

      <div class="fourth">
        <div class="score">{{ data.kills }}/{{ data.deaths }}/{{ data.assists }}</div>
        <div class="gold-farm">
          <div class="gold">{{ data.gold }}</div>
          <div class="farm">{{ data.minions }}</div>
        </div>
        <div class="duration-date">
          <div class="duration">{{ data.time }}</div>
          <div class="date">{{ data.date }}</div>
        </div>
      </div>

    </div>
  </li>
</template>

<script>
import itemsJSON from '@/data/item.json'

export default {
  props: {
    data: Object
  },
  methods: {
    getItemLink(id) {
      if(id !== 0) {
        const itemImage = itemsJSON.data[id].image;
        return `url('https://cdn.valentinkaelin.ch/riot/${itemImage.sprite}') -${itemImage.x}px -${itemImage.y}px`;
      }
      return "url('https://cdn.valentinkaelin.ch/riot/items/0.png') 0% 0% / cover";
    }
  }
}
</script>


<style scoped>
.match {
  background: #fff;
  padding: 10px 0;
  border-bottom: 1px solid #dae1e7;
}

.match .content-container {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
}

.match.win .content-container {
  border-left: 10px solid #51d88a;
}

.match.lose .content-container {
  border-left: 10px solid #ef5753;
}

/* First col */
.match .first {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 0 0;
}

.champion-icon {
  width: 48px;
  height: 48px;
  display: block;
  margin: 0 2px 0 0;
}

.match .level {
  position: absolute;
  bottom: 0;
  left: 0;

  color: #fff;
  font-weight: bold;
}

.match .summonerSpells {
  margin: 0 8px 0 0;
}

.spell-icon {
  width: 23px;
  height: 23px;
  display: block;
}

.match .spell-icon:first-child {
  margin: 0 0 2px 0;
}

/* Second col */
.match .second {
  flex: 1 0 0;
  text-align: left;
}

/* Third col */
.match .third {
  flex: 1 0 0;
  display: flex;
}

.third .item {
  width: 48px;
  height: 48px;
  margin: 0 2px 0 0;
}

/* Fourth col */
.match .fourth {
  flex: 1 0 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
