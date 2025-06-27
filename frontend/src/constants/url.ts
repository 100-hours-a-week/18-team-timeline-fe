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
  BOOKMARK: '/bookmarks',
  FIND_PASSWORD: '/find-password',
  RESET_PASSWORD: '/reset-password',
  getResetPasswordPath: (token: string) => `/reset-password?token=${token}`,
  SEARCH_RESULTS: '/search-results',
  NEWS_DETAIL: '/news/:id',
  getNewsDetailPath: (id: string) => `/news/${id}`,
  POLL: `/polls`,
}

export const ENDPOINTS = {
  CHECK_AUTH: '/auth/check',
  REFRESH_TOKEN: '/auth/token/refresh',

  LOGIN: '/auth/login',
  LOGOUT: '/users/logout',
  KAKAO_LOGIN: '/auth/kakao/login-url',
  KAKAO_LOGIN_CALLBACK: (code: string) => `/auth/kakao/callback?code=${code}`,
  USER_INFO: '/users/me',
  USER_WITHDRAW: '/users/me/state',
  CHECK_EMAIL: (email: string) => `/users/check-email?email=${encodeURIComponent(email)}`,
  CHECK_NAME: (name: string) => `/users/check-nickname?nickname=${name}`,

  SIGNUP: '/users',
  SEND_CODE: '/auth/email-verification-codes',
  CHECK_CODE: '/auth/email-verification-codes/verify',
  FIND_PASSWORD: '/auth/password-reset-tokens',
  CHECK_TOKEN_VALID: (token: string) => `/auth/password-reset-tokens/${token}`,
  RESET_PASSWORD_LOGOUT: (token: string) => `/auth/password-reset-tokens/${token}/reset`,
  RESET_PASSWORD_LOGIN: '/users/me/password',

  NEWS: `/news`,
  NEWS_FETCH: (category?: string, offset?: string) =>
    `/news?offset=${offset ?? '0'}${category ? `&category=${category}` : ''}`,
  NEWS_HOTISSUE: '/news/hotissue',
  NEWS_DETAIL: (id: string) => `/news/${id}`,
  NEWS_SEARCH: (tags: string[], offset?: string) => {
    const params = new URLSearchParams()
    tags.forEach((tag) => params.append('tags', tag))
    if (offset !== undefined) {
      params.append('offset', String(offset))
    }
    return `/news/search?${params.toString()}`
  },
  BOOKMARK: (id: string) => `/news/${id}/bookmark`,
  BOOKMARK_FETCH: (offset?: string) => `/users/me/bookmarks?offset=${offset ?? '0'}`,
  COMMENT_FETCH: (newsId: string, offset: number) => `/news/${newsId}/comments?offset=${offset}`,
  COMMENT_CREATE: (newsId: string) => `/news/${newsId}/comments`,
  COMMENT_DELETE: (newsId: string, commentId: string) => `/news/${newsId}/comments/${commentId}`,
  POLL_FETCH: `/polls`,
  POLL_SUBMIT: `/polls/vote`,

  ALARM: '/users/me/alarms',
  ALARM_CHECK: (alarmId: number) => `/users/me/alarms/${alarmId}`,
}

export const INQUIRY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeNJ17hGr-tUwyohQzNWToqAhJTXROMd60R_5eulhyax2aWcA/viewform'
