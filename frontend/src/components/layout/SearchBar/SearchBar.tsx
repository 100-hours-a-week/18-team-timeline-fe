import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSearchBarStore } from '@/stores/useSearchBarStore'
import { SearchBox } from './SearchBox'
import { KeywordBox } from './KeywordBox'
import { Toast } from '@/components/ui/Toast'
import { useSearchStore } from '@/stores/useSearchStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type SearchBarProps = ReactDivProps & {}

export const SearchBar = ({ className: _className }: SearchBarProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isSearchResultsPage = location.pathname === ROUTES.SEARCH_RESULTS

  const keywords = useSearchStore((state) => state.keywords)
  const clearKeywords = useSearchStore((state) => state.clearKeywords)
  const toastMessage = useSearchStore((state) => state.toastMessage)
  const hideToast = useSearchStore((state) => state.hideToast)

  const closeSearch = useSearchBarStore((state) => state.close)

  useEffect(() => {
    if (toastMessage !== '') {
      const timer = setTimeout(() => {
        hideToast()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage, hideToast])

  useEffect(() => {
    hideToast()
  }, [hideToast])

  const handleBack = () => {
    clearKeywords()
    if (isSearchResultsPage) {
      closeSearch()
      navigate(ROUTES.MAIN)
    } else {
      closeSearch()
    }
  }

  const handleConfirm = () => {
    if (keywords.length === 0) return
    const tagsParam = keywords.map(encodeURIComponent).join(',')
    navigate(`${ROUTES.SEARCH_RESULTS}?tags=${tagsParam}`)
  }

  const containerClass = clsx(
    'top-0 w-full h-[48px] bg-searchBarBg',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  const wrapperClass = clsx('flex-col')
  const iconClass = clsx('text-SearchBarIcon cursor-pointer w-[32px] text-base font-medium')

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
              확인
            </Text>
          </div>
        </div>
        {keywords.length > 0 && <KeywordBox />}
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
