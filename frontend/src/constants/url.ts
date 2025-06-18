export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!FRONTEND_BASE_URL) {
  throw new Error('환경 변수 VITE_FRONTEND_BASE_URL이 설정되지 않았습니다.')
}

if (!API_BASE_URL) {
  throw new Error('환경 변수 VITE_API_BASE_URL이 설정되지 않았습니다.')
}

export const ROUTES = {
  MAIN: '/main',
  LOGIN: '/login',
  KAKAO_CALLBACK: '/auth/kakao/callback',
  SIGNUP: '/signup',
  USER_INFO: '/user-info',
  FIND_PASSWORD: '/find-password',
  RESET_PASSWORD: '/reset-password',
  getResetPasswordPath: (token: string) => `/reset-password?token=${token}`,
  SEARCH_RESULTS: '/search-results',
  NEWS_DETAIL: '/news/:id',
  getNewsDetailPath: (id: number) => `/news/${id}`,
  POLL:`/polls`,
}

export const ENDPOINTS = {
  ALARM: '/users/me/alarms',
  ALARM_CHECK: (alarmId: number) => `/users/me/alarms/${alarmId}`,
  LOGIN: '/auth/login',
  KAKAO_LOGIN: '/auth/kakao/login-url',
  KAKAO_LOGIN_CALLBACK: (code: string) => `/auth/kakao/callback?code=${code}`,
  LOGOUT: '/users/logout',
  SIGNUP: '/users',
  CHECK_EMAIL: (email: string) => `/users/check-email?email=${encodeURIComponent(email)}`,
  CHECK_NAME: (name: string) => `/users/check-nickname?nickname=${name}`,
  SEND_CODE: '/auth/email-verification-codes',
  CHECK_CODE: '/auth/email-verification-codes/verify',
  USER_INFO: '/users/me',
  USER_WITHDRAW: '/users/me/state',
  FIND_PASSWORD: '/auth/password-reset-tokens',
  CHECK_TOKEN_VALID: (token: string) => `/auth/password-reset-tokens/${token}`,
  RESET_PASSWORD_LOGOUT: (token: string) => `/auth/password-reset-tokens/${token}/reset`,
  RESET_PASSWORD_LOGIN: '/users/me/password',
  NEWS: '/news',
  NEWS_HOTISSUE: '/news/hotissue',
  NEWS_DETAIL: '/news/:id',
  BOOKMARK: '/news/:id/bookmark',
  COMMENT: '/news/:id/comments',
  POLL_FETCH: `/polls`,
  POLL_SUBMIT: `/polls/vote`,

  // 뉴스
  getNewsOffsetURL: (category?: string, offset: number = 0) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('offset', offset.toString())
    return `/news?${params.toString()}`
  },

  getNewsDetailPath: (id: number) => `/news/${id}`,

  // 북마크
  getBookmarkURL: (id: number) => `/news/${id}/bookmark`,

  // 댓글
  getCommentOffsetURL: (newsId: number, offset: number = 0) => {
    const params = new URLSearchParams()
    params.append('offset', offset.toString())
    return `/news/${newsId}/comments?${params.toString()}`
  },

  getCommentURL: (id: number) => `/news/${id}/comments`,
}

export const INQUIRY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeNJ17hGr-tUwyohQzNWToqAhJTXROMd60R_5eulhyax2aWcA/viewform'
