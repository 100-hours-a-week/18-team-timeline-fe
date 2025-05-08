export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!FRONTEND_BASE_URL) {
  throw new Error('환경 변수 VITE_FRONTEND_BASE_URL이 설정되지 않았습니다.');
}

if (!API_BASE_URL) {
  throw new Error('환경 변수 VITE_API_BASE_URL이 설정되지 않았습니다.');
}

export const ROUTES = {
  MAIN: '/main',
  LOGIN: '/login',
  SIGNUP: '/signup',
  USER_INFO: '/user-info',
  SEARCH_RESULTS: '/search-results',
  NEWS_DETAIL: '/news/:id',
  getNewsDetailPath: (id: number) => `/news/${id}`,
};

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  KAKAO_LOGIN: '/auth/login/kakao',
  LOGOUT: '/users/logout',
  SIGNUP: '/users',
  CHECK_EMAIL: (email: string) => `/users/check-email?email=${encodeURIComponent(email)}`,
  CHECK_NAME: (name: string) => `/users/check-nickname?nickname=${name}`,
  SEND_CODE: '/auth/email-verification-codes',
  CHECK_CODE: '/auth/email-verification-codes/verify',
  USER_INFO: '/users/me',
  USER_PASSWORD: '/users/me/password',
  USER_WITHDRAW: '/users/me/state',
  NEWS: '/news',
  NEWS_HOTISSUE: '/news/hotissue',
  NEWS_DETAIL: '/news/:id',
  BOOKMARK: '/news/:id/bookmark',
  COMMENT: '/news/:id/comments',

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
};

export const INQUIRY_URL = 'https://ktb.goorm.io/'