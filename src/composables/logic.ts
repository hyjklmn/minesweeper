import { Ref } from "vue"
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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: "play" | "won" | "lost"
}
export class PlayGame {
  state = ref() as Ref<GameState>

  constructor(
    public width: number,
    public height: number,
    public mines: number
  ) {
    this.reset()
  }
  random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }
  randomInt(min: number, max: number) {
    return Math.round(this.random(min, max))
  }

  generateMines(state: BlockState[][], initial: BlockState) {
    const placeRandom = () => {
      const x = this.randomInt(0, this.width - 1)
      const y = this.randomInt(0, this.height - 1)
      const block = state[y][x]
      if (Math.abs(initial.x - block.x) <= 1) return false
      if (Math.abs(initial.y - block.y) <= 1) return false
      if (block.mine) return false
      block.mine = true
      return true
    }
    Array.from({ length: this.mines }, () => {}).forEach(() => {
      let placed = false

      while (!placed) {
        placed = placeRandom()
      }
    })
    this.updateNumbers()
  }

  updateNumbers() {
    this.board.forEach((row) => {
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

  onClick(block: BlockState) {
    if (this.state.value.gameState !== "play") return

    if (!this.state.value.mineGenerated) {
      this.generateMines(this.board, block)
      this.state.value.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      this.state.value.gameState = "lost"
      this.showAllMines()
      this.revealedFlags()
      return
    }
    this.expendZero(block)
  }
  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== "play") return
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
        return this.board[y2][x2]
      })
      .filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.state.value.mineGenerated) return
    const blocks = this.board.flat()

    if (blocks.every((block) => block.revealed || block.flagged)) {
      if (blocks.some((block) => block.flagged && !block.mine)) {
        this.state.value.gameState = "lost"
        this.showAllMines()
        alert("lost")
      } else {
        this.state.value.gameState = "won"
      }
    }
  }
  showAllMines() {
    const blocks = this.board.flat()
    blocks.forEach((block) => {
      if (block.mine) {
        block.revealed = true
      }
    })
  }
  revealedFlags() {
    const blocks = this.board.flat()
    blocks.forEach((block) => {
      block.flagged = false
    })
  }

  get board() {
    return this.state.value.board
  }

  get blocks() {
    return this.state.value.board.flat()
  }

  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: "play",
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from(
          { length: this.width },
          (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
        )
      ),
    }
  }
}
