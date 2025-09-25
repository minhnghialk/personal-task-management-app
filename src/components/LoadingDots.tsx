import React from 'react';

export const LoadingDots = () => (
  <div className="flex flex-row gap-2 justify-center py-8">
    <div
      role="status"
      className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-bounce [animation-delay:.7s]"
    ></div>
    <div
      role="status"
      className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-bounce [animation-delay:.3s]"
    ></div>
    <div
      role="status"
      className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-bounce [animation-delay:.7s]"
    ></div>
  </div>
);
