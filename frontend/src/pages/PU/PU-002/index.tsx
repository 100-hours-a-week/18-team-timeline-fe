import { LoginForm } from "./LoginForm";
import { Wrapper } from "../components/layout/Wrapper";
import { KaKaoButton } from "../components/ui/Button";

export default function LoginPage() {
  const lineClass = 'border-t border-lineColor my-5';

  return (
    <div className="wrap bg-puBgColor">
      <Wrapper
        title="로그인"
        className="px-9"
      >
        <LoginForm/>
        <div className={lineClass} />
        <KaKaoButton
          accessToken={localStorage.getItem('accessToken') ?? ''}
        />
      </Wrapper>
    </div>
  )
}