<template>
  <div v-if="overviewLoaded" key="overview" class="relative flex items-start mt-3 text-center">
    <div ref="sidebar" :class="{'fixed fixed-sidebar': fixedSidebar}" class="sidebar">
      <SummonerChampions />
      <SummonerStats />
      <SummonerMates />
    </div>
    <div :class="{'pushed-container': fixedSidebar}" class="w-9/12">
      <div v-if="current && current.participants" class="mb-4">
        <LiveMatch />
      </div>
      <div v-if="overview.matches.length">
        <ul>
          <Match
            v-for="(match, index) in overview.matches"
            :key="index"
            :data="overview.matches[index]"
            :index-match="index"
          />
        </ul>
        <LoadingButton
          v-if="moreMatchesToFetch"
          @clicked="moreMatches"
          :loading="matchesLoading"
          btn-class="block px-4 py-2 mx-auto mt-4 font-semibold bg-blue-800 rounded-md shadow-lg hover:bg-blue-1000"
        >More matches</LoadingButton>
      </div>
      <div v-else>
        <div class="flex justify-center">
          <div class="px-4 py-3 text-lg font-bold text-center text-blue-100 rounded-lg bg-gradient">
            <div>No matches found.</div>
            <div>😕</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <OverviewLoader />
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LiveMatch from '@/components/Match/LiveMatch.vue'
import LoadingButton from '@/components/Form/LoadingButton.vue'
import Match from '@/components/Match/Match.vue'
import OverviewLoader from '@/components/Summoner/Overview/OverviewLoader.vue'
import SummonerChampions from '@/components/Summoner/Overview/SummonerChampions.vue'
import SummonerMates from '@/components/Summoner/Overview/SummonerMates.vue'
import SummonerStats from '@/components/Summoner/Overview/SummonerStats.vue'

export default {
  components: {
    LiveMatch,
    LoadingButton,
    Match,
    OverviewLoader,
    SummonerChampions,
    SummonerMates,
    SummonerStats,
  },

  data() {
    return {
      fixedSidebar: false,
      isMobile: false,
      sidebarRectangle: {
        y: 323,
        height: null,
      },
    }
  },

  computed: {
    ...mapState({
      current: state => state.summoner.live.match,
      overview: state => state.summoner.overview
    }),
    ...mapGetters('summoner', ['matchesLoading', 'moreMatchesToFetch', 'overviewLoaded', 'summonerFound'])
  },

  watch: {
    overviewLoaded() {
      this.fetchData()

      this.getSidebarHeight()
    },
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
    window.addEventListener('scroll', this.isSidebarFixed)
    this.checkMobile()
  },

  mounted() {
    this.getSidebarHeight()
  },

  destroyed() {
    window.removeEventListener('scroll', this.isSidebarFixed)
  },

  methods: {
    fetchData() {
      if (!this.overviewLoaded && this.summonerFound) {
        this.overviewRequest()
      }
    },
    getSidebarHeight() {
      if (this.isMobile) return

      this.$nextTick(() => {
        this.sidebarRectangle.height = this.$refs.sidebar ? Math.ceil(this.$refs.sidebar.getBoundingClientRect().height) : null
        this.isSidebarFixed()
      })
    },
    checkMobile() {
      let check = false;
      // eslint-disable-next-line no-useless-escape
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera)

      if (check) {
        this.isSidebarFixed = false
      }
      this.isMobile = check
    },
    isSidebarFixed() {
      if (this.isMobile) return
      if (!this.sidebarRectangle.height) return
      if (!this.overview.matches.length) return

      this.fixedSidebar = window.innerHeight + document.documentElement.scrollTop > this.sidebarRectangle.y + this.sidebarRectangle.height + 123
    },
    ...mapActions('summoner', ['moreMatches', 'overviewRequest']),
  },
}
</script>

<style scoped>
.sidebar {
  width: 300px;
}

.fixed-sidebar {
  bottom: 121px;
}

.pushed-container {
  margin-left: 300px;
}
</style>
