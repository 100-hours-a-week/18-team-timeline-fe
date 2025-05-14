import { type DetailedHTMLProps, type HTMLAttributes } from "react";
import clsx from "clsx";

type CheckBoxProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label: string;
  metaText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const CheckBox = ({
  label, metaText, checked = false, onChange,
  className, ...props
}: CheckBoxProps) => {
  const handleChange = () => {
    onChange(!checked);
  };

  const wrapperClass = clsx('flex space-x-1', className);
  const checkClass = clsx('w-4 h-4 my-0.5 accent-checkBoxBgColor cursor-pointer')
  const labelClass = clsx('text-sm cursor-pointer select-none text-checkBoxLabelColor')
  const metaTextClass = clsx('text-xs font-light text-checkBoxMetaTextColor')

  return (
    <div className={wrapperClass} {...props}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={checkClass}
      />
      <div>
        <label onClick={handleChange}>
          <p className={labelClass}>{label}</p>
          {metaText && <p className={metaTextClass}>{metaText}</p>}
        </label>
      </div>
    </div>
  );
};