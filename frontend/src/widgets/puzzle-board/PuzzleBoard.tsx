import { canMoveTile, getTilePosition } from '../../entities/puzzle/lib'
import type { Board } from '../../entities/puzzle/model'

type PuzzleBoardProps = {
  board: Board
  locked?: boolean
  onTileClick?: (tile: number) => void
}

export function PuzzleBoard({ board, locked = false, onTileClick }: PuzzleBoardProps) {
  return (
    <div className="puzzle-board" aria-label="Игровое поле пятнашек">
      {board
        .filter((tile) => tile !== 0)
        .map((tile) => {
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
                transform: `translate(${position.col * 100}%, ${position.row * 100}%)`,
              }}
              type="button"
            >
              <span>{tile}</span>
            </button>
          )
        })}
    </div>
  )
}
