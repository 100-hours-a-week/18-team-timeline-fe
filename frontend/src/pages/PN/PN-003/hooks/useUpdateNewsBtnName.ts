import { useEffect, useState } from 'react'
import { TimelineMessage } from '@/constants/PN/TimelineMessage'

export const useUpdateNewsBtnName = (isLoading: boolean): string => {
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
  }, [isLoading])

  return isLoading
    ? `${TimelineMessage.TIMELINE_UPDATE_BTN_LOADING}${dotSequence[step]}`
    : TimelineMessage.TIMELINE_UPDATE_BTN_NAME
}
