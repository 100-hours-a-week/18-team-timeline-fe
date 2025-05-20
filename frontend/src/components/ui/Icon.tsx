import * as OutlineIcons from '@heroicons/react/24/outline'
import * as SolidIcons from '@heroicons/react/24/solid'
import type { FC } from 'react'
import clsx from 'clsx'

type IconName = keyof typeof OutlineIcons
type Variant = 'outline' | 'solid'

interface IconProps extends React.ComponentProps<'svg'> {
  name: IconName
  size?: number
  className?: string
  variant?: Variant
}

export const Icon: FC<IconProps> = ({
  name,
  size = 24,
  className,
  variant = 'outline',
  ...props
}) => {
  const IconComponent = variant === 'solid' ? SolidIcons[name] : OutlineIcons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist in ${variant} set`)
    return null
  }

  return (
    <IconComponent
      className={clsx('inline-block', className)}
      width={size}
      height={size}
      {...props}
    />
  )
}
