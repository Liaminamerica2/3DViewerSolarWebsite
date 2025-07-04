import React from 'react';

type PopupModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

export const PopupModal = ({ onClose, children }: PopupModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/95 border-2 border-[#2ccfcf] shadow-[0_0_25px_rgba(42,207,207,0.8)] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#2ccfcf] hover:text-white text-4xl font-light leading-none z-20 transition-colors"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};