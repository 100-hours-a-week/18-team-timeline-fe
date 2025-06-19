import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsCardListBox from '../components/layout/NewsCardListBox'
import { CreateNewsBtnBox } from './CreateNewsBtnBox'
import { useSearchResultLogic } from './useSearchResultLogic'
import { Toast } from '@/components/ui/Toast'
import { validateSearchKeyword } from '@/utils/validSearchBox'
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

  const { news, isButtonActive, isLoading, fetchNews, handleSubmit } = useSearchResultLogic({ setToastMessage })

  useEffect(() => {
    fetchNews(tags, 0)
  }, [tags])

  return (
    <div className="wrap bg-pvBg overflow-y-auto">
      <CreateNewsBtnBox
        isButtonActive={isButtonActive}
        isLoading={isLoading}
        handleSubmit={(e) => handleSubmit(e, tags)}
      />
      <NewsCardListBox news={news} noNewsText={SearchResultMessage.NO_RESULT} />
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  )
}
