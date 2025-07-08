import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ContainerProps = ReactDivProps & {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
const wrapperClass = clsx(
  'relative z-10',
  'w-full max-w-[390px]',
  'h-screen flex flex-col mx-auto bg-myWhite overflow-hidden shadow-lg'
)

  return <div className={wrapperClass}>{children}</div>
}
