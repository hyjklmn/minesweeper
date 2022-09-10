import { BlockState } from "~/types"

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
export class PlayGame {
  state = ref<BlockState[][]>([])
  constructor(public width: number, public height: number) {
    this.reset()
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1) continue
        if (Math.abs(initial.y - block.y) <= 1) continue
        block.mine = Math.random() < 0.3
      }
    }
    this.updateNumbers()
  }

  updateNumbers() {
    this.state.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine) return
        this.getSiblings(block).forEach((b: BlockState) => {
          if (b.mine) block.adjacentMines += 1
        })
      })
    })
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines) return
    this.getSiblings(block).forEach((s: BlockState) => {
      if (!s.revealed) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }

  mineGenerated = false

  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      alert("boom")
    }
    this.expendZero(block)
  }
  onRightClick(block: BlockState) {
    if (block.revealed) return
    block.flagged = !block.flagged
  }

  getSiblings(block: BlockState) {
    return directions
      .map(([dx, dy]) => {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
          return undefined
        return this.state.value[y2][x2]
      })
      .filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.mineGenerated) return
    const blocks = this.state.value.flat()
    if (blocks.every((block) => block.flagged || block.revealed)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        alert("You Cheat!")
      } else {
        alert("You Win!")
      }
    }
  }
  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from(
        { length: this.width },
        (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
      )
    )
  }
}
