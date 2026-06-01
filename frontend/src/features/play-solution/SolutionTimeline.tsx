import { Pause, Play } from 'lucide-react'
import { Button } from '../../shared/ui/Button'
import { Metric } from '../../shared/ui/Metric'
import type { SolverResponse } from '../../entities/puzzle/model'

type SolutionTimelineProps = {
  result: SolverResponse | null
  playing: boolean
  step: number
  onPlay: () => void
  onStop: () => void
}

export function SolutionTimeline({ result, playing, step, onPlay, onStop }: SolutionTimelineProps) {
  const statesCount = result?.states.length ?? 0
  const progress = statesCount <= 1 ? 0 : Math.round((step / (statesCount - 1)) * 100)

  return (
    <section className="timeline" aria-label="Пошаговое решение">
      <h3>Пошаговое решение</h3>

      <div className="timeline-row">
        <Button disabled={!result || statesCount <= 1} icon={playing ? Pause : Play} onClick={playing ? onStop : onPlay} tone="accent">
          {playing ? 'Пауза' : 'Проиграть'}
        </Button>
        <Metric label="прогресс" value={`${progress}%`} />
        <Metric label="шаг" value={`${Math.min(step, Math.max(statesCount - 1, 0))}/${Math.max(statesCount - 1, 0)}`} />
      </div>

      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  )
}
