import { useState, type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Text } from "../ui/Text";

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

  const containerClass = clsx('w-full flex flex-col justify-center', className);
  const labelClass = clsx('text-base font-semibold text-labelTextColor')
  const inputClass = clsx(
    'h-8 bg-inputBgColor border border-inputBorderColor rounded-[5px]',
    'focus:outline-none focus:ring-1 focus:ring-inputBorderFocusColor',
    'inline-block text-sm placeholder-inputPlaceholderColor px-2'
  );
  const helperClass = clsx('px-2 text-sm text-helperTextColor');

  return (
    <label htmlFor={id} className={containerClass}>
      {labelName && (
        <Text className={labelClass}>
          {labelName}
          {required && <span className="text-labelSpanColor">*</span>}
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
