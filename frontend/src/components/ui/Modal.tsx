import React from 'react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const backgroundClass = 'fixed inset-0 z-50 bg-myBlack/60 flex items-center justify-center'
  const modalContainerClass = 'bg-modalColor rounded-[10px] w-[300px] p-6 text-center shadow-lg'
  const textWrapperClass = 'mt-2 mb-5 space-y-1'
  const titleClass = 'text-xl font-bold'
  const contentClass = 'text-sm text-modalContentColor'
  const buttonClass = 'px-7 py-1 rounded-md text-modalButtonTextColor font-medium'

  return (
    <div className={backgroundClass}>
      <div className={modalContainerClass}>
        <div className={textWrapperClass}>
          <h2 className={titleClass}>{title}</h2>
          {content && <p className={contentClass}>{content}</p>}
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className={clsx(
              buttonClass,
              'bg-modalButtonConfirmColor hover:bg-modalButtonConfirmHoverColor'
            )}
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className={clsx(
              buttonClass,
              'bg-modalButtonCancelColor hover:bg-modalButtonCancelHoverColor'
            )}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
