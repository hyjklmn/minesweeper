<script setup lang="ts">
import { PlayGame } from "~/composables/logic"
import { language, toggleDev } from "~/composables"
import { useI18n } from "vue-i18n"
const play = new PlayGame(9, 9, 10)
const state = computed(() => play.board)
const i18n = useI18n()
const lang = useSessionStorage("lang", language)
const minesCount = computed(() => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
})

// const { counter, pause, resume } = useInterval(1000, { controls: true })
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
function change(type: string) {
  i18n.locale.value = type
  lang.value = type
}
</script>

<template>
  <div select-none>
    <button @click="change('zh')" i-carbon-translate></button>
    <p>
      <span cursor-pointer @click="toggleDev()">{{ $t(`text.title`) }}</span>
    </p>
    <div flex="~" justify-center items-center text-xl my-2 gap-3>
      <div flex="~" justify-center items-center>
        <div i-carbon-timer></div>
      </div>
      <div flex="~" justify-center items-center>
        {{ minesCount }}
      </div>
    </div>

    <div flex="~" justify-center items-center gap-3>
      <button border rounded @click="play.reset()">
        {{ $t(`text.Reset`) }}
      </button>
      <button border rounded @click="newGame('easy')">
        {{ $t(`text.Easy`) }}
      </button>
      <button border rounded @click="newGame('medium')">
        {{ $t(`text.Medium`) }}
      </button>
      <button border rounded @click="newGame('hard')">
        {{ $t(`text.Hard`) }}
      </button>
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
