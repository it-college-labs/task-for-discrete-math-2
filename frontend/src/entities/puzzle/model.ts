export type Board = number[]
export type Move = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
export type Algorithm = 'BFS' | 'DFS'

export type SolverResponse = {
  algorithm: Algorithm
  solvable: boolean
  moves: Move[]
  states: Board[]
  visitedCount: number
  depth: number
  elapsedMs: number
  message: string | null
}

export const SOLVED_BOARD: Board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
export const BOARD_SIZE = 4
