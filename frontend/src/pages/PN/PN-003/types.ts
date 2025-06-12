// 타임라인 및 뉴스 관련 타입 정의

export interface Source {
  url: string;
  name: string;
}

export interface TimelineCard {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  content: string;
  sources: Source[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isMyComment: boolean;
}

export interface NewsResponse {
  id: string;
  title: string;
  image?: string;
  updatedAt: string;
  bookmarked: boolean;
  timeline: TimelineCard[];
  statistics: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface NewsSearchItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  updatedAt: string;
  bookmarked: boolean;
}

export interface NewsSearchResponse {
  success: boolean;
  message: string;
  data: {
    newsList: NewsSearchItem[];
    offset: number;
    hasNext: boolean;
  };
}

// 사용자 정보 타입
export interface UserInfo {
  id: string;
  nickname: string;
  email: string;
}

// 토스트 메시지 위치 타입
export type ToastPosition = 'bottom' | 'commentInput';

// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}