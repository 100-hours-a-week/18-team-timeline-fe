import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import TamnaraDefaultImage from '@/assets/tamanara_default_image.png'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ThumbnailProps = ReactDivProps & {
  image?: string
  title: string
}

export const Thumbnail = ({ image, title }: ThumbnailProps) => {
  const wrapperClass = 'flex overflow-hidden'
  const imageClass = 'w-full h-[200px] object-cover'
  const fallbackClass = 'w-full h-[200px] bg-carouselBg flex items-center justify-center text-carouselInactive text-sm'

  return (
    <div className={wrapperClass}>
      <img src={image || TamnaraDefaultImage} alt={title} className={imageClass} />
    </div>
  )
}
