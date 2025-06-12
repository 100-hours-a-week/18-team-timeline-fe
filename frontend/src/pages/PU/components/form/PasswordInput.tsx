import { Input } from '@/components/form/Input'
import type { DetailedHTMLProps, HTMLAttributes, ChangeEvent } from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type PasswordInputProps = ReactDivProps & {
  isLabel?: boolean
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  helperText: string | undefined
}

export const PasswordInput = ({ isLabel = false, value, onChange, helperText }: PasswordInputProps) => {
  return (
    <Input
      {...(isLabel
        ? {
            labelName: '비밀번호',
            required: true,
          }
        : {})}
      id="password"
      type="password"
      placeholder="비밀번호를 입력하세요."
      value={value}
      onChange={onChange}
      helperText={helperText}
    />
  )
}
