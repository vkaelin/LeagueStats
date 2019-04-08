<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <h1>Home page test</h1>

    <SearchForm @formSubmit="redirect"/>

  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm.vue';

export default {
  components: {
    SearchForm
  },
  methods: {
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
  }
};
</script>
