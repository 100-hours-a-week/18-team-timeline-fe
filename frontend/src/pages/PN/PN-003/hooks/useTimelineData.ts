import { useState, useEffect } from 'react'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useNavigate } from 'node_modules/react-router-dom/dist/index.mjs'
import type { NewsDetail } from '../../types/newsDetail'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'
import { checkUpdateAvailable } from '../../utils/checkUpdateAvailable'

interface UseTimelineDataProps {
  newsId: string
  setToastMessage: (message: string, position?: any) => void
}

export const useTimelineData = ({ newsId, setToastMessage }: UseTimelineDataProps) => {
  const [news, setNews] = useState<NewsDetail>()
  const [bookmarked, setBookmarked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)

  const { isLoggedIn } = useAuthStore()
  const { getData, patchData, postData, deleteData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNews = async () => {
      setError(null)
      try {
        const res = await getData(ENDPOINTS.NEWS_DETAIL(newsId))
        if (res.success === false) {
          setError(res.data.message || TimelineMessage.NO_NEWS_DATA)
          navigate(ROUTES.MAIN)
          return
        }

        if (res.success === false || !res.data.news) {
          navigate(ROUTES.MAIN)
          return
        }

        setNews(res.data.news)
        setBookmarked(res.data.news.bookmarked)
        setIsUpdateAvailable(checkUpdateAvailable(res.data.news.updatedAt))
      } catch (err) {
        console.error('뉴스 데이터 가져오기 오류:', err)
        navigate(ROUTES.MAIN)
      }
    }

    fetchNews()
  }, [newsId])

  // 북마크 핸들러
  const handleBookmark = async () => {
    if (!isLoggedIn) return
    setToastMessage('')
    try {
      if (bookmarked) {
        await deleteData(ENDPOINTS.BOOKMARK(newsId))
        setBookmarked(false)
        setToastMessage(TimelineMessage.BOOKMARK_POST_SUCCESS)
      } else {
        await postData(ENDPOINTS.BOOKMARK(newsId))
        setBookmarked(true)
        setToastMessage(TimelineMessage.BOOKMARK_DELETE_SUCCESS)
      }
    } catch (e) {
      console.error('북마크 처리 실패:', e)
      setToastMessage(TimelineMessage.BOOKMARK_FAIL)
    }
  }

  // 공유하기 핸들러
  const handleShare = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setToastMessage(TimelineMessage.URL_COPY_SUCCESS)
        return Promise.resolve()
      } catch (err) {
        console.error('URL 복사 실패:', err)
        setToastMessage(TimelineMessage.URL_COPY_FAIL)
        return Promise.reject(err)
      }
    }
    return Promise.reject(new Error('Clipboard API not available'))
  }

  // 타임라인 업데이트 핸들러
  const handleTimelineUpdate = async () => {
    if (!newsId || !news) return Promise.reject(new Error(TimelineMessage.NO_NEWS_DATA))

    if (!isLoggedIn) {
      return Promise.reject(new Error(TimelineMessage.NOT_CERTIFICATED))
    }

    if (!isUpdateAvailable) {
      return Promise.reject(new Error(TimelineMessage.NOT_TIME_LIMIT))
    }

    setToastMessage('')
    try {
      setIsUpdating(true)
      const res = await patchData(ENDPOINTS.NEWS_DETAIL(newsId))

      const news = res.data.news
      setNews(news)
      setBookmarked(news.bookmarked)
      setIsUpdateAvailable(checkUpdateAvailable(news.updatedAt))
      setToastMessage(TimelineMessage.TIMELINE_UPDATE_SUCCESS)
    } catch (err) {
      console.error('타임라인 업데이트 오류:', err)
      setToastMessage(TimelineMessage.TIMELINE_UPDATE_FAIL)
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    news,
    bookmarked,
    isUpdateAvailable,
    isUpdating,
    handleBookmark,
    handleShare,
    handleTimelineUpdate,
  }
}
