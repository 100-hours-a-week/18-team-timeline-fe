import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Text } from '@/components/ui/Text'
import { useNavigate } from 'react-router-dom'

export type AlarmCardProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  key: number
  title: string
  content: string
  isChecked: boolean
  createdAt: string
  targetType?: string
  targetId?: number
  onClick?: () => void
}

export const AlarmCard = ({
  key,
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
    if (targetType && targetId !== undefined) {
      navigate(`/${targetType}/${targetId}`)
    }
  }

  const handleClick = () => {
    onClick?.()
    handleNavigate()
  }

  const wrapperClass = clsx(
    'w-full flex flex-col px-4 py-6 border-[0.5px]',
    isChecked ? 'bg-alarmCardCheckedBg border-alarmCardCheckedBg' : 'bg-alarmCardBg border-alarmCardBg',
  )
  const clickable = targetType && targetId !== undefined
  const navigationClass = clsx(
    clickable && 'cursor-pointer',
    isChecked ? 'hover:bg-alarmCardCheckedHoverBg' : 'hover:bg-alarmCardHoverBg'
  )

  const titleBoxClass = 'flex justify-between items-center gap-2'
  const titleClass =
    'text-xl font-semibold text-alarmCardTitle truncate whitespace-nowrap overflow-hidden max-w-[224px]'
  const contentClass = 'text-xs text-alarmCardContent max-w-[280px]'
  const dateClass = 'text-xs text-alarmCardDate flex-shrink-0'

  return (
    <div key={key} className={clsx(wrapperClass, navigationClass)} onClick={handleClick}>
      <div className={titleBoxClass}>
        <Text className={titleClass}>{title}</Text>
        <Text className={dateClass}>{createdAt}</Text>
      </div>
      <Text className={contentClass}>{content}</Text>
    </div>
  )
}
