import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { TamnaraDefaultImg } from '@/assets'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ThumbnailProps = ReactDivProps & {
  image?: string
  title: string
}

export const Thumbnail = ({ image, title }: ThumbnailProps) => {
  const wrapperClass = 'w-full aspect-[5/3] overflow-hidden'
  const imageClass = 'w-full h-full object-cover'

  return (
    <div>
      <div className={wrapperClass}>
        <img src={image || TamnaraDefaultImg} alt={title} className={imageClass} />
      </div>
    </div>
  )
}
