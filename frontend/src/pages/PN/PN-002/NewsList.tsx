import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '@/constants/url';
import { formatRelativeTime } from '../utils/dateUtils';

interface News {
  id: string;
  title: string;
  summary: string;
  image: string;
  updatedAt: string;
  bookmarked: boolean;
}

interface SearchNewsData {
  newsList: News[];
  offset: number;
  hasNext: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: SearchNewsData;
}

interface SearchNewsListProps {
  tags: string[];      // 검색할 태그 배열 (1~6개)
}

export default function SearchNewsList({ tags }: SearchNewsListProps) {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // 무한 스크롤용 ref
  const observerRef = useRef<HTMLDivElement>(null);

  /* ----------------------------- 데이터 fetch ----------------------------- */
  const fetchNews = async (currentOffset = 0, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      if (!tags.length) {
        setError('검색 태그가 필요합니다.');
        return;
      }

      // 태그 개별 인코딩 후 join → 공백·특수문자 안전
      const tagParam = tags.map(encodeURIComponent).join(',');
      const url = `${ENDPOINTS.NEWS}/search?tags=${tagParam}&offset=${currentOffset}`;

      const { data } = await axios.get<ApiResponse>(API_BASE_URL + url);

      if (data.success) {
        const { newsList, offset: newOffset, hasNext: newHasNext } = data.data;

        setNews(prev => (isLoadMore ? [...prev, ...newsList] : newsList));
        setOffset(newOffset);
        setHasNext(newHasNext);
        setHasInitialLoad(true);
      } else {
        setError(data.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.status === 400
            ? '검색 조건이 올바르지 않습니다.'
            : err.response?.status === 429
            ? '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
            : '네트워크 오류가 발생했습니다.'
        );
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  /* ----------------------------- 무한 스크롤 ------------------------------ */
  const loadMore = useCallback(() => {
    if (hasNext && !isLoading && !isLoadingMore) {
      fetchNews(offset, true);
    }
  }, [hasNext, isLoading, isLoadingMore, offset]);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) io.observe(observerRef.current);
    return () => io.disconnect();
  }, [loadMore]);

  /* ------------------------------ 초기 로드 ------------------------------- */
  useEffect(() => {
    setNews([]);
    setOffset(0);
    setHasNext(true);
    setHasInitialLoad(false);
    fetchNews(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags.join(',')]);   // 배열 비교 대신 문자열 비교 → 의도치 않은 재렌더 방지

  /* --------------------------- 뉴스 카드 컴포넌트 -------------------------- */
  const NewsItem = ({ newsItem }: { newsItem: News }) => (
    <a
      href={`/news/${newsItem.id}`}
      className="group flex flex-row items-center w-full overflow-hidden bg-white rounded-lg mb-4"
    >
      <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3 mt-2 mb-2">
        {newsItem.image ? (
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-[120px] h-[100px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-[120px] h-[100px] bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500 text-xs">이미지 없음</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col items-end text-right">
        <div className="flex justify-between items-start w-full">
          <h3 className="w-full text-lg font-semibold leading-tight mb-2 line-clamp-2 text-right text-black">
            {newsItem.title}
          </h3>
          {newsItem.bookmarked && (
            <span className="text-yellow-500 ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-snug mb-2 w-full text-right line-clamp-2">
          {newsItem.summary}
        </p>
        <div className="w-full text-[10px] text-[#F2A359] text-right">
          {formatRelativeTime(newsItem.updatedAt)} 업데이트
        </div>
      </div>
    </a>
  );

  /* ----------------------------- JSX 반환 ------------------------------ */
  return (
    <>
      {/* 최대 70vh 높이에서 내부만 스크롤 */}
      <div
        className="
          space-y-2
          overflow-y-auto
          max-h-[70vh]
          pr-1
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        "
      >
        {/* 태그 배지 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 상태 메시지 */}
        {error && (
          <div className="bg-red-100 border text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {isLoading && !hasInitialLoad && (
          <div className="text-center py-8 text-gray-500">검색 중...</div>
        )}
        {news.length === 0 && !isLoading && !error && hasInitialLoad && (
          <div className="text-center py-8 text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 뉴스 카드 목록 */}
        {news.map(item => (
          <NewsItem key={item.id} newsItem={item} />
        ))}

        {/* 추가 로딩 & 무한 스크롤 트리거 */}
        {isLoadingMore && (
          <div className="text-center py-4 text-gray-500">
            더 많은 뉴스를 불러오는 중...
          </div>
        )}
        {hasNext && news.length > 0 && <div ref={observerRef} className="h-4" />}
        {!hasNext && news.length > 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            모든 검색 결과를 불러왔습니다.
          </div>
        )}
      </div>
    </>
  );
}
