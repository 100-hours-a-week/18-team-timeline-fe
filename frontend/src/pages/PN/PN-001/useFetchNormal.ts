import { useEffect, useState } from 'react'
import { ENDPOINTS } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { type NewsByCategory } from '../types/category'

export const useFetchNormal = () => {
  const [newsByCategory, setNewsByCategory] = useState<NewsByCategory>({})
  const { getData } = useRequestStore()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getData(ENDPOINTS.NEWS)
        const data = res.data as NewsByCategory
        setNewsByCategory(data)
        
        // 각 카테고리별 뉴스 개수 로깅
        console.log('카테고리별 뉴스 개수:')
        Object.entries(data).forEach(([category, categoryData]) => {
          console.log(`${category}: ${categoryData.newsList.length}개`)
        })
      } catch (err) {
        console.error('일반 뉴스 데이터 가져오기 오류:', err)
      }
    }
    fetchNews()
  }, [])

  return { newsByCategory }
}
