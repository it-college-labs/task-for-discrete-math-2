import type { ComponentType, ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>
  tone?: 'accent' | 'neutral'
}

export function Button({ children, icon: Icon, tone = 'neutral', className = '', ...props }: ButtonProps) {
  return (
    <button className={`button button--${tone} ${className}`} type="button" {...props}>
      {Icon ? <Icon size={22} strokeWidth={2.2} /> : null}
      <span>{children}</span>
    </button>
  )
}
