<template>
  <div id="app" class="font-sans bg-gray-200">
    <div class="nav">
      <router-link to="/">Accueil</router-link> |
      <router-link :to="`/summoner/euw/${summoner}`">
          {{ linkText }}
      </router-link>
    </div>
    
    <router-view/>

  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  min-height: 100vh;
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

