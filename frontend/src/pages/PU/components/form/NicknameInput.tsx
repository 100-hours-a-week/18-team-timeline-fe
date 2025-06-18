import { Input } from '@/components/form/Input'
import type { DetailedHTMLProps, HTMLAttributes, ChangeEvent } from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type NicknameInputProps = ReactDivProps & {
  isLabel?: boolean
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
  helperText: string | undefined
}

export const NicknameInput = ({ isLabel = false, value, onChange, onBlur, helperText }: NicknameInputProps) => {
  return (
    <Input
      {...(isLabel
        ? {
            labelName: '닉네임',
            required: true,
          }
        : {})}
      id="nickname"
      type="text"
      placeholder="닉네임을 입력하세요."
      maxLength={10}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      helperText={helperText}
    />
  )
}
