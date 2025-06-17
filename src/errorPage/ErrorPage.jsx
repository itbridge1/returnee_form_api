import React from "react";

function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 bg-gray-100">
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img
          src="/images/image-removebg-preview.png"
          alt="404 illustration"
          className="w-full max-w-md h-auto"
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-8">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;
