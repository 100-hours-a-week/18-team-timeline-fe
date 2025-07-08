import { useCallback, useEffect, useState } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import type { NewsByCategory } from '@/pages/PN/types/category'

export const useFetchNormal = () => {
  const [newsByCategory, setNewsByCategory] = useState<NewsByCategory>({})
  const { getData } = useRequestStore()

  const fetchNews = useCallback(
    async (category: string = '', offset: string = '0', append = false) => {
      try {
        category = category.toUpperCase() as keyof NewsByCategory
        const res = await getData(ENDPOINTS.NEWS_FETCH(category, offset))

        if (!append) {
          setNewsByCategory(res.data)
          return
        }

        const newList = res.data[category]?.newsList ?? []

        setNewsByCategory((prev) => {
          const prevList = prev[category]?.newsList ?? []
          return {
            ...prev,
            [category]: {
              ...res.data[category],
              newsList: [...prevList, ...newList],
            },
          }
        })
      } catch (err) {
        console.error('일반 뉴스 데이터 로딩 오류:', err)
      }
    },
    [getData],
  )

  const fetchLatestNews = useCallback(async () => {
    try {
      const res = await getData(ENDPOINTS.NEWS_FETCH())
      setNewsByCategory(res.data)
    } catch (err) {
      console.error('자동 새로고침 뉴스 로딩 오류:', err)
    }
  }, [getData])

  useEffect(() => {
    fetchNews()

    const interval = setInterval(() => {
      fetchLatestNews()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchLatestNews])

  return {
    newsByCategory,
    fetchNews,
  }
}
