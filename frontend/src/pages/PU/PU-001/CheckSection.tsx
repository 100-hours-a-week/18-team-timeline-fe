import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { CheckBox } from '../components/ui/CheckBox'
import clsx from 'clsx'

type CheckSectionProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  checkedTerms: boolean
  setCheckedTerms: (v: boolean) => void

  checkedPrivacy: boolean
  setCheckedPrivacy: (v: boolean) => void
}

export const CheckSection = ({
  checkedTerms,
  setCheckedTerms,
  checkedPrivacy,
  setCheckedPrivacy,
  className: _className,
}: CheckSectionProps) => {
  const wrapperClass = clsx('flex flex-col space-y-1', _className)

  return (
    <div className={wrapperClass}>
      <CheckBox
        label="이용약관에 동의합니다."
        metaText="서비스 이용에 필요한 기본 정책과 조건이 적용됩니다."
        checked={checkedTerms}
        onChange={setCheckedTerms}
      />
      <CheckBox
        label="개인정보 수집·이용에 동의합니다."
        metaText="회원님의 이메일 주소로 인증번호가 전송됩니다."
        checked={checkedPrivacy}
        onChange={setCheckedPrivacy}
      />
    </div>
  )
}
