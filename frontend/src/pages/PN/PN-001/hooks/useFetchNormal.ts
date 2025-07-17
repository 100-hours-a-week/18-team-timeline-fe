import { useCallback, useEffect, useState } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import type { NewsByCategory } from '@/pages/PN/types/category'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'

export const useFetchNormal = () => {
  const [newsByCategory, setNewsByCategory] = useState<NewsByCategory>({})
  const { getData } = useRequestStore()
  const isAlarmOpen = useSidebarAlarmStore((state) => state.isOpen)

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

      setNewsByCategory((prev) => {
        const updated: NewsByCategory = { ...prev }

        for (const category in res.data) {
          const newList = res.data[category]?.newsList ?? []
          const prevList = prev[category]?.newsList ?? []

          const newItems = newList.filter((newItem) => !prevList.some((prevItem) => prevItem.id === newItem.id))

          updated[category] = {
            ...res.data[category],
            offset: prev[category]?.offset ?? 0,
            hasNext: prev[category]?.hasNext ?? true,
            newsList: [...newItems, ...prevList],
          }
        }

        return updated
      })
    } catch (err) {
      console.error('자동 새로고침 뉴스 로딩 오류:', err)
    }
  }, [getData])

  useEffect(() => {
    fetchNews()

    let interval: NodeJS.Timeout | null = null

    if (!isAlarmOpen) {
      interval = setInterval(() => {
        fetchLatestNews()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [fetchNews, fetchLatestNews, isAlarmOpen])

  return {
    newsByCategory,
    fetchNews,
  }
}
