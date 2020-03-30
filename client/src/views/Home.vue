<template>
  <div class="relative bg-blue-900 overflow-hidden">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="absolute inset-0 bg-center"
      transition-name="fade"
    ></LazyBackground>

    <div class="h-screen flex flex-col items-center justify-center">
      <div class="absolute top-0 right-0">
        <div class="line line-top relative mr-4 mt-4 w-20 h-2"></div>
      </div>

      <div class="absolute bottom-0 left-0">
        <div class="line line-bottom relative ml-4 mb-4 w-20 h-2"></div>
      </div>

      <div class="relative flex flex-col items-center w-full max-w-lg">
        <img class="absolute logo" src="@/assets/img/Logo.svg" alt="logo" />
        <SearchForm @formSubmit="redirect" />
      </div>

      <p
        class="pb-4 absolute horizontal-center bottom-0 text-center text-xxs text-blue-300 leading-tight"
      >
        LeagueStats.gg isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.
        <br />Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </p>
    </div>
  </div>
</template>

<script>
import LazyBackground from '@/components/Common/LazyBackgroundImage.vue'
import SearchForm from '@/components/Form/SearchForm.vue'

export default {
  components: {
    LazyBackground,
    SearchForm
  },

  methods: {
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    },
  }
}
</script>

<style scoped>
.line {
  background: rgba(178, 245, 234, 0.55);
}

.line::after {
  content: "";
  position: absolute;
  width: 4.5rem;
  height: 0.5rem;
  background: rgba(178, 245, 234, 0.55);
}

.line-top::after {
  transform-origin: bottom right;
  transform: rotate(90deg) translateX(100%);
}

.line-bottom::after {
  transform-origin: top left;
  transform: rotate(90deg) translateX(-100%);
  margin-left: 0.5rem;
}

.logo {
  top: -160px;
}
</style>
