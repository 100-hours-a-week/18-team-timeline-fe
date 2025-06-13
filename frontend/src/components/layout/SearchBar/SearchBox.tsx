import { useState, type DetailedHTMLProps, type HTMLAttributes, type KeyboardEvent, type ChangeEvent } from 'react'
import clsx from 'clsx'
import { Input } from '../../form/Input'
import { validateSearchKeyword } from '@/utils/validSearchBox'
import { useSearchStore } from '@/stores/useSearchStore'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type SearchBoxProps = ReactDivProps & {}

export const SearchBox = ({ className: _className }: SearchBoxProps) => {
  const inputValue = useSearchStore((state) => state.inputValue)
  const setInputValue = useSearchStore((state) => state.setInputValue)
  const addKeyword = useSearchStore((state) => state.addKeyword)

  const [isComposing, setIsComposing] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.endsWith(' ')) {
      const trimmed = value.trim()
      const result = validateSearchKeyword(trimmed)

      if (!result.isValid) {
        setInputValue('')
        return
      }

      addKeyword(trimmed)
      console.log(useSearchStore.getState().keywords)
    } else {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return

    const key = e.key
    if (key === 'Enter' || key === 'Tab') {
      e.preventDefault()
      const trimmed = inputValue.trim()
      const result = validateSearchKeyword(trimmed)

      if (!result.isValid) {
        setInputValue('')
        return
      }

      addKeyword(trimmed)
    }
  }

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)

  const SearchBoxClass = clsx('w-full bg-SearchBoxBg')

  return (
    <div className={SearchBoxClass}>
      <Input
        value={inputValue}
        placeholder="검색어를 입력하세요."
        maxLength={10}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    </div>
  )
}
