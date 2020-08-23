<template>
  <div class="relative overflow-hidden bg-blue-900">
    <LazyBackground
      :image-source="require('@/assets/img/bg-homepage-1.jpg')"
      image-class="absolute inset-0 bg-center"
      transition-name="fade"
    ></LazyBackground>

    <div class="flex flex-col items-center justify-center h-screen">
      <div class="absolute top-0 right-0">
        <div class="relative w-20 h-2 mt-4 mr-4 line line-top"></div>
      </div>

      <div class="absolute bottom-0 left-0">
        <div class="relative w-20 h-2 mb-4 ml-4 line line-bottom"></div>
      </div>

      <div class="relative flex flex-col items-center w-full max-w-lg">
        <img class="absolute logo" src="@/assets/img/Logo.svg" alt="logo" />
        <SearchForm @formSubmit="redirect" :homepage="true" />
      </div>

      <p
        class="absolute bottom-0 pb-4 leading-tight text-center text-blue-300 horizontal-center text-xxs"
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
  },

  metaInfo() {
    return {
      title: 'LeagueStats.gg',
    }
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
