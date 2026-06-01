import { useEffect, useMemo, useState } from 'react'
import { isSolved, moveTile, shuffleBoard } from '../../entities/puzzle/lib'
import { SOLVED_BOARD } from '../../entities/puzzle/model'
import type { Algorithm, Board, SolverResponse } from '../../entities/puzzle/model'
import { solveWithBfs, solveWithDfs } from '../../shared/api/puzzleApi'
import { SolverPanel } from '../../features/solve-puzzle/SolverPanel'
import { PuzzleBoard } from '../../widgets/puzzle-board/PuzzleBoard'

export function PuzzlePage() {
  const [board, setBoard] = useState<Board>(() => shuffleBoard())
  const [bfsResult, setBfsResult] = useState<SolverResponse | null>(null)
  const [dfsResult, setDfsResult] = useState<SolverResponse | null>(null)
  const [selectedResult, setSelectedResult] = useState<SolverResponse | null>(null)
  const [activeAlgorithm, setActiveAlgorithm] = useState<Algorithm | null>(null)
  const [depthLimit, setDepthLimit] = useState(32)
  const [speed, setSpeed] = useState(360)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [consoleLines, setConsoleLines] = useState<string[]>(['> приложение готово'])

  const solved = useMemo(() => isSolved(board), [board])
  const locked = activeAlgorithm !== null || playing

  useEffect(() => {
    if (!playing || !selectedResult) {
      return
    }

    const lastStep = selectedResult.states.length - 1
    if (step >= lastStep) {
      return
    }

    const timer = window.setTimeout(() => {
      const nextStep = step + 1
      setStep(nextStep)
      setBoard(selectedResult.states[nextStep])
      setConsoleLines((lines) => [...lines.slice(-5), `> ход ${nextStep} из ${lastStep}`])
      if (nextStep >= lastStep) {
        setPlaying(false)
        setConsoleLines((lines) => [...lines.slice(-5), '> анимация решения завершена'])
      }
    }, speed)

    return () => window.clearTimeout(timer)
  }, [playing, selectedResult, speed, step])

  async function runSolver(algorithm: Algorithm) {
    setActiveAlgorithm(algorithm)
    setPlaying(false)
    setStep(0)
    setConsoleLines((lines) => [...lines.slice(-5), `> запуск ${algorithm}`])

    try {
      const result = algorithm === 'BFS' ? await solveWithBfs(board) : await solveWithDfs(board, depthLimit)
      if (algorithm === 'BFS') {
        setBfsResult(result)
      } else {
        setDfsResult(result)
      }
      setSelectedResult(result)
      setConsoleLines((lines) => [
        ...lines.slice(-4),
        `> ${algorithm} посетил ${result.visitedCount} состояний`,
        result.message ?? `> найдено ходов ${result.moves.length}`,
      ])
      if (result.states.length > 1 && result.solvable) {
        setBoard(result.states[0])
        setPlaying(true)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'неизвестная ошибка'
      setConsoleLines((lines) => [...lines.slice(-5), `> ошибка ${message}`])
    } finally {
      setActiveAlgorithm(null)
    }
  }

  function resetBoard() {
    setBoard([...SOLVED_BOARD])
    setBfsResult(null)
    setDfsResult(null)
    setSelectedResult(null)
    setStep(0)
    setPlaying(false)
    setConsoleLines(['> поле сброшено'])
  }

  function shuffle() {
    setBoard(shuffleBoard())
    setBfsResult(null)
    setDfsResult(null)
    setSelectedResult(null)
    setStep(0)
    setPlaying(false)
    setConsoleLines(['> поле перемешано'])
  }

  function handleTileClick(tile: number) {
    setBoard((current) => moveTile(current, tile))
    setSelectedResult(null)
    setStep(0)
  }

  return (
    <main className="page-shell">
      <header className="app-header">
        <h1>Задание ДМ: Пятнашки</h1>
      </header>

      <section className="workspace">
        <SolverPanel
          activeAlgorithm={activeAlgorithm}
          bfsResult={bfsResult}
          consoleLines={consoleLines}
          depthLimit={depthLimit}
          dfsResult={dfsResult}
          disabled={locked}
          onBfs={() => void runSolver('BFS')}
          onDepthLimitChange={setDepthLimit}
          onDfs={() => void runSolver('DFS')}
          onReset={resetBoard}
          onShuffle={shuffle}
          onSpeedChange={setSpeed}
          speed={speed}
        />

        <div className="board-column" data-solved={solved}>
          <PuzzleBoard board={board} locked={locked} onTileClick={handleTileClick} />
        </div>
      </section>
    </main>
  )
}
