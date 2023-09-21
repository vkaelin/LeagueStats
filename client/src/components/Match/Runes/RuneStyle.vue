<template>
  <div class="flex">
    <div
      :style="{
        backgroundImage: `url('${createCategoryBorderUrl(runeStyle.name)}')`,
      }"
      class="flex h-24 w-24 items-center justify-center bg-cover"
    >
      <div
        :style="{
          backgroundImage: `url('${createCategoryUrl(runeStyle.name)}')`,
        }"
        style="filter: brightness(1.2)"
        class="mt-4 h-56 w-56 bg-contain bg-center bg-no-repeat"
      ></div>
    </div>

    <div class="mt-24 space-y-4">
      <div v-for="(category, index) in slots" :key="`secondary-category-${index}`" class="">
        <div class="flex space-x-4">
          <ul v-for="runeId in category" :key="`slot-${runeId}`">
            <Tooltip>
              <template #trigger>
                <li
                  :style="{
                    backgroundImage: `url('${createCDragonAssetUrl(runes.perks[runeId].icon)}')`,
                  }"
                  :class="selectedRunes.selected.includes(runeId) ? 'used-rune' : 'not-used-rune'"
                  class="h-12 w-12 cursor-pointer rounded-full border-2 border-gray-700 bg-cover bg-center"
                ></li>
              </template>
              <template #default>
                <div class="flex max-w-md select-none p-2 text-left text-sm text-white">
                  <div
                    :style="{
                      backgroundImage: `url('${createCDragonAssetUrl(runes.perks[runeId].icon)}')`,
                    }"
                    class="ml-1 h-12 w-12 flex-shrink-0 rounded-md bg-blue-1000 bg-cover bg-center"
                  ></div>
                  <div class="ml-2 leading-none">
                    <div class="text-base">{{ runes.perks[runeId].name }}</div>
                    <div
                      v-html="runes.perks[runeId].desc"
                      class="rune-description mt-3 font-light leading-tight text-blue-200"
                    ></div>
                  </div>
                </div>
              </template>
            </Tooltip>
          </ul>
        </div>
        <div v-if="primary && index == 0" class="mt-4 h-0.5 w-full bg-gray-500 bg-opacity-25"></div>
      </div>

      <div v-if="!primary">
        <div class="mt-8 space-y-4">
          <div v-for="(row, index) in kStats" :key="`row-${index}`" class="flex space-x-8 px-3">
            <ul v-for="(kStat, i) in row" :key="`${kStat}-${i}`">
              <Tooltip>
                <template #trigger>
                  <li
                    :style="{
                      backgroundImage: `url('${createCDragonAssetUrl(runes.perks[kStat].icon)}')`,
                    }"
                    :class="
                      selectedRunes.selected[index + 6] === kStat ? 'used-rune' : 'not-used-rune'
                    "
                    class="h-8 w-8 cursor-pointer rounded-full border-2 border-gray-700 bg-gray-900 bg-cover bg-center"
                  ></li>
                </template>
                <template #default>
                  <div class="flex max-w-md select-none p-2 text-left text-sm text-white">
                    <div
                      :style="{
                        backgroundImage: `url('${createCDragonAssetUrl(runes.perks[kStat].icon)}')`,
                      }"
                      class="ml-1 h-8 w-8 flex-shrink-0 rounded-md bg-blue-1000 bg-cover bg-center"
                    ></div>
                    <div class="ml-2 leading-none">
                      <div class="text-base">{{ runes.perks[kStat].name }}</div>
                      <div
                        v-html="runes.perks[kStat].desc"
                        class="rune-description mt-3 font-light leading-tight text-blue-200"
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
      default: false,
    },
    runeStyle: {
      type: Object,
      required: true,
    },
  },

  computed: {
    slots() {
      return this.primary ? this.runeStyle.slots : this.runeStyle.slots.slice(1)
    },
    ...mapState({
      kStats: (state) => state.cdragon.kStats,
      runes: (state) => state.cdragon.runes,
      runesOpen: (state) => state.cdragon.runesOpen,
      selectedRunes: (state) => state.cdragon.selectedRunes,
    }),
  },

  methods: {
    createCategoryBorderUrl(name) {
      const lower = name.toLowerCase()
      return `https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-collections/global/default/perks/images/${lower}/vfx-${lower[0]}.png`
    },
    createCategoryUrl(name) {
      const lower = name.toLowerCase()
      return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/perks/images/${lower}/icon-${lower[0]}.png`
    },
    createCDragonAssetUrl,
  },
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
