<script setup lang="ts">
import { BlockState } from "~/types"
import { isDev } from "~/composables"
defineProps<{ block: BlockState }>()

const numebrsColor = [
  "text-transparent",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-purple-500",
  "text-pink-500",
  "text-teal-500",
]

function getBlockClass(block: BlockState) {
  if (block.flagged) return "bg-gray-500/10"
  if (!block.revealed) return "bg-gray-500/10 hover:bg-gray/30"
  return block.mine ? "bg-red-500/50" : numebrsColor[block.adjacentMines]
}
</script>
<template>
  <button
    w-8
    h-8
    m="0.3"
    border="~ gray-500/50"
    vertical-top
    text-center
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-carbon-flag ma text-red-500 />
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine">
        <svg
          ma
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 1792 1792"
        >
          <path
            fill="currentColor"
            d="M571 589q-10-25-34-35t-49 0q-108 44-191 127T170 872q-10 25 0 49t35 34q13 5 24 5q42 0 60-40q34-84 98.5-148.5T536 673q25-11 35-35t0-49zm942-356l46 46l-244 243l68 68q19 19 19 45.5t-19 45.5l-64 64q89 161 89 343q0 143-55.5 273.5t-150 225t-225 150T704 1792t-273.5-55.5t-225-150t-150-225T0 1088t55.5-273.5t150-225t225-150T704 384q182 0 343 89l64-64q19-19 45.5-19t45.5 19l68 68zm8-56q-10 10-22 10q-13 0-23-10l-91-90q-9-10-9-23t9-23q10-9 23-9t23 9l90 91q10 9 10 22.5t-10 22.5zm230 230q-11 9-23 9t-23-9l-90-91q-10-9-10-22.5t10-22.5q9-10 22.5-10t22.5 10l91 90q9 10 9 23t-9 23zm41-183q0 14-9 23t-23 9h-96q-14 0-23-9t-9-23t9-23t23-9h96q14 0 23 9t9 23zM1600 32v96q0 14-9 23t-23 9t-23-9t-9-23V32q0-14 9-23t23-9t23 9t9 23zm151 55l-91 90q-10 10-22 10q-13 0-23-10q-10-9-10-22.5t10-22.5l90-91q10-9 23-9t23 9q9 10 9 23t-9 23z"
          />
        </svg>
      </div>
      <div v-else>{{ block.adjacentMines }}</div>
    </template>
  </button>
</template>
