import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINTS, ROUTES } from '@/constants/url'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, EffectFade } from 'swiper/modules'
import { CarouselMessage } from '@/constants/PN/MainMessage'
import { Icon } from '@/components/ui/Icon'
import clsx from 'clsx'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import { useFetchHotissue } from './useFetchHotissue'

type CarouselProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Carousel = ({}: CarouselProps) => {
  const { newsCards, loading } = useFetchHotissue()
  const navigate = useNavigate()

  const wrapperClass = 'w-full h-[200px] bg-carouselBg rounded-[5px] flex items-center justify-center cursor-pointer'
  const metaTextClass = 'text-carouselInactive text-center text-sm'
  const loadingClass = 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carouselInactive'
  const titleWrapperClass = 'absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-myBlack/80 to-transparent'
  const titleClass = 'absolute bottom-4 text-myWhite text-2xl font-semibold line-clamp-1 px-4'
  const imageClass = 'w-full h-full object-cover'
  const iconClass = 'absolute top-1/2 -translate-y-1/2 z-10 items-center justify-center'

  if (loading) {
    return (
      <div className={wrapperClass}>
        <div className={loadingClass}></div>
      </div>
    )
  }

  if (newsCards.length === 0) {
    return (
      <div className={wrapperClass}>
        <div className={metaTextClass}>{CarouselMessage.NO_RESULT}</div>
      </div>
    )
  }

  return (
    <Swiper
      modules={[Autoplay, Navigation, EffectFade]}
      loop
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      effect="slide"
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }}
      className={wrapperClass}
    >
      <div className={clsx(iconClass, 'swiper-button-prev')}>
        <Icon name="ChevronLeftIcon" variant="solid" />
      </div>
      <div className={clsx(iconClass, 'swiper-button-next')}>
        <Icon name="ChevronRightIcon" variant="solid" />
      </div>

      {newsCards.map((news) => (
        <SwiperSlide key={news.id}>
          <div onClick={() => navigate(ROUTES.getNewsDetailPath(news.id))}>
            <img src={news.image} alt={news.title} className={clsx(imageClass, metaTextClass)} />
            <div className={titleWrapperClass}>
              <h3 className={titleClass}>{news.title}</h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
