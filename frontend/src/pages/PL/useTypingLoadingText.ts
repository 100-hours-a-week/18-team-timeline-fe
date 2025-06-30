import { useEffect, useState } from 'react'
import { LoadingMessage } from '@/constants/PL/LoadingMessage'

export const useTypingLoadingText = (): string => {
  const dotSequence = ['', '.', '..', '...']
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % dotSequence.length)
    }, 500)

    return () => clearInterval(interval)
  })

  return `${LoadingMessage.LOADING}${dotSequence[step]}`
}
