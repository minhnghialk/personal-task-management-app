import React from "react";
import { useIsFetching } from "@tanstack/react-query";

export const GlobalLoader = () => {
  const isFetching = useIsFetching();
  if (!isFetching) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-8 border-t-8 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        <p className="mt-4 text-white font-medium text-lg animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};
