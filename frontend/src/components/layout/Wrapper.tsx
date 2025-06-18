import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Text } from '@/components/ui/Text'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type WrapperProps = ReactDivProps & {
  title: string
  content?: string
  children: React.ReactNode
}

export const Wrapper = ({ title, content, className: _className, children }: WrapperProps) => {
  const className = clsx('h-fit rounded-xl mx-7 my-16 py-14 flex flex-col bg-puWrapper', _className)
  const titleClass = clsx(
    'text-3xl font-extrabold text-puTitle text-center',
    content ? 'pb-1' : 'pb-9'
  )
  const contentClass = clsx('text-xs text-center pb-7')

  return (
    <div className={className}>
      <Text className={titleClass}>{title}</Text>
      {content && <Text className={contentClass}>{content}</Text>}
      <div>{children}</div>
    </div>
  )
}
