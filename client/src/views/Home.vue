<template>
  <div class="homepage h-screen flex flex-col items-center justify-center">

    <div class="absolute top-0 right-0">
      <div class="line line-top relative mr-4 mt-4 w-20 h-2"></div>
    </div>

    <div class="absolute bottom-0 left-0">
      <div class="line line-bottom relative ml-4 mb-4 w-20 h-2"></div>
    </div>

    <div class="relative flex flex-col items-center w-full max-w-lg">
      <img class="absolute logo" src="@/assets/Logo.svg" alt="logo">
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

.line {
  background: rgba(178, 245, 234, .55);
}

.line::after {
  content: '';
  position: absolute;
  width: 4.5rem;
  height: .5rem;
  background: rgba(178, 245, 234, .55);
}

.line-top::after {
  transform-origin: bottom right;
  transform: rotate(90deg) translateX(100%);
}

.line-bottom::after {
  transform-origin: top left;
  transform: rotate(90deg) translateX(-100%);
  margin-left: .5rem;
}

.logo {
  top: -160px;
}
</style>
