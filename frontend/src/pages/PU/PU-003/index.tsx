import { Wrapper } from "../components/layout/Wrapper";
import { UserInfoForm } from "./UserInfoForm";

export default function UserInfoPage() {
  return (
    <div className="wrap bg-puBgColor">
      <Wrapper
        title="회원정보 수정"
        className="px-8"
      >
        <UserInfoForm /> 
      </Wrapper>
    </div>
  )
}