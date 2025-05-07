import React from 'react';
import { Link } from 'react-router-dom';

// ① Swiper React 컴포넌트와 필요한 모듈을 불러옵니다
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';

// ② CSS 임포트
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';


interface NewsCard {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

const newsCards: NewsCard[] = [
  { id: '1', title: '핫이슈 입니다 1',  imageUrl: 'https://picsum.photos/seed/1/400/200', category: 'Economy' },
  { id: '2', title: '핫이슈 입니다 2',  imageUrl: 'https://picsum.photos/seed/2/400/200', category: 'Sports' },
  { id: '3', title: '핫이슈 일지도 아닐지도 모릅니다', imageUrl: 'https://picsum.photos/seed/3/400/200', category: 'Entertainment' }
];

export const Banner: React.FC = () => {
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
        '--swiper-navigation-size': '2rem'
      } as React.CSSProperties}
    >
      {newsCards.map((news) => (
        <SwiperSlide key={news.id}>
          <Link to={`/timeline/${news.id}`} className="relative block w-full h-full">
            <img
              src={news.imageUrl}
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
