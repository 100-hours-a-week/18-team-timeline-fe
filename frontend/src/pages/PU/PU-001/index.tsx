import { Wrapper } from "../components/layout/Wrapper";
import { KaKaoButton } from "../components/ui/Button";
import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  const lineClass = 'border-t border-lineColor my-5';

  return (
    <div className="wrap bg-puBgColor">
      <Wrapper
        title="회원가입"
        className="px-8"
      >
        <SignUpForm />
        <div className={lineClass} />
        <KaKaoButton/>
      </Wrapper>
    </div>
  )
}