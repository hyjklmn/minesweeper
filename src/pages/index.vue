<script setup lang="ts">
import { PlayGame } from "~/composables/logic"
import { toggleDev } from "~/composables"
const play = new PlayGame(10, 10, 10)
const state = computed(() => play.board)
useStorage("minesweeper-state", play.state)

watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div select-none>
    <p>
      <span cursor-pointer @click="toggleDev()">Minesweeper</span>
      <button border rounded @click="play.reset">reset</button>
      {{ play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0) }}
    </p>
    <div mt-3>
      <div v-for="(row, y) in state" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
  </div>
</template>
