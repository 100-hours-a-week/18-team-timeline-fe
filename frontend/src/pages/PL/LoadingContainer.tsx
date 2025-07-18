import { TamnaraIcon } from '@/assets'
import { useTypingLoadingText } from './useTypingLoadingText'

export const LoadingContainer = () => {
  const iconContainerClass = 'flex flex-col h-full justify-start items-center gap-2 mt-80'
  const iconClass = 'w-20'
  const textClass = 'text-lg font-semibold text-point'

  return (
    <div className={iconContainerClass}>
      <img src={TamnaraIcon} className={iconClass} />
      <p className={textClass}>{useTypingLoadingText()}</p>
    </div>
  )
}
