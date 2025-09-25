import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <p className="text-base font-semibold text-indigo-600 animate-bounce">404</p>
      <h1 className="text-5xl md:text-8xl font-semibold text-gray-800 mb-6 animate-pulse">
        Page not found
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center max-w-md">
        Oops! The page you are looking for does not exist. Maybe go back to the login page?
      </p>
      <Link
        to="/login"
        className="px-6 py-3 md:px-8 md:py-4 text-black bg-transparent border border-black rounded-lg shadow hover:bg-black hover:text-white hover:scale-105 transition transform duration-300 flex items-center gap-2"
      >
        Go to Login <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
