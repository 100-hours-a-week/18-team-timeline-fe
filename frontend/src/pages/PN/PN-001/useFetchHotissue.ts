import { useEffect, useState } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import type { News } from '../types/news'

export const useFetchHotissue = () => {
  const [newsCards, setNewsCards] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const { getData } = useRequestStore()

  useEffect(() => {
    const fetchCarouselNews = async () => {
      try {
        const res = await getData(ENDPOINTS.NEWS_HOTISSUE)
        setNewsCards(res.data.newsList)
      } catch (err) {
        console.error('핫이슈 뉴스 데이터 가져오기 오류:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCarouselNews()
  }, [])

  return { newsCards, loading }
}
