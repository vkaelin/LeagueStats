<template>
  <div class="relative overflow-hidden bg-blue-900">
    <LazyBackground
      image-source="/img/bg-homepage-1.jpg"
      image-class="absolute inset-0 bg-center"
      transition-name="fade"
    ></LazyBackground>

    <div class="flex h-screen flex-col items-center justify-center">
      <div class="absolute right-0 top-0">
        <div class="line line-top relative mr-4 mt-4 h-2 w-20"></div>
      </div>

      <div class="absolute bottom-0 left-0">
        <div class="line line-bottom relative mb-4 ml-4 h-2 w-20"></div>
      </div>

      <div class="relative flex w-full max-w-lg flex-col items-center">
        <img class="logo absolute" src="/img/Logo.svg" alt="logo" />
        <SearchForm @formSubmit="redirect" :homepage="true" />
      </div>

      <p
        class="horizontal-center absolute bottom-0 pb-4 text-center text-xxs leading-tight text-blue-300"
      >
        LeagueStats.gg isn't endorsed by Riot Games and doesn't reflect the views or opinions of
        Riot Games or anyone officially involved in producing or managing Riot Games properties.
        <br />Riot Games, and all associated properties are trademarks or registered trademarks of
        Riot Games, Inc.
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
    SearchForm,
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
  },
}
</script>

<style scoped>
.line {
  background: rgba(178, 245, 234, 0.55);
}

.line::after {
  content: '';
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
