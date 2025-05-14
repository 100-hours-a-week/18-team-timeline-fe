import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/url';
import { useAuthStore } from '@/stores/authStore';

// API 명세에 맞는 타입 정의
export interface TimelineSource {
  name: string;
  url: string;
}

export interface TimelineCard {
  id: string;
  title: string;
  content: string;
  sources: TimelineSource[];
  startDate: string;
  endDate: string;
}

// API에서 받은 원본 데이터를 우리 애플리케이션 형태로 변환
const transformTimelineData = (apiTimelineItem: any): TimelineCard => {
  return {
    id: apiTimelineItem.id || `timeline-${Math.random().toString(36).substr(2, 9)}`,
    title: apiTimelineItem.title,
    content: apiTimelineItem.content,
    sources: Array.isArray(apiTimelineItem.source) 
      ? apiTimelineItem.source.map((src: string, index: number) => ({
          name: `출처 ${index + 1}`,
          url: src
        }))
      : [],
    startDate: apiTimelineItem.startAt,
    endDate: apiTimelineItem.endAt
  };
};

// 뉴스 세부 정보 인터페이스 - 이미지 필드 추가
interface NewsDetail {
  title: string;
  image: string; // 이미지 URL 필드 추가
  updatedAt: string;
  bookmarked: boolean;
  timeline: any[]; // API 원본 타입
  statistics: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    news: NewsDetail;
  };
}

// 컴포넌트에 전달할 속성
interface UseTimelineDataProps {
  newsId: string | undefined;
}

// 훅에서 반환할 값들 - 이미지 필드 추가
interface UseTimelineDataReturn {
  newsData: NewsDetail | null;
  loading: boolean;
  error: string | null;
  bookmarked: boolean;
  showSources: Record<string, boolean>;
  toggleSources: (cardId: string) => void;
  isUpdating: boolean;
  isUpdateAvailable: boolean;
  handleToggleBookmark: () => Promise<void>;
  handleShare: () => Promise<void>;
  handleTimelineUpdate: () => Promise<void>;
  formattedTimeline: TimelineCard[]; // 변환된 타임라인 추가
}

/**
 * 타임라인 데이터를 관리하는 커스텀 훅
 */
