import { Wrapper } from "../components/layout/Wrapper";
import { KaKaoButton } from "../components/ui/Button";
import { UserInfoForm } from "./UserInfoForm";

export default function UserInfoPage() {
  const lineClass = 'border-t border-lineColor my-5';

  return (
    <div className="wrap bg-puBgColor">
      <Wrapper
        title="회원정보 수정"
        className="px-8"
      >
        <UserInfoForm /> 
        <div className={lineClass} />
        <KaKaoButton
          accessToken={localStorage.getItem('accessToken') ?? ''}
        />
      </Wrapper>
    </div>
  )
}