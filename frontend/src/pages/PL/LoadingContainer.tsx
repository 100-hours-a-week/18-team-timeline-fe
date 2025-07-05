import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import TamnaraIcon from '@/assets/tamnara_icon.png'
import { useTypingLoadingText } from './useTypingLoadingText'

type LoadingContainerProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {}

export const LoadingContainer = ({}: LoadingContainerProps) => {
  const iconContainerClass = 'flex flex-col h-full justify-center items-center gap-2'
  const iconClass = 'w-20'
  const textClass = 'text-lg font-semibold text-point'

  return (
    <div className="wrap">
      <div className={iconContainerClass}>
        <img src={TamnaraIcon} className={iconClass} />
        <p className={textClass}>{useTypingLoadingText()}</p>
      </div>
    </div>
  )
}
