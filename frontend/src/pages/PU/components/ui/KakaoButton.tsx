import clsx from 'clsx'
import { useRequestStore } from '@/stores/useRequestStore'
import { ENDPOINTS } from '@/constants/url'
import { PUMessage } from '@/constants/PU/puMessage'
import kakaoLoginImg from '@/assets/kakao_login_large_wide.png'

export const KaKaoButton = () => {
  const { getData } = useRequestStore()

  const buttonClass = clsx('w-full h-9 text-base text-btnText rounded-[5px] text-myBlack')

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
    <button className={buttonClass} onClick={handleClick}>
      <img src={kakaoLoginImg} alt={PUMessage.KAKAO_BTN_NAME} />
    </button>
  )
}
