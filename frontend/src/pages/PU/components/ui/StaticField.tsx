import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Text } from '@/components/ui/Text'

type StaticFieldProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  label: string
  content: string
}

export const StaticField = ({ label, content, className: _className }: StaticFieldProps) => {
  const containerClass = clsx('w-full flex flex-col justify-center', _className)
  const labelClass = clsx('text-base font-semibold text-labelText')
  const contentClass = clsx('text-sm font-light text-myBlack')

  return (
    <Text className={containerClass}>
      <p className={labelClass}>{label}</p>
      <p className={contentClass}>{content}</p>
    </Text>
  )
}
