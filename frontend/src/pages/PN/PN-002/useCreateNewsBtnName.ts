import { useEffect, useState } from 'react'
import { SearchResultMessage } from '@/constants/PN/SearchResultMessage'

export const useCreateNewsBtnName = (isLoading: boolean): string => {
  const dotSequence = ['', '.', '..', '...']
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setStep(0)
      return
    }

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % dotSequence.length)
    }, 500)

    return () => clearInterval(interval)
  }, [dotSequence.length, isLoading])

  return isLoading
    ? `${SearchResultMessage.CREATE_NEWS_BTN_LOADING}${dotSequence[step]}`
    : SearchResultMessage.CREATE_NEWS_BTN_NAME
}
