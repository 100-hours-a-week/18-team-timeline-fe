import { useState, type DetailedHTMLProps, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Text } from "../ui/Text";

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  helperText?: string;
};

export const Input = ({
  id,
  className,
  helperText,
  ...props
}: InputProps) => {
  const [isTouched, setIsTouched] = useState(false);

  const labelClass = clsx('w-full flex flex-col justify-center', className);
  const inputClass = clsx(
    'h-7 bg-inputBgColor border border-inputBorderColor rounded-[5px]',
    'focus:outline-none focus:ring-1 focus:ring-inputBorderFocusColor',
    'inline-block text-sm placeholder-inputPlaceholderColor px-2'
  );
  const helperClass = clsx('px-2 text-sm text-helperTextColor');

  return (
    <label htmlFor={id} className={labelClass}>
      <input
        id={id}
        className={inputClass}
        onFocus={() => setIsTouched(true)}
        {...props}
      />
      {isTouched && helperText && (
        <Text className={helperClass}>*{helperText}</Text>
      )}
    </label>
  );
};
