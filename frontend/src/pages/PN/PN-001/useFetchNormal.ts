import { useEffect, useState, useCallback } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { type NewsByCategory, type Category } from '../types/category'

export const useFetchNormal = () => {
  const [newsByCategory, setNewsByCategory] = useState<NewsByCategory>({})
  const [loading, setLoading] = useState(false)
  const { getData } = useRequestStore()

  const fetchNews = useCallback(async (category: Category = 'ALL', offset: number = 0) => {
    try {
      setLoading(true)
      const res = await getData(`${ENDPOINTS.NEWS}?category=${category}&offset=${offset}`)
      const data = res.data as NewsByCategory
      
      if (offset === 0) {
        // 초기 로딩
        setNewsByCategory(data)
      } else {
        // 추가 로딩
        setNewsByCategory(prev => {
          const newData = { ...prev }
          Object.entries(data).forEach(([cat, catData]) => {
            if (newData[cat as Category]) {
              newData[cat as Category] = {
                ...catData,
                newsList: [...(newData[cat as Category]?.newsList || []), ...catData.newsList]
              }
            } else {
              newData[cat as Category] = catData
            }
          })
          return newData
        })
      }
      
      // 각 카테고리별 뉴스 개수 로깅
      console.log('카테고리별 뉴스 개수:')
      Object.entries(data).forEach(([category, categoryData]) => {
        console.log(`${category}: ${categoryData.newsList.length}개`)
      })
    } catch (err) {
      console.error('일반 뉴스 데이터 가져오기 오류:', err)
    } finally {
      setLoading(false)
    }
  }, [getData])

  const loadMore = useCallback(async (category: Category = 'ALL') => {
    const currentCategory = newsByCategory[category]
    if (currentCategory && currentCategory.hasNext && !loading) {
      await fetchNews(category, currentCategory.offset)
    }
  }, [newsByCategory, loading, fetchNews])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return { 
    newsByCategory, 
    loading, 
    loadMore,
    hasMore: (category: Category = 'ALL') => newsByCategory[category]?.hasNext || false
  }
}
