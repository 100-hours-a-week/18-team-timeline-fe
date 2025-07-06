import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsCardListBox from '../components/layout/NewsCardListBox'
import { CreateNewsBtnBox } from './CreateNewsBtnBox'
import { useSearchResultLogic } from './useSearchResultLogic'
import { Toast } from '@/components/ui/Toast'
import { validateSearchKeyword } from '@/utils/validateSearchKeyword'
import { SearchResultMessage } from '@/constants/PN/SearchResultMessage'

const getTagsFromQuery = (search: string): string[] => {
  const params = new URLSearchParams(search)
  const rawTags = params.getAll('tags')

  return rawTags
    .flatMap((tag) => tag.split(','))
    .map((tag) => tag.trim())
    .filter((tag) => validateSearchKeyword(tag).isValid)
}

export default function SearchResultPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const location = useLocation()
  const tags = useMemo(() => getTagsFromQuery(location.search), [location.search])

  const { news, hasNext, offset, isButtonActive, isLoading, fetchNews, handleSubmit } = useSearchResultLogic({
    setToastMessage,
  })
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchNews(tags)
  }, [tags])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext) {
          fetchNews(tags, offset, true)
        }
      },
      { threshold: 1.0 },
    )

    const target = observerRef.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [tags, hasNext, offset, fetchNews])

  return (
    <div className="wrap">
      <CreateNewsBtnBox
        isButtonActive={isButtonActive}
        isLoading={isLoading}
        handleSubmit={(e) => handleSubmit(e, tags)}
      />
      <NewsCardListBox news={news} noNewsText={SearchResultMessage.NO_RESULT} />
      {hasNext && <div ref={observerRef} className="h-10" />}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  )
}
