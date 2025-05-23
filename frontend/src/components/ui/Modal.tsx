import React, { type DetailedHTMLProps, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Input } from '../form/Input';

const backgroundClass = 'fixed inset-0 z-50 bg-myBlack/60 flex items-center justify-center'
const modalContainerClass = 'bg-modalBg rounded-[10px] w-[320px] p-6 text-center shadow-lg'
const textWrapperClass = 'mt-2 mb-3 space-y-1'
const titleClass = 'text-xl font-bold text-modalTitle'
const contentClass = 'text-sm text-modalContent'
const buttonClass = 'px-7 py-1 rounded-md text-modalBtnText font-medium'
const inputClass = 'mb-5'

type ModalProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  isOpen: boolean;
  title: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal = ({
  isOpen, title, content, onConfirm, onCancel
}: ModalProps) => {
  if (!isOpen) return null;

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
              'bg-modalBtnConfirm hover:bg-modalBtnConfirmHover'
            )}
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className={clsx(
              buttonClass,
              'bg-modalBtnCancel hover:bg-modalBtnCancelHover'
            )}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

type InputModalProps = ModalProps & {
  text: string
  disabled: boolean
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputModal = ({
  isOpen, title, content, onConfirm, onCancel,
  disabled,
  text, onTextChange
}: InputModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={backgroundClass}>
      <div className={modalContainerClass}>
        <div className={textWrapperClass}>
          <h2 className={titleClass}>{title}</h2>
          {content && <p className={contentClass}>{content}</p>}
        </div>
        <Input
          placeholder='회원탈퇴 문구를 입력하세요.'
          type='text'
          value={text}
          onChange={onTextChange}
          className={inputClass}
        />
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={clsx(
              buttonClass,
              {
                'bg-modalBtnConfirm hover:bg-modalBtnConfirmHover': !disabled,
                'bg-modalBtnInactive': disabled,
              }
            )}
            
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className={clsx(
              buttonClass,
              'bg-modalBtnCancel hover:bg-modalBtnCancelHover'
            )}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
