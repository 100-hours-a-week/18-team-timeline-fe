import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { useRequestStore } from '@/stores/useRequestStore'
import { useAuthStore } from '@/stores/useAuthStore'
import type { News } from '../types/news'
import { SearchResultMessage } from '@/constants/PN/SearchResultMessage'

interface SearchResultLogicProps {
  setToastMessage: (msg: string) => void
}

export const useSearchResultLogic = ({ setToastMessage }: SearchResultLogicProps) => {
  const [news, setNews] = useState<News[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [offset, setOffset] = useState('0')
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { getData, postData } = useRequestStore()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()

  const fetchNews = async (tags: string[], offset: string = '0', append: boolean = false) => {
    if (tags.length === 0) return

    try {
      const res = await getData(ENDPOINTS.NEWS_SEARCH(tags, offset))
      if (append) {
        setNews((prev) => {
          const prevIds = new Set(prev.map((n) => n.id))
          const filtered = res.data.newsList.filter((n: News) => !prevIds.has(n.id))
          return [...prev, ...filtered]
        })
      } else {
        setNews(res.data.newsList)
      }
      setHasNext(res.data.hasNext)
      setOffset(res.data.offset)
      setIsButtonActive(isLoggedIn && !isLoading && tags.length > 0)
    } catch (e) {
      console.error('뉴스 검색 실패', e)
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, tags: string[]) => {
    e.preventDefault()
    if (tags.length === 0) {
      setToastMessage('');
      setTimeout(() => {
        setToastMessage('태그를 최소한 1개 입력해주세요');
      }, 0);
      return;
    }
    if (!isButtonActive || isLoading) return

    setToastMessage('')
    setIsLoading(true)

    try {
      const res = await postData(ENDPOINTS.NEWS, { keywords: tags })
      if (res.data?.news?.id) {
        navigate(ROUTES.getNewsDetailPath(res.data.news.id))
      } else {
        setTimeout(() => {
          setToastMessage(res?.message || SearchResultMessage.CREATE_NEWS_TIMEOUT)
        }, 0)
      }
    } catch (e: any) {
      const errorMsg = e?.response?.message || SearchResultMessage.CREATE_NEWS_FAIL
      setTimeout(() => {
        setToastMessage(errorMsg)
      }, 0)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    news,
    hasNext,
    offset,
    isButtonActive,
    isLoading,
    fetchNews,
    handleSubmit,
  }
}
