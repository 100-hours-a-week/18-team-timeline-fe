import type { DetailedHTMLProps, HTMLAttributes } from "react"
import clsx from "clsx"
import { ButtonInput, Input } from "@/components/form/Input"
import { Button } from "../components/ui/Button"
import { Text } from "@/components/ui/Text"
import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/url"
import { useSignUpLogic } from "./SignUpLogic"
import { CheckSection } from "./CheckSection"

type SignUpFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {}

export const SignUpForm = ({}: SignUpFormProps) => {
  const {
    email, setEmail,
    password, setPassword,
    passwordCheck, setPasswordCheck,
    name, setName,
    code, setCode,
    isEmailInputValid, isEmailAvailable,
    showVerificationInput, setShowVerificationInput,
    sendVerificationCode,
    checkedTerms, setCheckedTerms,
    checkedPrivacy, setCheckedPrivacy,
    checkEmailDuplicate, checkNameDuplicate,
    codeValid,
    errors, isButtonActive, handleSubmit,
  } = useSignUpLogic()
  
  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const checkClass = clsx('pt-3')
  const buttonClass = clsx('flex flex-col pt-8 space-y-1')
  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navigationTextColor')
  const linkClass = clsx('hover:text-navigationTextHoverColor')
  const verificationClass = clsx(
    'transition-all duration-300 ease-in-out',
    showVerificationInput ? 'max-h-[56px] opacity-100' : 'max-h-0 opacity-0'
  )

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <div>
        <ButtonInput
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
          isValid={isEmailInputValid && isEmailAvailable}
          onClick={async () => {
            await sendVerificationCode()
            setShowVerificationInput(true)
          }}
        />
        <div className={verificationClass}>
          <div className={clsx(showVerificationInput ? 'mt-1' : 'mt-0')}>
          <Input
            id="verification"
            required={true}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="인증번호 6자리를 입력하세요."
            value={code}
            helperText={errors.code ?? (codeValid ? "인증이 완료되었습니다." : undefined)}
            readOnly={codeValid}
            className={clsx(codeValid && "text-inputInactiveText cursor-not-allowed")}
            onChange={(e) => {
              if (!codeValid) {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setCode(onlyNums);
              }
            }}
          />
          </div>
        </div>
      </div>
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
      <CheckSection
        checkedTerms={checkedTerms}
        setCheckedTerms={setCheckedTerms}
        checkedPrivacy={checkedPrivacy}
        setCheckedPrivacy={setCheckedPrivacy}
        className={checkClass}
      />
      <div className={buttonClass}>
        <Button
          text="회원가입하기"
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