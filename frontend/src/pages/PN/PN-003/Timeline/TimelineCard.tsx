import { useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { TimelineCard as TimelineCardType } from '../../types/timelineCard'
import { Icon } from '@/components/ui/Icon'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type TimelineCardProps = ReactDivProps & {
  data: TimelineCardType
  isLast?: boolean
}

export const TimelineCard = ({ data, isLast = false }: TimelineCardProps) => {
  const [showSources, setShowSources] = useState(false)

  const handleToggle = () => {
    setShowSources((prev) => !prev)
  }

  const cardWrapperClass = 'relative pl-6 pb-4'
  const verticalLineClass = 'absolute left-[8px] top-6 h-full border-l border-point border-dotted z-0'
  const circleClass = 'absolute left-[4.7px] top-[21px] w-2 h-2 rounded-full bg-point z-10'

  const cardContainerClass = clsx(
    'relative rounded-lg shadow-sm p-4 z-20',
    !showSources ? 'bg-timelineCardWhiteBg' : 'bg-timelineCardBlackBg',
  )
  const titleBoxClass = 'flex justify-between items-start min-w-0 gap-4'
  const titleClass = clsx(
    'font-bold leading-tight',
    !showSources ? 'text-timelineCardWhiteTitle' : 'text-timelineCardBlackTitle',
  )
  const dateClass = 'text-xs text-point mt-1'
  const iconBoxClass = 'flex shrink-0'
  const iconClass = clsx(
    'cursor-pointer',
    !showSources ? 'text-timelineCardWhiteContent' : 'text-timelineCardBlackContent',
  )
  const contentClass = clsx(
    'pt-2',
    !showSources ? 'text-timelineCardWhiteContent text-sm' : 'text-timelineCardBlackContent text-xs truncate',
  )

  return (
    <div className={cardWrapperClass}>
      {!isLast && <div className={verticalLineClass} />}
      <div className={circleClass} />

      <div className={cardContainerClass}>
        <div className={titleBoxClass}>
          <div>
            <h3 className={titleClass}>{data.title}</h3>
            <p className={dateClass}>
              {data.startAt} ~ {data.endAt}
            </p>
          </div>
          <div className={iconBoxClass}>
            <Icon
              name="BookOpenIcon"
              size={18}
              variant={showSources ? 'solid' : 'outline'}
              className={iconClass}
              onClick={handleToggle}
            />
          </div>
        </div>

        {/* 본문 또는 출처 */}
        <div className={contentClass}>
          {!showSources ? (
            <p>{data.content}</p>
          ) : (
            data.source &&
            data.source.length > 0 && (
              <ul className="space-y-2">
                {data.source.map((source, index) => (
                  <li key={index}>
                    <strong>출처 {index + 1}:</strong>{' '}
                    <a href={source} target="_blank" rel="noopener noreferrer">
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  )
}
