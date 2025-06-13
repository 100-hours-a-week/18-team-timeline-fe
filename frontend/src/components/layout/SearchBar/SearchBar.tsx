import { useEffect, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { useSearchBarStore } from '@/stores/useSearchBarStore'
import { SearchBox } from './SearchBox'
import { KeywordBox } from './KeywordBox'
import { Toast } from '@/components/ui/Toast'
import { useSearchStore } from '@/stores/useSearchStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type SearchBarProps = ReactDivProps & {}

export const SearchBar = ({ className: _className }: SearchBarProps) => {
  const keywords = useSearchStore((state) => state.keywords)
  const closeSearch = useSearchBarStore((state) => state.close)
  const clearKeywords = useSearchStore((state) => state.clearKeywords)
  const toastMessage = useSearchStore((state) => state.toastMessage)
  const setToastMessage = useSearchStore((state) => state.setToastMessage)
  const hideToast = useSearchStore((state) => state.hideToast)

  useEffect(() => {
    if (toastMessage === '') return
    const timeout = setTimeout(() => {
      setToastMessage(toastMessage)
    }, 0)

    return () => clearTimeout(timeout)
  }, [toastMessage])

  useEffect(() => {
    hideToast()
  }, [])

  const className = clsx(
    'top-0 w-full h-[48px] bg-searchBarBg',
    'flex items-center justify-between px-[20px]',
    _className,
  )

  const searchBarClass = clsx('flex-col')
  const iconClass = clsx('text-SearchBarIcon cursor-pointer w-[32px] text-base font-medium')

  return (
    <>
      <div className={searchBarClass}>
        <div className={className}>
          <Icon
            name="ArrowLeftIcon"
            size={20}
            variant="solid"
            className={clsx(iconClass, 'mr-3')}
            onClick={() => {
              clearKeywords()
              closeSearch()
            }}
          />

          <SearchBox />
          <Link to={ROUTES.SEARCH_RESULTS}>
            <Text className={clsx(iconClass, 'ml-3')}>확인</Text>
          </Link>
        </div>
        {keywords.length > 0 && <KeywordBox />}
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
