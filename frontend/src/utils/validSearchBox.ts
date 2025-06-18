export type KeywordSearchKeywordType =
  | { isValid: true }
  | { isValid: false; reason: 'empty' | 'jamo' | 'special' | 'number' }

export const validateSearchKeyword = (value: string): KeywordSearchKeywordType => {
  const trimmed = value.trim()

  if (trimmed.length === 0) return { isValid: false, reason: 'empty' }

  if (/[ㄱ-ㅎㅏ-ㅣ]/.test(trimmed)) return { isValid: false, reason: 'jamo' }
  if (/[0-9]/.test(trimmed)) return { isValid: false, reason: 'number' }
  if (/[^a-zA-Z가-힣]/.test(trimmed)) return { isValid: false, reason: 'special' }

  return { isValid: true }
}
