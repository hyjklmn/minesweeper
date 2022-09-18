<script setup lang="ts">
import { PlayGame } from "~/composables/logic"
import { toggleDev } from "~/composables"
const play = new PlayGame(9, 9, 10)
const state = computed(() => play.board)

useStorage("minesweeper-state", play.state)

watchEffect(() => {
  play.checkGameState()
})

function newGame(difficulty: "easy" | "medium" | "hard") {
  switch (difficulty) {
    case "easy":
      play.reset(9, 9, 10)
      break
    case "medium":
      play.reset(16, 16, 40)
      break
    case "hard":
      play.reset(30, 16, 99)
      break
  }
}
</script>

<template>
  <div select-none>
    <p>
      <span cursor-pointer @click="toggleDev()">Minesweeper</span>
    </p>
    <div>
      <button border rounded @click="play.reset()">reset</button>
      {{ play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0) }}
      <button @click="newGame('easy')">easy</button>
      <button @click="newGame('medium')">medium</button>
      <button @click="newGame('hard')">hard</button>
    </div>
    <div ma mt-3 w-max>
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
    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
