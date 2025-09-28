import React from 'react';

export const PulseDot = () => {
  return (
    <div className="relative w-4 h-4">
      <span className="absolute inset-0 rounded-full bg-white"></span>
      <span className="absolute inset-0 rounded-full bg-white animate-ping"></span>
    </div>
  );
};
