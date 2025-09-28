import React from 'react';

export const SuccessPopup = ({ open, onClose, message, subMessage }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 px-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center animate-fadeIn">
        {/* Icon check */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
        </div>

        {/* Nội dung */}
        <p className="text-gray-800 font-medium mb-2">{message}</p>
        {subMessage && <p className="text-gray-500 text-sm mb-4">{subMessage}</p>}

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};
