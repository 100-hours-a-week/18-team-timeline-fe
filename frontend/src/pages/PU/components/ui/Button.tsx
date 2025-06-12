import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import clsx from 'clsx'
import { useRequestStore } from '@/stores/requestStore'
import { ENDPOINTS } from '@/constants/url'
import { PUMessage } from '@/constants/PU/puMessage'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ButtonProps = ReactDivProps & {
  text?: string
  isActive?: boolean
}

const buttonClass = 'w-full h-9 text-base text-btnText rounded-[5px]'

export const Button = ({ text, isActive = false, className: _className }: ButtonProps) => {
  const className = clsx(buttonClass, isActive ? 'bg-btnActiveBg' : 'bg-btnInactiveBg', _className)

  return (
    <button className={className} disabled={!isActive}>
      {text}
    </button>
  )
}

type KakaoButtonProps = ButtonProps & {}

export const KaKaoButton = ({ text = PUMessage.KAKAO_BTN_NAME, className: _className }: KakaoButtonProps) => {
  const { getData } = useRequestStore()

  const className = clsx(buttonClass, 'bg-btnKakaoBg text-myBlack', _className)

  const handleClick = async () => {
    try {
      const res = await getData<{ data: { loginUrl: string } }>(ENDPOINTS.KAKAO_LOGIN)
      const kakaoUrl = res?.data?.loginUrl

      if (!kakaoUrl) throw new Error(PUMessage.KAKAO_BTN_URL_NOT_EXIST)

      window.location.href = kakaoUrl
    } catch (error) {
      console.error('카카오 로그인 요청 실패:', error)
      alert(PUMessage.KAKAO_BTN_LOGIN_FAIL)
    }
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {text}
    </button>
  )
}
