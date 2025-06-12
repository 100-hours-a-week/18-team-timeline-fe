import { Input } from '@/components/form/Input'
import type { DetailedHTMLProps, HTMLAttributes, ChangeEvent } from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type EmailInputProps = ReactDivProps & {
  isLabel?: boolean
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  helperText: string | undefined
}

export const EmailInput = ({ isLabel = false, value, onChange, helperText }: EmailInputProps) => {
  return (
    <Input
      {...(isLabel
        ? {
            labelName: '이메일',
            required: true,
          }
        : {})}
      id="email"
      type="text"
      placeholder="이메일을 입력하세요."
      value={value}
      onChange={onChange}
      helperText={helperText}
    />
  )
}
