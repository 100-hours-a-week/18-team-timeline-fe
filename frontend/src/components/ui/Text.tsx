import type { DetailedHTMLProps, HTMLAttributes, FC } from 'react'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type TextProps = ReactDivProps & {
  size?: number
  weight?: number
  tracking?: number
  leading?: number
}

export const Text: FC<TextProps> = ({
  size = 16,
  weight = 400,
  tracking = -0.02,
  leading = 16,
  className,
  children,
  ...props
}) => {
  const tailwindSize = `text-[${size}px]`
  const tailwindWeight = `font-${weight}`
  const tailwindTracking = `tracking-[${tracking}em]`
  const tailwindLeading = `leading-[${leading}px]`

  return (
    <div className={clsx(
      tailwindSize,
      tailwindWeight, 
      tailwindTracking, 
      tailwindLeading, 
      className
    )} {...props}>
      {children}
    </div>
  )
}
