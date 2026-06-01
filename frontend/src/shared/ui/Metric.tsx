import type { ComponentType } from 'react'

type MetricProps = {
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>
  label: string
  value: string | number
}

export function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="metric">
      <div className="card-icon-row">
        {Icon ? <Icon size={20} strokeWidth={2.3} /> : null}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  )
}
