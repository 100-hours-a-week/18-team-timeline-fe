import { SearchBarMessage } from '@/constants/SearchBarMessage'
import { validateSearchKeyword } from '@/utils/validSearchBox'
import { create } from 'zustand'

interface SearchStoreState {
  keywords: string[]
  inputValue: string
  toastMessage: string
  setInputValue: (value: string) => void
  setToastMessage: (message: string) => void
  hideToast: () => void
  clearKeywords: () => void
  addKeyword: (keyword: string) => void
  removeKeyword: (keyword: string) => void
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  keywords: [],
  inputValue: '',
  toastMessage: '',

  setInputValue: (value) => set({ inputValue: value }),
  setToastMessage: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: '' }),
  clearKeywords: () => set({ keywords: [] }),

  addKeyword: (keyword) => {
    const trimmed = keyword.trim()
    const result = validateSearchKeyword(trimmed)

    const keywords = get().keywords
    if (keywords.length >= SearchBarMessage.VALID_KEYWORD_CNT) {
      set({ inputValue: '', toastMessage: '' })
      setTimeout(() => set({ toastMessage: SearchBarMessage.TOO_MANY_KEYWORDS }), 0)
      return
    }

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
