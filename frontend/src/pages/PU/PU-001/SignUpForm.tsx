import { type DetailedHTMLProps, type HTMLAttributes } from "react"
import clsx from "clsx"
import { Input } from "@/components/form/Input"
import { Button } from "../components/ui/Button"
import { Text } from "@/components/ui/Text"
import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/url"
import { useSignUpLogic } from "./SignUpLogic"

type SignUpFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {}

export const SignUpForm = ({}: SignUpFormProps) => {
  const {
    email, setEmail, password, setPassword,
    passwordCheck, setPasswordCheck, name, setName,
    errors, isButtonActive, handleSubmit, checkEmailDuplicate, checkNameDuplicate,
  } = useSignUpLogic()
  
  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const buttonClass = clsx('flex flex-col pt-8 space-y-1')
  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navigationTextColor')
  const linkClass = clsx('hover:text-navigationTextHoverColor')

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <Input
        id="email"
        labelName="이메일"
        required={true}
        type="text"
        placeholder="이메일을 입력하세요."
        value={email}
        maxLength={255}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={checkEmailDuplicate}
        helperText={errors.email}
      />
      <Input
        id="password"
        labelName="비밀번호"
        required={true}
        type="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={errors.password}
      />
      <Input
        id="password-check"
        labelName="비밀번호 확인"
        required={true}
        type="password"
        placeholder="비밀번호를 한 번 더 입력하세요."
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        helperText={errors.passwordCheck}
      />
      <Input
        id="name"
        labelName="닉네임"
        required={true}
        type="text"
        placeholder="닉네임을 입력하세요."
        value={name}
        maxLength={10}
        onChange={(e) => setName(e.target.value)}
        onBlur={checkNameDuplicate}
        helperText={errors.name}
      />
      <div className={buttonClass}>
        <Button
          text="로그인하기"
          isActive={isButtonActive}
        />
        <div className={navigationClass}>
          <Link to={ROUTES.LOGIN} className={linkClass}>
            <Text>로그인하러 가기</Text>
          </Link>
        </div>
      </div>
    </form>
  )
}