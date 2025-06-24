import NewsCardListBox from '../components/layout/NewsCardListBox'
import { useBookmarkLogic } from './useBookmarkLogic'
import { BookmarkMessage } from '@/constants/PN/BookmarkMessage'
import { BookmarkTitleBox } from './BookmarkTitleBox'
import { useEffect, useRef } from 'react'

export default function BookmarkPage() {
  const { newsCards, hasNext, offset, fetchBookmark, loading } = useBookmarkLogic()
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext && !loading) {
          fetchBookmark(offset, true)
        }
      },
      { threshold: 1.0 },
    )

    const target = observerRef.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasNext, offset, loading, fetchBookmark])

  return (
    <div className="wrap">
      <BookmarkTitleBox />
      <NewsCardListBox news={newsCards} noNewsText={BookmarkMessage.NO_RESULT} />
      {hasNext && <div ref={observerRef} className="h-10" />}
    </div>
  )
}
