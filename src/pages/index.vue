<script setup lang="ts">
import { BlockState } from "~/types"
import { toggleDev } from "~/composables"

const WIDTH = 10
const HEIGHT = 10
const state = ref<BlockState[][]>([])

function reset() {
  state.value = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
    )
  )
}

function generateMines(state: BlockState[][], initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1) continue
      if (Math.abs(initial.y - block.y) <= 1) continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers(state)
}
const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

function updateNumbers(state: BlockState[][]) {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine) return
      getSiblings(block).forEach((b: BlockState) => {
        if (b.mine) block.adjacentMines += 1
      })
    })
  })
}

function expendZero(block: BlockState) {
  if (block.adjacentMines) return
  getSiblings(block).forEach((s: BlockState) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}

let mineGenerated = false

function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(state.value, block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine) {
    alert("boom")
  }
  expendZero(block)
}
function onRightClick(block: BlockState) {
  if (block.revealed) return
  block.flagged = !block.flagged
}

function getSiblings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return undefined
      return state.value[y2][x2]
    })
    .filter(Boolean) as BlockState[]
}

function checkGameState() {
  if (!mineGenerated) return
  const blocks = state.value.flat()
  if (blocks.every((block) => block.flagged || block.revealed)) {
    if (blocks.some((block) => block.flagged && !block.mine)) {
      alert("You Cheat!")
    } else {
      alert("You Win!")
    }
  }
}
reset()
watchEffect(checkGameState)
</script>

<template>
  <div select-none>
    <p @click="toggleDev()" cursor-pointer>Minesweeper</p>
    <div mt-3>
      <div v-for="(row, y) in state" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        />
      </div>
    </div>
  </div>
</template>
