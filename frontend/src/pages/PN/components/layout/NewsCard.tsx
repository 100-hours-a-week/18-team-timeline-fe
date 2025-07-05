import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRelativeDateTime } from '../../../../utils/getRelativeDateTime'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { Icon } from '@/components/ui/Icon'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/stores/useAuthStore'
import clsx from 'clsx'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type NewsCardProps = ReactDivProps & {
  id: string
  title: string
  summary: string
  image: string
  updatedAt: string
  bookmarked: boolean
}

export const NewsCard = ({
  id,
  title,
  summary,
  image,
  updatedAt,
  bookmarked: initialBookmarked,
  className: _className,
}: NewsCardProps) => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)

  const handleBookmark = async () => {
    if (!isLoggedIn) return
    try {
      if (bookmarked) {
        await axiosInstance.delete(ENDPOINTS.BOOKMARK(id))
        setBookmarked(false)
      } else {
        await axiosInstance.post(ENDPOINTS.BOOKMARK(id))
        setBookmarked(true)
      }
    } catch (e) {
      console.error('북마크 처리 실패:', e)
    }
  }

  const wrapperClass =
    'flex flex-row items-center w-full overflow-hidden bg-newsCardBg border-b border-b-newsCardBorder p-4 gap-4'
  const imageBoxClass = 'flex-shrink-0 w-[120px] h-[120px] flex items-center justify-center cursor-pointer'
  const imageClass = 'w-full h-full object-cover rounded-[10px]'

  const contentBoxClass = 'h-[120px] flex-grow flex flex-col justify-center gap-2'
  const titleClass = 'text-lg font-semibold text-newsCardTitle leading-tight line-clamp-2 cursor-pointer'
  const summaryClass = 'text-sm text-newsCardSummary leading-snug line-clamp-2'

  const metaTextClass = 'flex justify-center items-center gap-2'
  const timeClass = 'w-full text-xs text-newsCardTime text-right'
  const iconClass = clsx('text-newsCardIcon', isLoggedIn && 'cursor-pointer')

  return (
    <div className={wrapperClass}>
      <div className={imageBoxClass} onClick={() => navigate(ROUTES.getNewsDetailPath(id))}>
        {image && image.trim() !== '' && <img src={image} alt={title} className={imageClass} />}
      </div>

      <div className={contentBoxClass}>
        <h3 className={titleClass} onClick={() => navigate(ROUTES.getNewsDetailPath(id))}>
          {title}
        </h3>
        <div className={summaryClass}>{summary}</div>
        <div className={metaTextClass}>
          <div className={timeClass}>{getRelativeDateTime(updatedAt) + ' 업데이트'}</div>
          <Icon
            name="BookmarkIcon"
            size={18}
            variant={bookmarked ? 'solid' : 'outline'}
            className={iconClass}
            onClick={handleBookmark}
          />
        </div>
      </div>
    </div>
  )
}
