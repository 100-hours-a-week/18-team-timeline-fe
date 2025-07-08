import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Text } from '@/components/ui/Text'
import { useNavigate } from 'react-router-dom'

export type AlarmCardProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  title: string
  content: string
  isChecked: boolean
  createdAt: string
  targetType?: string
  targetId?: number
  onClick?: () => void
}

export const AlarmCard = ({
  title,
  content,
  isChecked,
  createdAt,
  targetType,
  targetId,
  onClick,
}: AlarmCardProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (targetType) {
      if (targetType.toLowerCase() === 'news') {
        navigate(targetId != null ? `/news/${targetId}` : '/main')
      } else {
        navigate(targetId != null ? `/${targetType.toLowerCase()}/${targetId}` : `/${targetType.toLowerCase()}`)
      }
    }
  }

  const handleClick = () => {
    onClick?.()
    handleNavigate()
  }

  const wrapperClass = clsx('w-full flex flex-col px-4 py-6 border-[0.5px] bg-alarmCardBg border-alarmCardBorder')
  const clickable = targetType && targetId !== undefined
  const navigationClass = clsx(clickable && 'cursor-pointer hover:bg-alarmCardHoverBg')

  const titleBoxClass = 'flex justify-between items-center gap-2'
  const titleClass = clsx(
    'text-xl font-semibold truncate whitespace-nowrap overflow-hidden max-w-[224px]',
    !isChecked ? 'text-alarmCardTitle' : 'text-alarmCardChecked',
  )
  const contentClass = clsx('text-xs max-w-[280px]', !isChecked ? 'text-alarmCardContent' : 'text-alarmCardChecked')
  const dateClass = clsx('text-xs flex-shrink-0', !isChecked ? 'text-alarmCardDate' : 'text-alarmCardChecked')

  return (
    <div className={clsx(wrapperClass, navigationClass)} onClick={handleClick}>
      <div className={titleBoxClass}>
        <Text className={titleClass}>{title}</Text>
        <Text className={dateClass}>{createdAt}</Text>
      </div>
      <Text className={contentClass}>{content}</Text>
    </div>
  )
}
