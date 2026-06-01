import { Brain, GitBranch, RotateCcw, Shuffle } from 'lucide-react'
import { SolutionTimeline } from '../play-solution/SolutionTimeline'
import { Button } from '../../shared/ui/Button'
import { Metric } from '../../shared/ui/Metric'
import type { Algorithm, SolverResponse } from '../../entities/puzzle/model'

type SolverPanelProps = {
  activeAlgorithm: Algorithm | null
  bfsResult: SolverResponse | null
  dfsResult: SolverResponse | null
  depthLimit: number
  speed: number
  selectedResult: SolverResponse | null
  playing: boolean
  step: number
  disabled?: boolean
  onBfs: () => void
  onDfs: () => void
  onDepthLimitChange: (value: number) => void
  onPlay: () => void
  onReset: () => void
  onShuffle: () => void
  onStop: () => void
  onSpeedChange: (value: number) => void
}

export function SolverPanel({
  activeAlgorithm,
  bfsResult,
  dfsResult,
  depthLimit,
  speed,
  selectedResult,
  playing,
  step,
  disabled = false,
  onBfs,
  onDfs,
  onDepthLimitChange,
  onPlay,
  onReset,
  onShuffle,
  onStop,
  onSpeedChange,
}: SolverPanelProps) {
  return (
    <section className="control-panel" aria-label="Панель управления">
      <div className="panel-heading">
        <h2>Панель управления</h2>
      </div>

      <div className="actions-grid">
        <Button disabled={disabled} icon={Brain} onClick={onBfs} tone="accent">
          {activeAlgorithm === 'BFS' ? 'Ищу BFS' : 'Решить BFS'}
        </Button>
        <Button disabled={disabled} icon={GitBranch} onClick={onDfs}>
          {activeAlgorithm === 'DFS' ? 'Ищу DFS' : 'Показать DFS'}
        </Button>
        <Button disabled={disabled} icon={Shuffle} onClick={onShuffle}>
          Перемешать
        </Button>
        <Button disabled={disabled} icon={RotateCcw} onClick={onReset}>
          Сбросить
        </Button>
      </div>

      <label className="field">
        <span>Глубина DFS {depthLimit}</span>
        <input
          max="80"
          min="0"
          onChange={(event) => onDepthLimitChange(Number(event.target.value))}
          type="range"
          value={depthLimit}
        />
      </label>

      <label className="field">
        <span>Скорость анимации {speed} мс</span>
        <input
          max="620"
          min="180"
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          step="20"
          type="range"
          value={speed}
        />
      </label>

      <div className="compare-strip">
        <SolverBadge result={bfsResult} title="BFS" />
        <SolverBadge result={dfsResult} title="DFS" />
      </div>

      <div className="insights">
        <Metric label="BFS глубина" value={bfsResult ? bfsResult.depth : 'нет'} />
        <Metric label="DFS глубина" value={dfsResult ? dfsResult.depth : 'нет'} />
        <Metric label="BFS время" value={bfsResult ? `${bfsResult.elapsedMs} мс` : 'нет'} />
        <Metric label="DFS время" value={dfsResult ? `${dfsResult.elapsedMs} мс` : 'нет'} />
      </div>

      <SolutionTimeline
        onPlay={onPlay}
        onStop={onStop}
        playing={playing}
        result={selectedResult}
        step={step}
      />
    </section>
  )
}

function SolverBadge({ result, title }: { result: SolverResponse | null; title: Algorithm }) {
  return (
    <article className="solver-badge">
      <span>{title}</span>
      <strong>{result ? `${result.depth} ходов` : 'ожидает'}</strong>
      <small>{result ? `${result.visitedCount} состояний` : 'запусти алгоритм'}</small>
    </article>
  )
}
