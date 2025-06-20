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

  const { getData } = useRequestStore()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN)
      return
    }

    const fetchBookmark = async () => {
      try {
        const res = await getData(ENDPOINTS.BOOKMARK_FETCH)
        setNewsCards(res.data.bookmarks)
        setHasNext(res.data.hasNext)
        setOffset(res.data.offset)
      } catch (e) {
        console.error('투표 정보 조회 실패', e)
      }
    }
    fetchBookmark()
  }, [])

  return {
    newsCards,
    hasNext,
    offset,
  }
}
