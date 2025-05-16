import { useState, type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Text } from "../ui/Text";

const containerClass = clsx('w-full flex flex-col justify-center');
const labelClass = clsx('text-base font-semibold text-labelText')
const inputClass = clsx(
  'h-8 bg-inputBg border border-inputBorder rounded-[5px]',
  'focus:outline-none focus:ring-1 focus:ring-inputBorderFocus',
  'inline-block text-sm placeholder-inputPlaceholder px-2'
);
const helperClass = clsx('px-2 text-sm text-helperText leading-snug');

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  labelName?: string;
  helperText?: string;
  required?: boolean;
};

export const Input = ({
  id,
  labelName,
  className,
  helperText,
  required = false,
  ...props
}: InputProps) => {
  const [isTouched, setIsTouched] = useState(false);

  return (
    <label htmlFor={id} className={clsx(containerClass, className)}>
      {labelName && (
        <Text className={labelClass}>
          {labelName}
          {required && <span className="text-labelRequired">*</span>}
        </Text>
      )}
      <input
        id={id}
        className={inputClass}
        onFocus={() => setIsTouched(true)}
        required={required}
        {...props}
      />
      {isTouched && helperText && (
        <Text className={helperClass}>*{helperText}</Text>
      )}
    </label>
  );
};

type ButtonInputProps = InputProps & {
  isValid: boolean
  onClick?: () => void;
};

export const ButtonInput = ({
  id,
  labelName,
  className,
  helperText,
  required = false,
  isValid,
  onClick,
  ...props
}: ButtonInputProps) => {
  const [isTouched, setIsTouched] = useState(false);

  const rowClass = clsx(
    'flex w-full, space-x-1'
  )
  const buttonClass = clsx(
    'w-[80px] text-btnText text-sm rounded-[5px]',
    isValid ? 'bg-btnActiveBg' : 'bg-btnInactiveBg'
  )

  return (
    <label htmlFor={id} className={clsx(containerClass, className)}>
      {labelName && (
        <Text className={labelClass}>
          {labelName}
          {required && <span className="text-labelRequired">*</span>}
        </Text>
      )}
      <div className={rowClass}>
        <input
          id={id}
          className={clsx(inputClass, 'w-full')}
          onFocus={() => setIsTouched(true)}
          required={required}
          {...props}
        />
        <button
          type="button"
          disabled={!isValid}
          onClick={isValid ? onClick : undefined}
          className={buttonClass}
        >
          인증
        </button>
      </div>
      {isTouched && helperText && (
        <Text className={helperClass}>*{helperText}</Text>
      )}
    </label>
  );
};