export const useTimelineData = ({ newsId }: UseTimelineDataProps): UseTimelineDataReturn => {
  const [newsData, setNewsData] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [showSources, setShowSources] = useState<Record<string, boolean>>({});
  const [formattedTimeline, setFormattedTimeline] = useState<TimelineCard[]>([]);
  
  // 인증 상태 가져오기
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 소스 토글 핸들러
  const toggleSources = (cardId: string) => {
    setShowSources(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // 마지막 업데이트로부터 24시간이 지났는지 확인하는 함수
  const checkUpdateAvailable = useCallback((updatedAtString: string) => {
    const updatedAt = new Date(updatedAtString);
    const now = new Date();
    
    // 마지막 업데이트 시간과 현재 시간의 차이를 밀리초로 계산
    const timeDiff = now.getTime() - updatedAt.getTime();
    
    // // 24시간(86400000 밀리초)이 지났는지 확인
    // const hoursPassed = timeDiff / (1000 * 60 * 60);
    // console.log(`마지막 업데이트로부터 ${hoursPassed.toFixed(2)}시간이 지났습니다.`);
    
    // return hoursPassed >= 24;

    // 테스트용 2분 뒤 업데이트
    console.log(`업데이트로부터 ${(timeDiff / 1000).toFixed(0)}초가 지났습니다.`);
  
    return timeDiff >= 2 * 60 * 1000; // 2분 (120000 ms)
  }, []);

  // 데이터를 가져오는 함수
  const fetchNewsData = useCallback(async () => {
    // 중요: newsId가 undefined인 경우 처리
    if (!newsId) {
      console.log('NewsID is undefined or empty');
      setLoading(false);
      setError('뉴스 ID가 제공되지 않았습니다.');
      return;
    }

    // 타입 변환: 백엔드에서 숫자로 처리하는 경우를 위해 
    // URL에서 숫자만 추출하여 사용
    const numericId = newsId.replace(/\D/g, '');
    
    if (!numericId) {
      setLoading(false);
      setError('유효하지 않은 뉴스 ID입니다.');
      return;
    }

    console.log(`API 호출에 사용할 ID: ${numericId}, API BASE URL: ${API_BASE_URL}`);

    try {
      setLoading(true);
      setError(null);

      // 실제 API 호출
      try {
        // axios 설정을 명시적으로 지정하여 CORS 및 기타 문제 해결
        const axiosConfig = {
          headers: {
            'Content-Type': 'application/json',
            // 필요한 경우 여기에 인증 헤더를 추가
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
          // 타임아웃 설정
          timeout: 10000, // 10초
          // CORS 설정
          withCredentials: false, // 필요한 경우 true로 설정
        };
        
        // 다양한 API 엔드포인트 형식 시도 (백엔드 설정에 따라 다를 수 있음)
        let response;
        try {
          // 첫 번째 시도: 기본 URL 형식
          response = await axios.get<ApiResponse>(
            `${API_BASE_URL}/news/${numericId}`,
            axiosConfig
          );
          console.log('API 호출 성공');
        } catch (err1) {
          console.log('첫 번째 API 호출 실패, 대체 URL 시도:', err1);
          try {
            // 두 번째 시도: API 버전이 포함된 URL 형식
            response = await axios.get<ApiResponse>(
              `${API_BASE_URL}/api/v1/news/${numericId}`,
              axiosConfig
            );
          } catch (err2) {
            console.log('두 번째 API 호출 실패, 마지막 URL 시도:', err2);
            // 마지막 시도: 경로를 더 단순하게
            response = await axios.get<ApiResponse>(
              `${API_BASE_URL}/news/${numericId}`,
              axiosConfig
            );
          }
        }
        
        console.log('API 응답:', response.data);
        
        if (response.data.success) {
          // API 응답에서 뉴스 데이터 추출
          const { news } = response.data.data;
          
          // 상태 업데이트
          setNewsData(news);
          setBookmarked(news.bookmarked);
          
          // 타임라인 데이터 변환
          const transformedTimeline = news.timeline.map(transformTimelineData);
          setFormattedTimeline(transformedTimeline);
          
          // 소스 표시 상태 초기화
          const sourcesState: Record<string, boolean> = {};
          transformedTimeline.forEach(item => {
            sourcesState[item.id] = false;
          });
          setShowSources(sourcesState);
          
          // 업데이트 가능 여부 확인
          setIsUpdateAvailable(checkUpdateAvailable(news.updatedAt));
        } else {
          setError(response.data.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } catch (apiErr) {
        console.error('API 호출 오류:', apiErr);
        
        // API 오류의 상세 정보 확인
        if (axios.isAxiosError(apiErr)) {
          console.log('API 호출 상태 코드:', apiErr.response?.status);
          console.log('API 호출 오류 메시지:', apiErr.response?.data);
          console.log('API 호출 요청 설정:', apiErr.config);
        }
        
        // API 호출 실패 시 임시 데이터로 대체 (개발 환경용)
        console.log('임시 데이터를 사용합니다.');
        
        // 임시 데이터 (개발 환경용)
        const mockTimeline: TimelineCard[] = [
          {
            id: 'timeline-1',
            title: '첫번째 이벤트',
            content: '타임라인 첫번째 내용입니다. 이벤트가 발생했습니다.',
            sources: [
              {
                name: '언론사 1',
                url: 'https://example.com/news1'
              },
              {
                name: '언론사 2',
                url: 'https://example.com/news2'
              }
            ],
            startDate: '2023-01-01',
            endDate: '2023-01-02'
          },
          {
            id: 'timeline-2',
            title: '두번째 이벤트',
            content: '타임라인 두번째 내용입니다. 후속 이벤트가 발생했습니다.',
            sources: [
              {
                name: '언론사 3',
                url: 'https://example.com/news3'
              }
            ],
            startDate: '2023-01-03',
            endDate: '2023-01-04'
          },
          {
            id: 'timeline-3',
            title: '세번째 이벤트',
            content: '타임라인 세번째 내용입니다. 최종 결과가 나왔습니다.',
            sources: [
              {
                name: '언론사 4',
                url: 'https://example.com/news4'
              },
              {
                name: '언론사 5',
                url: 'https://example.com/news5'
              }
            ],
            startDate: '2023-01-05',
            endDate: '2023-01-06'
          }
        ];
        
        // 개발용 데이터의 경우, 업데이트 날짜를 25시간 전으로 설정하여 업데이트 버튼 테스트 가능하게 함
        const testDate = new Date();
        testDate.setHours(testDate.getHours() - 25); // 25시간 전 날짜로 설정
        const mockUpdatedAt = testDate.toISOString();
        
        const mockData: NewsDetail = {
          title: `뉴스 #${numericId} - 중요 사건 타임라인`,
          image: `https://picsum.photos/seed/243572345/400/200`, // 임시 이미지 URL
          updatedAt: mockUpdatedAt, // 25시간 전으로 설정
          bookmarked: false,
          timeline: mockTimeline, // 원래 API 형태로는 아니지만 개발용으로 충분함
          statistics: {
            positive: 40,
            neutral: 30,
            negative: 30
          }
        };
        
        setNewsData(mockData);
        setBookmarked(mockData.bookmarked);
        setFormattedTimeline(mockTimeline);
        
        // 소스 표시 상태 초기화
        const sourcesState: Record<string, boolean> = {};
        mockTimeline.forEach(item => {
          sourcesState[item.id] = false;
        });
        setShowSources(sourcesState);
        
        // 업데이트 가능 여부 확인
        setIsUpdateAvailable(checkUpdateAvailable(mockData.updatedAt));
      }
    } catch (err) {
      console.error('뉴스 데이터 가져오기 오류:', err);
      
      if (axios.isAxiosError(err)) {
        // API 에러 처리
        if (err.response) {
          // 서버가 응답을 반환한 경우
          switch (err.response.status) {
            case 400:
              setError('잘못된 요청입니다. 요청 형식을 확인해주세요.');
              break;
            case 404:
              setError('요청한 뉴스를 찾을 수 없습니다.');
              break;
            case 405:
              setError('허용되지 않은 요청 방식입니다.');
              break;
            case 429:
              setError('요청 속도가 너무 빠릅니다. 잠시 후 다시 시도해주세요.');
              break;
            default:
              setError(`서버 오류가 발생했습니다. (${err.response.status}) 잠시 후 다시 시도해주세요.`);
          }
        } else if (err.request) {
          // 요청은 보냈으나 응답을 받지 못한 경우
          setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          // 요청 설정 중 오류가 발생한 경우
          setError('요청을 처리하는 중 오류가 발생했습니다.');
        }
      } else {
        // 기타 오류
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [newsId, checkUpdateAvailable]);

  // 최초 데이터 로드
  useEffect(() => {
    // 인증 상태 확인
    checkAuth();
    fetchNewsData();
  }, [fetchNewsData, checkAuth]);

  // 북마크 토글 핸들러
  const handleToggleBookmark = async () => {
    if (!newsId || !newsData) return Promise.reject(new Error('뉴스 데이터가 없습니다.'));
    
    // 숫자 ID 추출
    const numericId = newsId.replace(/\D/g, '');
    
    try {
      setIsUpdating(true);
      
      // 실제 API 호출 (백엔드 구현 후 활성화)
      try {
        // const response = await axios.post(`${API_BASE_URL}/news/${numericId}/bookmark`, {
        //   bookmarked: !bookmarked
        // });
        
        // API 성공 여부 확인 (실제 구현 시 주석 해제)
        // if (response.data.success) {
        //   setBookmarked(!bookmarked);
        // } else {
        //   return Promise.reject(new Error('북마크 업데이트에 실패했습니다.'));
        // }
        
        // 개발 환경 임시 코드 (API 구현 전)
        console.log('북마크 상태 토글:', !bookmarked);
        setBookmarked(!bookmarked);
        
        // 성공 시 결과 반환
        return Promise.resolve();
      } catch (err) {
        console.error('북마크 API 호출 오류:', err);
        
        // 개발 환경에서는 성공으로 처리 (API 구현 전)
        setBookmarked(!bookmarked);
        return Promise.resolve();
      }
    } catch (err) {
      console.error('북마크 토글 오류:', err);
      return Promise.reject(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // 공유하기 핸들러
  const handleShare = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        return Promise.resolve();
      } catch (err) {
        console.error('URL 복사 실패:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(new Error('Clipboard API not available'));
  };

  // 타임라인 업데이트 핸들러
  const handleTimelineUpdate = async () => {
    if (!newsId || !newsData) return Promise.reject(new Error('뉴스 데이터가 없습니다.'));

    checkAuth();

    if (!isLoggedIn) {
      return Promise.reject(new Error('인증되지 않은 사용자입니다. 로그인이 필요합니다.'));
    }

    if (!isUpdateAvailable) {
      console.log('업데이트할 수 없습니다: 마지막 업데이트로부터 24시간이 지나지 않았습니다.');
      return Promise.reject(new Error('마지막 업데이트 이후 24시간이 지나지 않았습니다.'));
    }

    const numericId = newsId.replace(/\D/g, '');

    try {
      setIsUpdating(true);

      const token = localStorage.getItem('token');

      if (!token) {
        return Promise.reject(new Error('인증 토큰이 없습니다. 다시 로그인해주세요.'));
      }

      try {
        const safeApiUrl = API_BASE_URL.replace('localhost', '127.0.0.1');
        console.log(`API 호출 URL: ${safeApiUrl}/news/${numericId}`);

        const response = await axios.patch(
          `${safeApiUrl}/news/${numericId}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            timeout: 10000,
            withCredentials: false,
          }
        );

        if (response.data.success) {
          console.log('타임라인 업데이트 성공:', response.data);

          const updatedNewsData = response.data.data.news;
          setNewsData(updatedNewsData);

          const transformedTimeline = updatedNewsData.timeline.map(transformTimelineData);
          setFormattedTimeline(transformedTimeline);

          const sourcesState: Record<string, boolean> = {};
          transformedTimeline.forEach((item: any) => {
            sourcesState[item.id] = false;
          });
          setShowSources(sourcesState);

          setIsUpdateAvailable(false);

          return Promise.resolve(response.data.message);
        } else {
          console.error('타임라인 업데이트 실패:', response.data.message);
          return Promise.reject(new Error(response.data.message));
        }
      } catch (err) {
        console.error('타임라인 업데이트 API 호출 오류:', err);

        if (axios.isAxiosError(err)) {
          if (err.response) {
            const statusCode = err.response.status;
            const errorMessage = err.response.data?.message || '알 수 없는 오류가 발생했습니다.';

            switch (statusCode) {
              case 400:
                return Promise.reject(new Error('요청 형식이 올바르지 않습니다.'));
              case 401:
                useAuthStore.getState().logout();
                return Promise.reject(new Error('인증되지 않은 사용자입니다. 다시 로그인해주세요.'));
              case 404:
                return Promise.reject(new Error('요청하신 타임라인을 찾을 수 없습니다.'));
              case 405:
                return Promise.reject(new Error('요청 방식이 잘못되었습니다.'));
              case 409:
                setIsUpdateAvailable(false);
                return Promise.reject(new Error('마지막 업데이트 이후 24시간이 지나지 않았습니다.'));
              case 429:
                return Promise.reject(new Error('요청 속도가 너무 빠릅니다. 잠시 후 다시 시도해주세요.'));
              default:
                return Promise.reject(new Error(errorMessage));
            }
          } else if (err.request) {
            console.error('네트워크 오류:', err.message);
            return Promise.reject(new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'));
          } else {
            console.error('요청 설정 오류:', err.message);
            return Promise.reject(new Error('요청 준비 중 오류가 발생했습니다.'));
          }
        }

        return Promise.reject(new Error('타임라인 업데이트 중 오류가 발생했습니다.'));
      }
    } catch (err) {
      console.error('타임라인 업데이트 오류:', err);
      return Promise.reject(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    newsData,
    loading,
    error,
    bookmarked,
    showSources,
    toggleSources,
    isUpdating,
    isUpdateAvailable,
    handleToggleBookmark,
    handleShare,
    handleTimelineUpdate,
    formattedTimeline
  };
};