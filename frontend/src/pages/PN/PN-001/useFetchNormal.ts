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
        setNewsByCategory(res.data)
      } catch (err) {
        console.error('일반 뉴스 데이터 가져오기 오류:', err)
      }
    }
    fetchNews()
  }, [])

  return { newsByCategory }
}
