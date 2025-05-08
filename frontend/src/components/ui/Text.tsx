import type { DetailedHTMLProps, HTMLAttributes, FC } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type TextProps = ReactDivProps & {}

export const Text: FC<TextProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'tracking-[-0.02em]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
