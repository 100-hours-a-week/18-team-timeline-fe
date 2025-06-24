import NewsCardListBox from '../components/layout/NewsCardListBox'
import { useBookmarkLogic } from './useBookmarkLogic'
import { BookmarkMessage } from '@/constants/PN/BookmarkMessage'
import { BookmarkTitleBox } from './BookmarkTitleBox'
import { useRef, useCallback, useEffect } from 'react'

export default function BookmarkPage() {
  const { newsCards, hasNext, offset, loadMoreBookmarks, loading } = useBookmarkLogic()

  const observer = useRef<IntersectionObserver | null>(null)
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNext) {
        loadMoreBookmarks()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasNext, loadMoreBookmarks])

  return (
    <div className="wrap">
      <BookmarkTitleBox />
      <NewsCardListBox news={newsCards} noNewsText={BookmarkMessage.NO_RESULT} lastItemRef={lastItemRef} />
    </div>
  )
}
