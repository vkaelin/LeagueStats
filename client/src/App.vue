<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Accueil</router-link> |
      <router-link :to="`/summoner/${summoner}`">
          {{ linkText }}
        </router-link>
    </div>
    
    <router-view/>

  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script>
export default {
  data() {
    return {
      linkText: 'Test link',
      summoner: 'Kalane'
    }
  },
}
</script>

