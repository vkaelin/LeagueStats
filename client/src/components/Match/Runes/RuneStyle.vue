<template>
  <div class="flex">
    <div
      :style="{
        backgroundImage: `url('${createCategoryBorderUrl(runeStyle.name)}')`,
      }"
      class="flex items-center justify-center w-24 h-24 bg-cover"
    >
      <div
        :style="{
          backgroundImage: `url('${createCategoryUrl(runeStyle.name)}')`,
        }"
        style="filter: brightness(1.2)"
        class="w-56 h-56 mt-4 bg-center bg-no-repeat bg-contain"
      ></div>
    </div>

    <div class="mt-24 space-y-4">
      <div
        v-for="(category, index) in slots"
        :key="`secondary-category-${index}`"
        class=""
      >
        <div class="flex space-x-4">
          <ul v-for="runeId in category" :key="`slot-${runeId}`">
            <Tooltip>
              <template v-slot:trigger>
                <li
                  :style="{
                    backgroundImage: `url('${createCDragonAssetUrl(
                      runes.perks[runeId].icon
                    )}')`,
                  }"
                  :class="
                    selectedRunes.selected.includes(runeId)
                      ? 'used-rune'
                      : 'not-used-rune'
                  "
                  class="w-12 h-12 bg-center bg-cover border-2 border-gray-700 rounded-full cursor-pointer"
                ></li>
              </template>
              <template v-slot:default>
                <div
                  class="flex max-w-md p-2 text-sm text-left text-white select-none"
                >
                  <div
                    :style="{
                      backgroundImage: `url('${createCDragonAssetUrl(
                        runes.perks[runeId].icon
                      )}')`,
                    }"
                    class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-blue-1000"
                  ></div>
                  <div class="ml-2 leading-none">
                    <div class="text-base">{{ runes.perks[runeId].name }}</div>
                    <div
                      v-html="runes.perks[runeId].desc"
                      class="mt-3 font-light leading-tight text-blue-200 rune-description"
                    ></div>
                  </div>
                </div>
              </template>
            </Tooltip>
          </ul>
        </div>
        <div
          v-if="primary && index == 0"
          class="w-full mt-4 bg-gray-500 bg-opacity-25 h-2px"
        ></div>
      </div>

      <div v-if="!primary">
        <div class="mt-8 space-y-4">
          <div
            v-for="(row, index) in kStats"
            :key="`row-${index}`"
            class="flex px-3 space-x-8"
          >
            <ul v-for="(kStat, i) in row" :key="`${kStat}-${i}`">
              <Tooltip>
                <template v-slot:trigger>
                  <li
                    :style="{
                      backgroundImage: `url('${createCDragonAssetUrl(
                        runes.perks[kStat].icon
                      )}')`,
                    }"
                    :class="
                      selectedRunes.selected[index + 6] === kStat
                        ? 'used-rune'
                        : 'not-used-rune'
                    "
                    class="w-8 h-8 bg-gray-900 bg-center bg-cover border-2 border-gray-700 rounded-full cursor-pointer"
                  ></li>
                </template>
                <template v-slot:default>
                  <div
                    class="flex max-w-md p-2 text-sm text-left text-white select-none"
                  >
                    <div
                      :style="{
                        backgroundImage: `url('${createCDragonAssetUrl(
                          runes.perks[kStat].icon
                        )}')`,
                      }"
                      class="flex-shrink-0 w-8 h-8 ml-1 bg-center bg-cover rounded-md bg-blue-1000"
                    ></div>
                    <div class="ml-2 leading-none">
                      <div class="text-base">{{ runes.perks[kStat].name }}</div>
                      <div
                        v-html="runes.perks[kStat].desc"
                        class="mt-3 font-light leading-tight text-blue-200 rune-description"
                      ></div>
                    </div>
                  </div>
                </template>
              </Tooltip>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { createCDragonAssetUrl } from '@/helpers/functions'
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    primary: {
      type: Boolean,
      default: false
    },
    runeStyle: {
      type: Object,
      required: true
    }
  },

  computed: {
    slots() {
      return this.primary ? this.runeStyle.slots : this.runeStyle.slots.slice(1)
    },
    ...mapState({
      kStats: state => state.cdragon.kStats,
      runes: state => state.cdragon.runes,
      runesOpen: state => state.cdragon.runesOpen,
      selectedRunes: state => state.cdragon.selectedRunes
    }),
  },

  methods: {
    createCategoryBorderUrl(name) {
      const lower = name.toLowerCase()
      return `http://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-collections/global/default/perks/images/${lower}/vfx-${lower[0]}.png`
    },
    createCategoryUrl(name) {
      const lower = name.toLowerCase()
      return `http://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/perks/images/${lower}/icon-${lower[0]}.png`
    },
    createCDragonAssetUrl,
  }
}
</script>

<style scoped>
.not-used-rune {
  @apply opacity-50 transition-all duration-150 ease-in-out;
  filter: grayscale(100%);
}

.not-used-rune:hover {
  @apply opacity-100;
  filter: none;
}

.used-rune {
  @apply transition-all duration-75 ease-in-out;
}

.used-rune:hover {
  filter: brightness(1.2);
}

.rune-description >>> hr {
  @apply border-blue-800;
}
</style>
