import { Input } from '@/components/form/Input'
import type { DetailedHTMLProps, HTMLAttributes, ChangeEvent } from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type PasswordCheckInputProps = ReactDivProps & {
  isLabel?: boolean
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  helperText: string | undefined
}

export const PasswordCheckInput = ({ isLabel = false, value, onChange, helperText }: PasswordCheckInputProps) => {
  return (
    <Input
      {...(isLabel
        ? {
            labelName: '비밀번호 확인',
            required: true,
          }
        : {})}
      id="password-check"
      type="password"
      placeholder="비밀번호를 한 번 더 입력하세요."
      value={value}
      onChange={onChange}
      helperText={helperText}
    />
  )
}
