import type { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  text: string
  isActive: boolean
}

export const Button = ({ text, isActive = false, className: _className, onClick }: ButtonProps) => {
  const className = clsx(
    'w-[180px] h-[45px] text-base font-semibold text-btnText rounded-[30px] whitespace-pre-line leading-tight',
    isActive ? 'bg-pnBtnActiveBg hover:bg-pnBtnHoverBg ' : 'bg-pnBtnInactiveBg text-pnBtnInactiveText',
    _className,
  )

  return (
    <button className={className} disabled={!isActive} onClick={onClick}>
      {text}
    </button>
  )
}
