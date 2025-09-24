import React from "react";

export const LoadingFallback = ({ routeName }) => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-600 text-lg">
      {routeName ? `Đang tải ${routeName}...` : "Đang tải..."}
    </p>
  </div>
);
