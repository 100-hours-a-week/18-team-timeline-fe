import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import TamnaraIcon from '@/assets/tamnara_icon.png'
import { Text } from '@/components/ui/Text'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type LoginNoticeProps = ReactDivProps & {}

export const LoginNotice = ({}: LoginNoticeProps) => {
  const wrapperClass = 'w-full flex flex-col justify-center items-center space-y-3 pb-8'
  const iconClass = 'w-20 y-20'
  const textClass = 'text-center text-myBlack text-lg leading-tight'
  const highlightClass = 'text-point font-semibold'

  return (
    <div className={wrapperClass}>
      <img src={TamnaraIcon} className={iconClass} />
      <Text className={textClass}>
        <strong className={highlightClass}>나를 위한 타임라인</strong>을
        <br />
        시작해 보세요!
      </Text>
    </div>
  )
}
