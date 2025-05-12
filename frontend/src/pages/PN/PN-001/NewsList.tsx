import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '@/constants/url';

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
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: { [key: string]: CategoryNewsData };
}

interface NewsListProps {
  category: string;
}

export default function NewsList({ category }: NewsListProps) {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedCategory = category.toUpperCase();
  const isCategoryAll = normalizedCategory === 'ALL' || normalizedCategory === '';

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let url = ENDPOINTS.NEWS;
      const queryParams: string[] = [];

      // **항상 ALL 포함이므로 굳이 쿼리 안 넣고, 받아서 JS에서 필터 가능**
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await axios.get<ApiResponse>(API_BASE_URL + url);

      if (response.data.success) {
        const data = response.data.data;

        // **존재 유무 확인 후 처리**
        const targetData = isCategoryAll
          ? data.ALL
          : data[normalizedCategory] ?? { newsList: [] };

        setNews(targetData.newsList);
      } else {
        setError(response.data.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('API 요청 오류:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const NewsItem = ({ newsItem }: { newsItem: News }) => (
    <a href={`/news/${newsItem.id}`} className="group flex flex-row items-center w-full overflow-hidden bg-white rounded-lg mb-4">
      <div className="flex-shrink-0 w-[120px] h-[100px] flex items-center justify-center pl-3 mt-2 mb-2">
        {newsItem.image ? (
          <img src={newsItem.image} alt={newsItem.title} className="w-[120px] h-[100px] object-cover rounded-lg" />
        ) : (
          <div className="w-[120px] h-[100px] bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500 text-xs">이미지 없음</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col items-end text-right">
        <div className="flex justify-between items-start w-full">
          <h3 className="text-lg font-semibold text-[20px] mb-1">{newsItem.title}</h3>
          {newsItem.bookmarked && (
            <span className="text-yellow-500 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
          )}
        </div>
        <p className="text-gray-600 text-[14px] mb-1 w-full text-right">{newsItem.summary}</p>
        <div className="text-[10px] text-[#F2A359]">{formatDate(newsItem.updatedAt)}</div>
      </div>
    </a>
  );

  return (
    <div className="space-y-2">
      {error && <div className="bg-red-100 border text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {isLoading && <div className="text-center py-8 text-gray-500">불러오는 중...</div>}
      {news.length === 0 && !isLoading && !error && (
        <div className="text-center py-8 text-gray-500">표시할 뉴스가 없습니다.</div>
      )}
      {news.map(newsItem => <NewsItem key={newsItem.id} newsItem={newsItem} />)}
    </div>
  );
}
