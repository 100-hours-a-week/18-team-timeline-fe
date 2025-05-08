import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  content,
  onConfirm,
  onCancel
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-gray-600">{content}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#F2A359] text-white rounded-lg hover:bg-[#E29349] transition-colors"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
