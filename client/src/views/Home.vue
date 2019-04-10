<template>
  <div class="homepage h-screen flex flex-col items-center justify-center">

    <div class="relative flex flex-col items-center w-full max-w-lg">
      <div class="absolute logo">
        <img src="@/assets/Logo.svg" alt="logo">
      </div>
      <SearchForm @formSubmit="redirect"/>
    </div>

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

<style scoped>
.homepage {
  background-image: url("../assets/bg-homepage-1.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.logo {
  top: -160px;
}
</style>
