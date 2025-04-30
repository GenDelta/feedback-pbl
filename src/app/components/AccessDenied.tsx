import React from "react";
import Link from "next/link";

interface AccessDeniedProps {
  message: string;
  redirectUrl?: string;
  redirectText?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message,
  redirectUrl = "/",
  redirectText = "Back to Home",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-primary-dark">
      {/* Modern Error Icon */}
      <div className="w-32 h-32 mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-6">Access Denied</h1>

      <div className="max-w-2xl bg-red-900 bg-opacity-30 p-6 rounded-lg border border-red-500 border-opacity-50 mb-8">
        <p className="text-xl text-white">{message}</p>
      </div>

      <Link
        href={redirectUrl}
        className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 duration-150"
      >
        {redirectText}
      </Link>
    </div>
  );
};

export default AccessDenied;
