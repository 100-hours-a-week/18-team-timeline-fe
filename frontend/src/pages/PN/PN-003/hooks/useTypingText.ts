import { useEffect, useState } from 'react'

export const useTypingText = (text: string, delay = 100, pause = 1000): string => {
  const [displayText, setDisplayText] = useState(text[0] || '')
  const [index, setIndex] = useState(1)

  useEffect(() => {
    if (!text) return

    let typingTimeout: NodeJS.Timeout

    if (index < text.length) {
      typingTimeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, delay)
    } else {
      typingTimeout = setTimeout(() => {
        setDisplayText(text[0])
        setIndex(1)
      }, pause)
    }

    return () => clearTimeout(typingTimeout)
  }, [index, text, delay, pause])

  return displayText
}
