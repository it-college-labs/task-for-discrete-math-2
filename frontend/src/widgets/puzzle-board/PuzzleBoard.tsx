import type { CSSProperties } from 'react'
import { canMoveTile, getTilePosition } from '../../entities/puzzle/lib'
import type { Board } from '../../entities/puzzle/model'

const TILES = Array.from({ length: 15 }, (_, index) => index + 1)

type PuzzleBoardProps = {
  board: Board
  locked?: boolean
  onTileClick?: (tile: number) => void
}

export function PuzzleBoard({ board, locked = false, onTileClick }: PuzzleBoardProps) {
  return (
    <div className="puzzle-board" aria-label="Игровое поле пятнашек">
      {TILES.map((tile) => {
        const position = getTilePosition(board, tile)
        const movable = !locked && canMoveTile(board, tile)

        return (
          <button
            aria-label={`Плитка ${tile}`}
            className={`tile ${movable ? 'tile--movable' : ''}`}
            disabled={!movable}
            key={tile}
            onClick={() => onTileClick?.(tile)}
            style={{
              transform: `translate3d(${position.col * 100}%, ${position.row * 100}%, 0)`,
            } satisfies CSSProperties}
            type="button"
          >
            <span>{tile}</span>
          </button>
        )
      })}
    </div>
  )
}
