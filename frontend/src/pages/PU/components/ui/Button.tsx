import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ButtonProps = ReactDivProps & {
  text?: string
  isActive?: boolean
}

export const Button = ({ text, isActive = false }: ButtonProps) => {
  const buttonClass = clsx(
    'w-full h-9 text-base text-btnText rounded-[5px]',
    isActive ? 'bg-btnActiveBg' : 'bg-btnInactiveBg',
  )

  return (
    <button className={buttonClass} disabled={!isActive}>
      {text}
    </button>
  )
}
