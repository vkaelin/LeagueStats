<template>
  <div>
    <h1>Home page test</h1>

    <form @submit.prevent="redirect">
      <input type="text" placeholder="Entre un pseudo." class="bg-gray-300 p-2 rounded-l outline-none focus:bg-gray-400" v-model="search">
      <button class="bg-teal-500 p-2 text-white rounded-r hover:bg-teal-400" type="submit">Rechercher</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: ''
    };
  },
  methods: {
    redirect() {
      this.$router.push("/summoner/" + this.search)
    }
  }
};
</script>

