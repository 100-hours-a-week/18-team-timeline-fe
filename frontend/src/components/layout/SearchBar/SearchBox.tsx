import { useState, type KeyboardEvent, type ChangeEvent } from 'react'
import clsx from 'clsx'
import { Input } from '../../form/Input'
import { useSearchStore } from '@/stores/useSearchStore'

export const SearchBox = () => {
  const inputValue = useSearchStore((state) => state.inputValue)
  const setInputValue = useSearchStore((state) => state.setInputValue)
  const addKeyword = useSearchStore((state) => state.addKeyword)

  const [isComposing, setIsComposing] = useState(false)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.endsWith(' ')) {
      const trimmed = value.trim()
      addKeyword(trimmed)
    } else {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return

    const key = e.key
    if (key === 'Enter' || key === 'Tab') {
      e.preventDefault()
      addKeyword(inputValue.trim())
    }
  }

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => setIsComposing(false)

  const SearchBoxClass = clsx('w-full')

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
