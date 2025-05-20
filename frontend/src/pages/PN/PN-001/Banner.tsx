import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '@/constants/url';
import axios from 'axios';

// ① Swiper React 컴포넌트와 필요한 모듈을 불러옵니다
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';

// ② CSS 임포트
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface NewsCard {
  id: number;
  title: string;
  summary: string;
  image: string;
  category: string;
  updatedAt: string;
  bookmarked: boolean;
  bookmarkedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    newsList: NewsCard[];
  };
}

// 폴백 데이터 (API 요청이 실패할 경우 사용)
const fallbackNewsCards: NewsCard[] = [
  { 
    id: 1, 
    title: '핫이슈 입니다 1', 
    summary: '핫이슈에 대한 간략한 설명입니다', 
    image: 'https://picsum.photos/seed/1/400/200', 
    category: 'economy',
    updatedAt: '2025-04-17T12:00:00',
    bookmarked: false,
    bookmarkedAt: '2025-04-17T12:00:00'
  },
  { 
    id: 2, 
    title: '핫이슈 입니다 2', 
    summary: '두 번째 핫이슈에 대한 간략한 설명입니다', 
    image: 'https://picsum.photos/seed/2/400/200', 
    category: 'sports',
    updatedAt: '2025-04-16T15:30:00',
    bookmarked: true,
    bookmarkedAt: '2025-04-17T10:30:00'
  },
  { 
    id: 3, 
    title: '핫이슈 일지도 아닐지도 모릅니다', 
    summary: '세 번째 핫이슈에 대한 간략한 설명입니다', 
    image: 'https://picsum.photos/seed/3/400/200', 
    category: 'entertainment',
    updatedAt: '2025-04-15T09:45:00',
    bookmarked: false,
    bookmarkedAt: '2025-04-17T12:00:00'
  }
];


export const Banner: React.FC = () => {
  const [newsCards, setNewsCards] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // API 요청
        const response = await axios.get<ApiResponse>(API_BASE_URL + ENDPOINTS.NEWS_HOTISSUE);
        
        // 성공적으로 데이터를 받아온 경우
        if (response.data.success) {
          setNewsCards(response.data.data.newsList);
        } else {
          // API가 성공 응답이지만 내부적으로 실패한 경우
          console.warn('API 응답 실패:', response.data.message);
          console.log(response.data)
          setNewsCards(fallbackNewsCards); // 폴백 데이터 사용
        }
      } catch (err) {
        // 네트워크 오류 등 예외 발생 시
        console.error('배너 뉴스 데이터 가져오기 오류:', err);
        console.log('폴백 데이터를 사용합니다.');
        setNewsCards(fallbackNewsCards); // 폴백 데이터 사용
      } finally {
        setLoading(false);
      }
    };

    fetchBannerNews();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 빈 데이터 처리 (폴백 데이터가 있으므로 일반적으로 발생하지 않음)
  if (newsCards.length === 0) {
    return (
      <div className="w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600 text-center px-4">
          표시할 뉴스가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <Swiper
      // 사용할 모듈을 배열로 전달
      modules={[Autoplay, Navigation, EffectFade]}

      // 옵션들
      loop={true}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      effect="slide"
      navigation

      className="w-full h-[200px] swiper-custom rounded-lg"
      style={{
        '--swiper-navigation-color': '#000',
        '--swiper-navigation-size': '1rem',
      } as React.CSSProperties}
    >
      {newsCards.map((news) => (
        <SwiperSlide key={news.id}>
          <Link to={`/news/${news.id}`} className="relative block w-full h-full">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent">
              <div className="px-4 py-2">
                <h3 className="text-white text-2xl font-semibold line-clamp-1">
                  {news.title.length > 15
                    ? `${news.title.slice(0, 15)}...`
                    : news.title}
                </h3>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;