import { useEffect, useState } from 'react'
import { useRequestStore } from '@/stores/useRequestStore'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { useAuthStore } from '@/stores/useAuthStore'
import type { News } from '../types/news'

export const useBookmarkLogic = () => {
  const [newsCards, setNewsCards] = useState<News[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)

  const { getData } = useRequestStore()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()

  const fetchBookmark = async (offsetParam = 0, append = false) => {
    setLoading(true)
    try {
      const url = `${ENDPOINTS.BOOKMARK_FETCH}?offset=${offsetParam}`
      console.log('[fetchBookmark] 호출:', url, 'append:', append)
      const res = await getData(url)
      if (append) {
        setNewsCards((prev) => {
          const merged = [...prev, ...res.data.bookmarks]
          console.log('[fetchBookmark] append, 총 개수:', merged.length)
          return merged
        })
      } else {
        setNewsCards(res.data.bookmarks)
        console.log('[fetchBookmark] 초기 로드, 개수:', res.data.bookmarks.length)
      }
      setHasNext(res.data.hasNext)
      setOffset(res.data.offset)
      console.log('[fetchBookmark] hasNext:', res.data.hasNext, 'offset:', res.data.offset)
    } catch (e) {
      console.error('북마크 정보 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN)
      return
    }
    fetchBookmark(0, false)
  }, [])

  const loadMoreBookmarks = () => {
    if (!loading && hasNext) {
      console.log('[loadMoreBookmarks] 호출, offset:', offset)
      fetchBookmark(offset, true)
    }
  }

  return {
    newsCards,
    hasNext,
    offset,
    loadMoreBookmarks,
    loading,
  }
}
