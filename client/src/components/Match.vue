<template>
  <li class="relative">
    <!-- <div class="game-status absolute left-0 h-32 w-32">
      <div class="text-2xl text-teal-500 uppercase font-extrabold">{{ data.status }}</div>
    </div> -->
    <div
      :class="matchResultClass"
      class="ml-4 match relative mt-4 bg-blue-800 rounded-lg text-white text-base"
    >
      <div class="relative z-20 flex flex-wrap px-5 py-3">
        <div class="first w-4/12 text-left">
          <div>
            <div
              class="h-6 text-lg text-teal-500 font-extrabold uppercase leading-none"
            >{{ data.champion.name }}</div>

            <div class="flex">
              <div class="flex flex-col justify-end items-center">
                <div
                  v-if="data.role !== 'NONE'"
                  :style="{backgroundImage: `url(${require('@/assets/img/roles/' + data.role + '.png')})`}"
                  class="w-10 h-10 bg-center bg-cover"
                ></div>
                <div
                  class="w-10 text-center text-xs text-teal-500 font-extrabold"
                >LVL {{ data.level }}</div>
              </div>
              <div
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${data.champion.id}.png')`}"
                class="ml-2 w-16 h-16 crop-champion bg-blue-1000 rounded-lg"
              ></div>
              <div class="ml-2 flex flex-col justify-around">
                <div
                  :style="{backgroundImage: `url(${data.firstSum})`}"
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
                <div
                  :style="{backgroundImage: `url(${data.secondSum})`}"
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                ></div>
              </div>
              <div class="ml-1 flex flex-col justify-around">
                <div
                  :style="[data.primaryRune ? {background: `url(${data.primaryRune}) center/cover`} : '']"
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                ></div>
                <div
                  :style="[data.secondaryRune ? {background: `url(${data.secondaryRune}) center/cover`} : '']"
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                ></div>
              </div>
              <div class="mx-auto flex flex-col justify-center items-center leading-none">
                <div class="text-xl font-extrabold text-teal-500">
                  <span class>{{ data.kills }}</span>
                  <span class>/</span>
                  <span class>{{ data.deaths }}</span>
                  <span class>/</span>
                  <span class>{{ data.assists }}</span>
                </div>
                <div class="mt-2 text-white text-xs font-extrabold">{{ data.kda }} KDA</div>
              </div>
            </div>

            <div
              class="h-6 flex items-end text-sm text-white font-extrabold leading-none"
            >{{ data.gamemode }}</div>
          </div>
        </div>

        <div class="second w-3/12 py-6 flex items-center">
          <div class="items flex flex-wrap">
            <div
              v-for="(item, index) in data.items"
              :key="index"
              :style="{backgroundImage: item}"
              class="ml-1 w-8 h-8 rounded-md bg-blue-1000 bg-center bg-cover"
            ></div>
          </div>

          <div class="ml-4 leading-none">
            <div class="flex items-center">
              <img src="@/assets/img/icons/Creep.svg" alt="Minions" />
              <div class="ml-1 text-teal-300 text-sm font-bold">
                {{ data.minions }}
                <span class="font-normal">cs</span>
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Gold.svg" alt="Gold" />
              <div class="ml-1 gold text-sm font-bold">
                {{ data.gold }}
                <!-- <span class="font-normal">gold</span> -->
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Damage.svg" alt="Damage" />
              <div class="ml-1 damage text-sm font-bold">
                {{ data.damage }}
                <!-- <span class="font-normal">dmg</span> -->
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/KillParticipation.svg" alt="KillParticipation" />
              <div class="ml-1 kp text-sm font-bold">
                {{ data.kp }}
                <!-- <span class="font-normal">kp</span> -->
              </div>
            </div>
          </div>
        </div>

        <div class="third w-5/12 py-1 flex items-center">
          <div v-if="data.allyTeam.length > 1">
            <div
              v-for="(ally, index) in data.allyTeam"
              :key="'player-' + index"
              class="ml-4 flex items-center leading-none"
            >
              <router-link
                :to="{ name: 'summoner', params: { region: $route.params.region, name: ally.name }}"
                :class="isSummonerProfile(ally.name)"
                class="w-16 text-right overflow-hidden text-overflow whitespace-no-wrap text-xs text-blue-200 font-medium hover:text-blue-100"
              >{{ ally.name }}</router-link>
              <div
                :class="index !== 0 ? '-mt-1': ''"
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ally.champion.id}.png')`}"
                class="ml-1 w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full overflow-hidden"
              ></div>
              <div
                class="mx-3 w-4 h-4 bg-center bg-cover"
                :style="{backgroundImage: `url(${require('@/assets/img/roles/' + roles[index] + '.png')})`}"
              ></div>
              <div
                :class="index !== 0 ? '-mt-1' : ''"
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${data.enemyTeam[index].champion.id}.png')`}"
                class="w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full"
              ></div>
              <router-link
                :to="{ name: 'summoner', params: { region: $route.params.region, name: data.enemyTeam[index].name }}"
                class="ml-1 w-16 text-left overflow-hidden text-overflow whitespace-no-wrap text-xs text-blue-200 font-medium hover:text-blue-100"
              >{{ data.enemyTeam[index].name }}</router-link>
            </div>
          </div>
          <div class="ml-auto flex flex-col items-center justify-center">
            <img class="w-5 h-5" src="@/assets/img/icons/Stopwatch.svg" alt="Stopwatch" />
            <div class="text-lg text-teal-400 font-medium">{{ data.time }}</div>
            <div class="text-xs text-white font-medium">{{ data.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
  },

  computed: {
    matchResultClass() {
      return {
        'win': this.data.result === 'Win',
        'loss': this.data.result === 'Fail',
        'remake': this.data.result === 'Remake',
      }
    },
    ...mapState({
      roles: state => state.roles
    }),
    ...mapGetters('ddragon', ['version']),
  },

  methods: {
    isSummonerProfile(allyName) {
      return {
        'font-bold': this.$route.params.name.toLowerCase() === allyName.toLowerCase()
      }
    }
  }
}
</script>

<style scoped>
.match {
  /* background-image: linear-gradient(
    90deg,
    #2c5282 0%,
    rgba(44, 82, 130, 0) 100%
  ); */
}

.match::after {
  content: "";
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
}

.loss::after {
  background-image: linear-gradient(
    90deg,
    rgba(140, 0, 0, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.remake::after {
  background-image: linear-gradient(
    90deg,
    rgba(233, 169, 75, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.win::after {
  background-image: linear-gradient(
    90deg,
    rgba(1, 97, 28, 0.3) 0%,
    rgba(44, 82, 130, 0) 45%
  );
}

.game-status {
  top: 50%;
  left: 6px;
  transform: translateY(-50%) rotate(-90deg);
}

.crop-champion {
  background-size: 74px;
  background-position: center;
}

.items {
  width: 7rem;
  height: 4.5rem;
}

.gold {
  color: #f3a05a;
}

.damage {
  color: #e25656;
}

.kp {
  color: #b78787;
}
</style>
