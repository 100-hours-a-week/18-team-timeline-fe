import { SearchBarMessage } from '@/constants/SearchBarMessage'
import { validateSearchKeyword } from '@/utils/validSearchBox'
import { create } from 'zustand'

interface SearchStoreState {
  isInitialized: boolean
  setInitialized: (value: boolean) => void
  keywords: string[]
  setKeywords: (keywords: string[]) => void
  addKeyword: (keyword: string) => void
  removeKeyword: (keyword: string) => void
  inputValue: string
  setInputValue: (value: string) => void
  toastMessage: string
  setToastMessage: (message: string) => void
  hideToast: () => void
  clearKeywords: () => void
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  isInitialized: false,
  setInitialized: (value) => set({ isInitialized: value }),

  keywords: [],
  setKeywords: (keywords) => set({ keywords }),
  inputValue: '',
  toastMessage: '',

  setInputValue: (value) => set({ inputValue: value }),
  setToastMessage: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: '' }),
  clearKeywords: () => set({ keywords: [] }),

  addKeyword: (keyword) => {
    const trimmed = keyword.trim()
    const result = validateSearchKeyword(trimmed)
    console.log('유효성 검사1:', result.isValid)
    
    const keywords = get().keywords
    if (keywords.length >= SearchBarMessage.VALID_KEYWORD_CNT) {
      set({ inputValue: '', toastMessage: '' })
      setTimeout(() => set({ toastMessage: SearchBarMessage.TOO_MANY_KEYWORDS }), 0)
      return
    }
    
    console.log('유효성 검사2:', result.isValid)
    if (!result.isValid) {
      const message =
        result.reason === 'jamo'
          ? SearchBarMessage.INVALID_KEYWORD_JAMO
          : result.reason === 'special'
            ? SearchBarMessage.INVALID_KEYWORD_SPECIAL
            : result.reason === 'number'
              ? SearchBarMessage.INVALID_KEYWORD_NUMBER
              : SearchBarMessage.INVALID_KEYWORD

      set({ inputValue: '', toastMessage: '' })
      setTimeout(() => set({ toastMessage: message }), 0)
      return
    }

    if (keywords.includes(trimmed)) {
      set({ inputValue: '' })
      return
    }

    set({
      keywords: [...keywords, trimmed],
      inputValue: '',
      toastMessage: '',
    })
  },

  removeKeyword: (keyword) =>
    set((state) => ({
      keywords: state.keywords.filter((k) => k !== keyword),
    })),
}))
