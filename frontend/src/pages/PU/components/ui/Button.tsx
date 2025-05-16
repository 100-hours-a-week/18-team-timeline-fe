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

const buttonClass = 'w-full h-9 text-base text-btnText rounded-[5px]'

export const Button = ({
  text,
  isActive = false,
  className: _className
}: ButtonProps) => {

  const className = clsx(
    buttonClass,
    isActive ? 'bg-btnActiveBg' : 'bg-btnInactiveBg',
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

type KakaoButtonProps = ButtonProps & {}

export const KaKaoButton = ({
  text = "카카오로 시작하기",
  className: _className
}: KakaoButtonProps) => {
  const { getData } = useRequestStore();

  const className = clsx(
    buttonClass,
    'bg-btnKakaoBg text-myBlack',
    _className
  );

  const handleClick = async () => {
    try {
      const res = await getData<{ data: { loginUrl: string } }>(ENDPOINTS.KAKAO_LOGIN);
      const kakaoUrl = res?.data?.loginUrl;

      if (!kakaoUrl) throw new Error("카카오 로그인 URL이 존재하지 않습니다.");

      window.location.href = kakaoUrl;
    } catch (error) {
      console.error("카카오 로그인 요청 실패", error);
      alert("카카오 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {text}
    </button>
  );
};