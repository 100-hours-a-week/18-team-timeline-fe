import { Wrapper } from "../components/layout/Wrapper";
import { FindPasswordForm } from "./FindPasswordForm";

export default function FindPasswordPage() {
  return (
    <div className="wrap bg-puBg">
      <Wrapper
      title="비밀번호 찾기"
      className="px-8"
      >
        <FindPasswordForm/>
      </Wrapper>
  </div>
  )
}