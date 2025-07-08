import { useEffect } from 'react'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSearchBarStore } from '@/stores/useSearchBarStore'
import { SearchBox } from './SearchBox'
import { KeywordBox } from './KeywordBox'
import { Toast } from '@/components/ui/Toast'
import { useSearchStore } from '@/stores/useSearchStore'
import { SearchBarMessage } from '@/constants/SearchBarMessage'

export const SearchBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isSearchResultsPage = location.pathname === ROUTES.SEARCH_RESULTS

  const keywords = useSearchStore((state) => state.keywords)
  const clearKeywords = useSearchStore((state) => state.clearKeywords)
  const toastMessage = useSearchStore((state) => state.toastMessage)
  const hideToast = useSearchStore((state) => state.hideToast)
  const closeSearch = useSearchBarStore((state) => state.close)

  const tagsParam = searchParams.get('tags')
  const tagsFromQuery = tagsParam
    ? tagsParam
        .split(',')
        .map((tag): string => decodeURIComponent(tag.trim()))
        .filter(Boolean)
    : []

  useEffect(() => {
    hideToast()
  }, [hideToast])

  useEffect(() => {
    if (!isSearchResultsPage) return

    const store = useSearchStore.getState()
    if (tagsFromQuery.length > 0 && store.keywords.length === 0) {
      store.setKeywords(tagsFromQuery)
    }

    store.setInputValue('')
  }, [])

  const handleBack = () => {
    clearKeywords()
    closeSearch()
    if (isSearchResultsPage) {
      navigate(ROUTES.MAIN)
    }
  }

  const handleConfirm = () => {
    if (keywords.length === 0) {
      useSearchStore.getState().setToastMessage(SearchBarMessage.INVALID_KEYWORD)
      return
    }

    const tagsParam = keywords.map(encodeURIComponent).join(',')
    navigate(`${ROUTES.SEARCH_RESULTS}?tags=${tagsParam}`)
  }

  const wrapperClass = 'flex-col'
  const containerClass =
    'top-0 w-full h-[48px] bg-searchBarBg flex items-center justify-between px-4 gap-3 border-b border-b-keywordBoxLine'
  const iconClass = 'text-searchBarIcon cursor-pointer w-[32px] text-base font-medium'

  return (
    <>
      <div className={wrapperClass}>
        <div className={containerClass}>
          <Icon name="ArrowLeftIcon" size={20} variant="solid" className={iconClass} onClick={handleBack} />
          <SearchBox />
          <div>
            <Text className={iconClass} onClick={handleConfirm}>
              검색
            </Text>
          </div>
        </div>
        {keywords.length > 0 && <KeywordBox />}
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
