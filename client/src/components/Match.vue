<template>
  <li :class="matchResultClass" class="match mt-4 rounded-lg text-white text-sm md:text-base">
    <div class="match-container">
      <div class="flex flex-wrap px-5 py-3">
        <div class="first w-1/3 text-left">
          <div>
            <div
              class="h-6 text-lg text-teal-500 font-extrabold uppercase leading-none"
            >{{ data.champion.name }}</div>

            <div class="flex">
              <div class="flex flex-col justify-end items-center">
                <div
                  v-if="data.role !== 'NONE'"
                  class="w-10 h-10 bg-center bg-cover"
                  :style="{backgroundImage: `url(${require('@/assets/img/roles/' + data.role + '.png')})`}"
                ></div>
                <div
                  class="w-10 text-center text-xs text-teal-500 font-extrabold"
                >LVL {{ data.level }}</div>
              </div>
              <div
                class="ml-2 w-16 h-16 crop-champion bg-blue-1000 rounded-lg mb-2px sm:mb-0 sm:mr-2px"
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${$patch}/img/champion/${data.champion.id}.png')`}"
              ></div>
              <div class="ml-2 flex flex-row sm:flex-col sm:justify-around">
                <div
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                  :style="{backgroundImage: `url(${data.firstSum})`}"
                ></div>
                <div
                  class="w-6 h-6 bg-blue-1000 rounded-md bg-center bg-cover"
                  :style="{backgroundImage: `url(${data.secondSum})`}"
                ></div>
              </div>
              <div class="ml-1 flex flex-row sm:flex-col sm:justify-around">
                <div
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                  :style="{background: `url(${data.primaryRune}) center/cover`}"
                ></div>
                <div
                  class="w-6 h-6 bg-blue-1000 rounded-md"
                  :style="{background: `url(${data.secondaryRune}) center/cover`}"
                ></div>
              </div>
              <div class="ml-12 flex flex-col justify-center items-center leading-none">
                <div class="text-3xl font-extrabold text-teal-500">
                  <span class>{{ data.kills }}</span>
                  <span class>/</span>
                  <span class>{{ data.deaths }}</span>
                  <span class>/</span>
                  <span class>{{ data.assists }}</span>
                </div>
                <div class="mt-2 text-white text-sm font-extrabold">{{ data.kda }} KDA</div>
              </div>
            </div>

            <div
              class="h-6 flex items-end text-sm text-white font-extrabold leading-none"
            >{{ data.gamemode }}</div>
          </div>
        </div>

        <div class="second w-1/3 py-6 flex items-center">
          <div class="items flex flex-wrap">
            <div
              v-for="(item, index) in data.items"
              :key="index"
              :style="{backgroundImage: item}"
              class="ml-1 w-8 h-8 rounded-md bg-blue-1000 bg-center bg-cover"
            ></div>
          </div>

          <div class="ml-12 leading-none">
            <div class="flex items-center">
              <img src="@/assets/img/icons/Creep.svg" alt="Minions" />
              <div class="ml-1 text-teal-300 text-lg font-bold">
                {{ data.minions }}
                <span class="font-normal">cs</span>
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Gold.svg" alt="Gold" />
              <div class="ml-1 gold text-lg font-bold">
                {{ data.gold }}
                <span class="font-normal">gold</span>
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/Damage.svg" alt="Damage" />
              <div class="ml-1 damage text-lg font-bold">
                {{ data.damage }}
                <span class="font-normal">damage</span>
              </div>
            </div>
            <div class="flex items-center">
              <img src="@/assets/img/icons/KillParticipation.svg" alt="KillParticipation" />
              <div class="ml-1 kp text-lg font-bold">
                {{ data.kp }}
                <span class="font-normal">kp</span>
              </div>
            </div>
          </div>
        </div>

        <div class="third w-1/3 py-1 flex items-center">
          <div>
            <div
              v-for="(ally, index) in data.allyTeam"
              :key="'player-' + index"
              class="flex items-center leading-none"
            >
              <router-link
                :to="{ name: 'summoner', params: { region: $route.params.region, name: ally.name }}"
                class="w-20 text-right overflow-hidden text-overflow whitespace-no-wrap text-sm text-blue-200 font-medium hover:text-blue-100"
              >{{ ally.name }}</router-link>
              <div
                class="ml-1 w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full overflow-hidden"
                :class="index !== 0 ? '-mt-1': ''"
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${$patch}/img/champion/${ally.champion.id}.png')`}"
              ></div>
              <div
                class="mx-3 w-4 h-4 bg-center bg-cover"
                :style="{backgroundImage: `url(${require('@/assets/img/roles/' + roles[index] + '.png')})`}"
              ></div>
              <div
                class="w-6 h-6 bg-blue-1000 bg-center bg-cover rounded-full"
                :class="index !== 0 ? '-mt-1' : ''"
                :style="{backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/${$patch}/img/champion/${data.enemyTeam[index].champion.id}.png')`}"
              ></div>
              <router-link
                :to="{ name: 'summoner', params: { region: $route.params.region, name: data.enemyTeam[index].name }}"
                class="ml-1 w-20 text-left overflow-hidden text-overflow whitespace-no-wrap text-sm text-blue-200 font-medium hover:text-blue-100"
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
import { mapState } from 'vuex'

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
  }
}
</script>

<style scoped>
.loss {
  background-image: linear-gradient(
      89.21deg,
      rgba(140, 0, 0, 0.38) 0.09%,
      rgba(44, 82, 130, 0) 68.58%
    ),
    linear-gradient(90deg, #2c5282 0%, rgba(44, 82, 130, 0) 101.52%);
}

.win {
  background-image: linear-gradient(
      89.45deg,
      rgba(1, 97, 28, 0.38) -18.36%,
      rgba(44, 82, 130, 0) 85.07%
    ),
    linear-gradient(90deg, #2c5282 0%, rgba(44, 82, 130, 0) 101.52%);
}

.remake {
  background-image: linear-gradient(
      89.45deg,
      rgba(233, 169, 75, 0.38) -1.14%,
      rgba(44, 82, 130, 0) 58.83%
    ),
    linear-gradient(90deg, #2c5282 0%, rgba(44, 82, 130, 0) 101.52%);
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
