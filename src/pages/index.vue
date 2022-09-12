<script setup lang="ts">
import { PlayGame } from "~/composables/logic"
import { toggleDev } from "~/composables"
const play = new PlayGame(12, 12)
const state = computed(() => play.board)
useStorage("minesweeper-state", play.state)
</script>

<template>
  <div select-none>
    <p>
      <span cursor-pointer @click="toggleDev()">Minesweeper</span>
      <button border rounded @click="play.reset">reset</button>
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
