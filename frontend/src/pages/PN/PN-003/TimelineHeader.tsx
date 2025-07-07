import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { getRelativeDateTime } from '@/utils/getRelativeDateTime'
import { Icon } from '@/components/ui/Icon'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type TimelineHeaderProps = ReactDivProps & {
  isLoggedIn: boolean
  title: string
  updatedAt: string
  bookmarked: boolean
  onToggleBookmark: () => void
  onShare: () => void
}

export const TimelineHeader = ({
  isLoggedIn,
  title,
  updatedAt,
  bookmarked,
  onToggleBookmark,
  onShare,
}: TimelineHeaderProps) => {
  const wrapperClass = 'w-full bg-white p-4'
  const titleBoxClass = 'flex justify-between items-start mb-1 gap-4'
  const titleClass = 'text-lg font-bold text-timelineCardWhiteTitle leading-tight'
  const iconBoxClass = 'flex items-center flex-shrink-0 gap-4'
  const iconClass = 'text-timelineMetaText mt-0.5 cursor-pointer'
  const dateClass = 'text-xs text-point'

  return (
    <div className={wrapperClass}>
      <div className={titleBoxClass}>
        <h2 className={titleClass}>{title}</h2>
        <div className={iconBoxClass}>
          <Icon name="ShareIcon" size={18} variant="solid" className={iconClass} onClick={onShare} />
          {isLoggedIn && (
            <Icon
              name="BookmarkIcon"
              size={18}
              variant={bookmarked ? 'solid' : 'outline'}
              className={iconClass}
              onClick={onToggleBookmark}
            />
          )}
        </div>
      </div>
      <p className={dateClass}>{getRelativeDateTime(updatedAt) + ' 업데이트'}</p>
    </div>
  )
}
