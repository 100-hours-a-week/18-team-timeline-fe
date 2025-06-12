import { useState } from 'react';
import type { ToastPosition } from '../types';

interface UseToastReturn {
  showToast: boolean;
  toastMessage: string;
  toastPosition: ToastPosition;
  setToastMessage: (message: string, position?: ToastPosition) => void;
}

/**
 * 토스트 메시지를 관리하는 커스텀 훅
 */
export const useToast = (): UseToastReturn => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessageState] = useState('');
  const [toastPosition, setToastPosition] = useState<ToastPosition>('bottom');

  const setToastMessage = (message: string, position: ToastPosition = 'bottom') => {
    setToastMessageState(message);
    setToastPosition(position);
    setShowToast(true);
    
    // 3초 후 토스트 메시지 숨기기
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return {
    showToast,
    toastMessage,
    toastPosition,
    setToastMessage
  };
};