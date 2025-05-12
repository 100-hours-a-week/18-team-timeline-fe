import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '@/constants/url';

// API 응답에 맞는 인터페이스 정의
interface News {
  id: number;
  title: string;
  summary: string;
  image: string | null;
  category: string;
  updatedAt: string;
  bookmarked: boolean;
  bookmarkedAt: string | null;
}

interface CategoryNewsData {
  newsList: News[];
  nextCursor?: {
    updatedAt: string;
    id: number;
  } | null;
  offset?: number; // 1차 MVP에서 사용
  hasNext: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    [key: string]: CategoryNewsData;
  };
}

interface NewsListProps {
  category: string;
}

export default function NewsList({ category }: NewsListProps) {
  const [news, setNews] = useState<News[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackPage, setFallbackPage] = useState(1);
  const loaderRef = useRef(null);
  
  // 커서 또는 오프셋을 관리하는 상태
  const [nextCursor, setNextCursor] = useState<{ updatedAt: string; id: number } | null>(null);
  const [offset, setOffset] = useState<number>(0);
  
  // 사용할 API 엔드포인트가 최종 버전인지 MVP 버전인지 확인 (flag로 설정)
  const isFinalVersion = false; // 여기서 API 버전에 따라 true/false로 설정
  
  // 카테고리 정규화 (API 요청 시 대문자로 변환)
  const normalizedCategory = category.toUpperCase();
  const isCategoryAll = normalizedCategory === 'ALL' || normalizedCategory === '';

  // 폴백 데이터 생성 함수
  const generateFallbackNews = useCallback(
    (page: number, pageSize: number = 20): News[] => {
      // 현재 페이지에 대한 뉴스 아이템 생성
      const baseNews: News[] = Array.from({ length: pageSize }, (_, i) => {
        const itemIndex = (page - 1) * pageSize + i;
        return {
          id: itemIndex + 1,
          title: `${normalizedCategory === 'ALL' ? '' : normalizedCategory + ' '}뉴스 #${itemIndex + 1}`,
          summary: `이 뉴스는 ${normalizedCategory === 'ALL' ? '여러 주제의' : normalizedCategory} 관련 내용을 다루고 있습니다. 이 내용은 36자 제한에 맞춰 표시됩니다.`,
          image: `https://picsum.photos/seed/${itemIndex + 1}/400/200`,
          category: normalizedCategory === 'ALL' 
            ? ['ECONOMY', 'SPORTS', 'ENTERTAINMENT', 'KTB'][i % 4] 
            : normalizedCategory,
          updatedAt: new Date(Date.now() - itemIndex * 24 * 60 * 60 * 1000).toISOString(),
          bookmarked: i % 5 === 0, // 20% 확률로 북마크
          bookmarkedAt: i % 5 === 0 
            ? new Date(Date.now() - itemIndex * 12 * 60 * 60 * 1000).toISOString()
            : null
        };
      });

      // KTB 카테고리 처리
      if (normalizedCategory === 'KTB' || normalizedCategory === 'ALL') {
        const ktbNews: News = {
          id: 9999,
          title: '투표 페이지로 이동',
          summary: '투표 페이지로 이동합니다.',
          image: null,
          category: 'KTB',
          updatedAt: new Date().toISOString(),
          bookmarked: false,
          bookmarkedAt: null
        };
        
        if (page === 1) {
          if (normalizedCategory === 'KTB') {
            return [ktbNews, ...baseNews];
          } else {
            const allNews = [...baseNews];
            allNews.splice(2, 0, ktbNews); // 3번째 위치에 투표 페이지 삽입
            return allNews;
          }
        }
      }

      return baseNews;
    },
    [normalizedCategory]
  );

  // 뉴스 불러오는 함수
  const fetchNews = useCallback(async (isInitial: boolean = false) => {
    if ((!hasMore && !isInitial) || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // 폴백 데이터 사용 중인 경우
      if (useFallback) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 느낌 재현
        const fallbackData = generateFallbackNews(fallbackPage);
        
        if (isInitial) {
          setNews(fallbackData);
        } else {
          setNews(prev => [...prev, ...fallbackData]);
        }
        
        setFallbackPage(prev => prev + 1);
        setHasMore(fallbackPage < 5); // 최대 5페이지까지만 제공
        setIsLoading(false);
        return;
      }
      
      // 실제 API 요청 로직
      let url = ENDPOINTS.NEWS;
      const queryParams: string[] = [];
      
      // 초기 로드가 아니고 특정 카테고리를 요청하는 경우
      if (!isInitial && !isCategoryAll) {
        queryParams.push(`category=${normalizedCategory}`);
      }
      
      // 커서 또는 오프셋 기반 페이징 구현
      if (!isInitial) {
        if (isFinalVersion && nextCursor) {
          // 최종 버전 API - 커서 기반 페이징
          queryParams.push(`cursor-time=${nextCursor.updatedAt}`);
          queryParams.push(`cursor-id=${nextCursor.id}`);
        } else if (!isFinalVersion) {
          // 1차 MVP - 오프셋 기반 페이징
          queryParams.push(`offset=${offset}`);
        }
      }
      
      // 쿼리 파라미터 추가
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      // API 요청
      const response = await axios.get<ApiResponse>(API_BASE_URL + url);
      
      if (response.data.success) {
        // 데이터가 성공적으로 로드됨
        const data = response.data.data;
        const categoryData = isCategoryAll ? data.ALL : data[normalizedCategory];
        
        if (categoryData) {
          const newNewsList = categoryData.newsList;
          
          // 초기 로드인 경우 뉴스 목록 초기화
          if (isInitial) {
            setNews(newNewsList);
          } else {
            // 추가 로드인 경우 기존 목록에 추가
            setNews(prev => [...prev, ...newNewsList]);
          }
          
          // 다음 페이지 로드를 위한 커서 또는 오프셋 업데이트
          if (isFinalVersion) {
            setNextCursor(categoryData.nextCursor || null);
          } else {
            setOffset(categoryData.offset || 0);
          }
          
          // 더 불러올 데이터가 있는지 확인
          setHasMore(categoryData.hasNext);
        } else {
          // 요청한 카테고리에 대한 데이터가 없음
          setHasMore(false);
          if (isInitial) {
            setNews([]);
          }
        }
      } else {
        // API는 성공했지만 내부적으로 오류가 있는 경우
        console.warn('API 응답 실패, 폴백 데이터 사용:', response.data.message);
        setUseFallback(true);
        fetchNews(isInitial); // 폴백 모드로 재시도
      }
    } catch (err) {
      console.error('Error loading news:', err);
      console.log('API 요청 실패, 폴백 데이터 사용');
      setUseFallback(true);
      fetchNews(isInitial); // 폴백 모드로 재시도
    } finally {
      if (!useFallback) {
        setIsLoading(false);
      }
    }
  }, [
    normalizedCategory, 
    isCategoryAll, 
    nextCursor, 
    offset, 
    hasMore, 
    isLoading, 
    isFinalVersion, 
    useFallback, 
    fallbackPage, 
    generateFallbackNews
  ]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchNews();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNews, hasMore, isLoading]);

  // 카테고리가 변경될 때 뉴스 목록 초기화
  useEffect(() => {
    setNews([]);
    setNextCursor(null);
    setOffset(0);
    setHasMore(true);
    setFallbackPage(1);
    // 카테고리가 변경될 때마다 API 호출을 시도하고, 실패시 폴백 데이터 사용
    setUseFallback(false);
    fetchNews(true);
  }, [category, fetchNews]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 뉴스 아이템 컴포넌트
  const NewsItem = ({ newsItem }: { newsItem: News }) => {
    if (newsItem.category === 'KTB') {
      return (
        <a
          href="/vote"
          className="group flex flex-col md:flex-row md:items-center bg-white rounded-lg overflow-hidden shadow-md mb-4"
        >
          <div className="w-full bg-[#002A22] text-white flex items-center justify-center p-4">
            <h3 className="text-xl font-bold">투표 페이지로 이동</h3>
          </div>
        </a>
      );
    }

    return (
      <a
        href={`/news/${newsItem.id}`}
        className="group flex flex-row items-center w-full overflow-hidden bg-white rounded-lg mb-4"
      >
        <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3 mt-2 mb-2">
          {newsItem.image ? (
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-[120px] h-[100px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
            />
          ) : (
            <div className="w-[120px] h-[100px] bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 text-xs">이미지 없음</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col items-end text-right">
          <div className="flex justify-between w-full">
            <h3 className="text-lg font-semibold text-[20px] line-clamp-2 mb-1 text-right w-full">
              {newsItem.title}
            </h3>
            {newsItem.bookmarked && (
              <span className="text-yellow-500 ml-2">
                {/* 북마크 아이콘 */}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-[14px] line-clamp-2 mb-1 text-right w-full">
            {newsItem.summary}
          </p>
          <div className="text-[10px] text-[#F2A359] text-right w-full">
            {formatDate(newsItem.updatedAt)}
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="space-y-2">
      
      {error && !useFallback && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {news.length === 0 && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">
          표시할 뉴스가 없습니다.
        </div>
      )}
      
      {news.map((newsItem) => (
        <NewsItem key={newsItem.id} newsItem={newsItem} />
      ))}
      
      {/* 로딩 인디케이터 및 observer의 타겟 */}
      <div ref={loaderRef} className="py-4">
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}