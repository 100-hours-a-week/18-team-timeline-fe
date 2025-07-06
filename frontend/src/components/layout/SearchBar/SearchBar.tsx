import { useEffect } from 'react'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import clsx from 'clsx'
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
        .map((tag) => decodeURIComponent(tag.trim()))
        .filter(Boolean)
    : []

  useEffect(() => {
    hideToast()
  }, [hideToast])

  useEffect(() => {
    if (!isSearchResultsPage) return

    const store = useSearchStore.getState()
    const hasKeywords = store.keywords.length > 0

    if (!hasKeywords && tagsFromQuery.length > 0) {
      store.setKeywords(tagsFromQuery)
    }

    store.setInputValue('')
  }, [location.key])

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

  const containerClass = clsx('top-0 w-full h-[48px] bg-searchBarBg', 'flex items-center justify-between px-[20px]')

  const wrapperClass = clsx('flex-col')
  const iconClass = clsx('text-searchBarIcon cursor-pointer w-[32px] text-base font-medium')

  return (
    <>
      <div className={wrapperClass}>
        <div className={containerClass}>
          <Icon
            name="ArrowLeftIcon"
            size={20}
            variant="solid"
            className={clsx(iconClass, 'mr-3')}
            onClick={handleBack}
          />
          <SearchBox />
          <div>
            <Text className={clsx(iconClass, 'ml-3')} onClick={handleConfirm}>
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
