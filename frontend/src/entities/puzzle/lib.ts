import { BOARD_SIZE, SOLVED_BOARD } from './model'
import type { Board, Move } from './model'

const MOVES: Move[] = ['UP', 'RIGHT', 'DOWN', 'LEFT']
const REVERSE_MOVE: Record<Move, Move> = {
  UP: 'DOWN',
  RIGHT: 'LEFT',
  DOWN: 'UP',
  LEFT: 'RIGHT',
}

export function getTilePosition(board: Board, tile: number) {
  const index = board.indexOf(tile)
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  }
}

export function canMoveTile(board: Board, tile: number) {
  const tileIndex = board.indexOf(tile)
  const emptyIndex = board.indexOf(0)
  const tileRow = Math.floor(tileIndex / BOARD_SIZE)
  const tileCol = tileIndex % BOARD_SIZE
  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
  const emptyCol = emptyIndex % BOARD_SIZE

  return Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1
}

export function moveTile(board: Board, tile: number): Board {
  if (!canMoveTile(board, tile)) {
    return board
  }

  const next = [...board]
  const tileIndex = next.indexOf(tile)
  const emptyIndex = next.indexOf(0)
  next[emptyIndex] = tile
  next[tileIndex] = 0
  return next
}

export function applyMove(board: Board, move: Move): Board {
  const emptyIndex = board.indexOf(0)
  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
  const emptyCol = emptyIndex % BOARD_SIZE
  const nextPosition = {
    UP: { row: emptyRow - 1, col: emptyCol },
    RIGHT: { row: emptyRow, col: emptyCol + 1 },
    DOWN: { row: emptyRow + 1, col: emptyCol },
    LEFT: { row: emptyRow, col: emptyCol - 1 },
  }[move]

  if (
    nextPosition.row < 0 ||
    nextPosition.row >= BOARD_SIZE ||
    nextPosition.col < 0 ||
    nextPosition.col >= BOARD_SIZE
  ) {
    return board
  }

  const targetIndex = nextPosition.row * BOARD_SIZE + nextPosition.col
  return moveTile(board, board[targetIndex])
}

export function shuffleBoard(steps = 10): Board {
  let board = [...SOLVED_BOARD]
  let previousMove: Move | null = null

  for (let step = 0; step < steps; step++) {
    const validMoves = MOVES.filter((move) => {
      if (previousMove && move === REVERSE_MOVE[previousMove]) {
        return false
      }
      return applyMove(board, move) !== board
    })
    const move = validMoves[Math.floor(Math.random() * validMoves.length)]
    board = applyMove(board, move)
    previousMove = move
  }

  return board
}

export function isSolved(board: Board) {
  return board.every((tile, index) => tile === SOLVED_BOARD[index])
}

export function formatMoves(moves: Move[]) {
  if (moves.length === 0) {
    return 'нет ходов'
  }
  return moves.join(' -> ')
}
