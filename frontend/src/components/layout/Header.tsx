import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

type HeaderProps = ReactDivProps & {}

const HeaderClass = 'top-0 left-0 w-full h-[50px] bg-headerColor'

export const Header = ({ className: _className }: HeaderProps) => {
  const className = clsx(
    HeaderClass,
    _className
  )

  return (
    <div className={className}>
    </div>
  )
}
