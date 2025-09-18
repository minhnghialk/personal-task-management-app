import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

export const LoginRequiredPage = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="py-12 px-4 sm:px-6 md:px-6 mx-auto max-w-screen-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400" />
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Truy cập bị từ chối
        </h1>

        {/* Paragraph */}
        <p className="mb-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Bạn cần đăng nhập để truy cập Dashboard. Vui lòng đăng nhập để tiếp
          tục.
        </p>

        {/* CTA Button */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base
                     bg-red-600 text-white font-semibold rounded-lg shadow-md border border-red-700
                     hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500
                     transition-all duration-200"
        >
          Đăng nhập ngay
          <ArrowRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
        </Link>
      </div>
    </section>
  );
};
