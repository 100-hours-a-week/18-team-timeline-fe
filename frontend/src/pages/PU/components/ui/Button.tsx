import type { DetailedHTMLProps, HTMLAttributes } from "react"
import clsx from "clsx"
import { useRequestStore } from '@/stores/requestStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES, ENDPOINTS } from "@/constants/url"

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type ButtonProps = ReactDivProps & {
  text?: string
  isActive?: boolean
}

const buttonClass = 'w-full h-9 text-base text-buttonTextColor rounded-[5px]'

export const Button = ({
  text,
  isActive = false,
  className: _className
}: ButtonProps) => {

  const className = clsx(
    buttonClass,
    isActive ? 'bg-buttonActiveColor' : 'bg-buttonDisactiveColor',
    _className
  )

  return (
    <button
      className={className}
      disabled={!isActive}
    >
      {text}
    </button>
  )
}

type KakaoButtonProps = ButtonProps & {
  accessToken: string
}

export const KaKaoButton = ({
  text = "카카오로 시작하기",
  accessToken,
  className: _className
}: KakaoButtonProps) => {

  const navigate = useNavigate();
  const {
    postData,
  } = useRequestStore();

  const className = clsx(
    buttonClass,
    'bg-buttonKakaoColor',
    _className
  );

  const handleClick = async () => {
    try {
      const res = await postData(ENDPOINTS.KAKAO_LOGIN, accessToken);
      if (res?.success) {
        navigate(ROUTES.MAIN);
      }
    } catch (error) {
      console.error("카카오 로그인 실패", error);
      alert("카카오 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {text}
    </button>
  );
};