import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type NewsCardrops = ReactDivProps & {
  id: string
  title: string
  summary: string
  image: string
  updatedAt: string
  bookmarked: boolean
}

export const NewsCard = ({ id, title, summary, image, updatedAt, bookmarked, className: _className }: NewsCardrops) => {
  const navigate = useNavigate()

  const wrapperClass =
    'flex flex-row items-center w-full overflow-hidden bg-newsCardBg border-b border-b-newsCardBorder cursor-pointer p-4 gap-4'

  const contentBoxClass = 'h-[120px] flex-grow flex flex-col justify-center gap-2'
  const titleClass = 'text-lg font-semibold text-newsCardTitle leading-tight line-clamp-2'
  const summaryClass = 'text-sm text-newsCardSummary leading-snug line-clamp-2'
  const timeClass = 'w-full text-xs text-newsCardTime text-right'

  const imageBoxClass = 'flex-shrink-0 w-[120px] h-[120px] flex items-center justify-center'
  const imageClass = 'w-full h-full object-cover rounded-[10px]'

  return (
    <div className={wrapperClass} onClick={() => navigate(ROUTES.getNewsDetailPath(id))}>
      <div className={imageBoxClass}>
        <img src={image} alt={title} className={imageClass} />
      </div>
      <div className={contentBoxClass}>
        <h3 className={titleClass}>{title}</h3>
        <div className={summaryClass}>{summary}</div>
        <div className={timeClass}>{formatRelativeTime(updatedAt)}</div>
      </div>
    </div>
  )
}
