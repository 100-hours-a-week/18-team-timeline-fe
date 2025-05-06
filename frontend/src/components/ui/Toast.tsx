import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, className }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => setVisible(false), 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const wrapperClass = clsx(
    'fixed bottom-10 left-1/2 -translate-x-1/2 z-50',
    'transition-all duration-500 ease-in-out',
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  );

  const toastClass = clsx(
    'bg-toastColor/80 text-toastTextColor rounded-full',
    'px-4 py-2 text-sm font-medium text-left',
    'inline-block w-fit max-w-[350px] whitespace-normal',
    className
  );

  return ReactDOM.createPortal(
    <div className={wrapperClass}>
      <div className={toastClass}>{message}</div>
    </div>,
    document.body
  );
};
