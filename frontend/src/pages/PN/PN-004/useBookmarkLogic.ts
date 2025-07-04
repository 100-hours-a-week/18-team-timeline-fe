import { useEffect, useState } from 'react'
import { useRequestStore } from '@/stores/useRequestStore'
import { useNavigate } from 'react-router-dom'
import { ROUTES, ENDPOINTS } from '@/constants/url'
import { useAuthStore } from '@/stores/useAuthStore'
import type { News } from '../types/news'

export const useBookmarkLogic = () => {
  const [newsCards, setNewsCards] = useState<News[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [offset, setOffset] = useState('0')
  const [loading, setLoading] = useState(false)

  const { getData } = useRequestStore()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()

  const fetchBookmark = async (offset: string = '0', append = false) => {
    setLoading(true)
    try {
      const res = await getData(ENDPOINTS.BOOKMARK_FETCH(offset))
      if (append) {
        setNewsCards((prev) => {
          const map = new Map(prev.map((news) => [news.id, news]))
          for (const newItem of res.data.bookmarks) {
            map.set(newItem.id, newItem)
          }
          return Array.from(map.values())
        })
      } else {
        setNewsCards(res.data.bookmarks)
      }
      setHasNext(res.data.hasNext)
      setOffset(res.data.offset)
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
    fetchBookmark()
  }, [])

  return {
    newsCards,
    hasNext,
    offset,
    fetchBookmark,
    loading,
  }
}
