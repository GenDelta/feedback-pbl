"use client";

import React, { useState } from "react";
import Appbar from "../../components/Appbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

// Simplified version with no auto-redirect and primary-dark background
export default function DashboardDisabled() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleManualReturn = () => {
    setIsRedirecting(true);
    router.push("/faculty/page");
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-dark">
      <Appbar />

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto p-8 text-center">
          {/* Warning Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-red-500"
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

          <h1 className="text-4xl font-bold text-white mb-8">
            Dashboard Access Denied
          </h1>

          <div className="bg-red-900 bg-opacity-30 p-8 rounded-lg border border-red-500 border-opacity-50 mb-8">
            <p className="text-2xl text-white mb-6">
              The Faculty Dashboard is currently unavailable. The system
              administrator has temporarily disabled access to this feature.
            </p>
          </div>

          <button
            onClick={handleManualReturn}
            disabled={isRedirecting}
            className={`px-8 py-4 bg-blue-600 text-white text-xl font-medium rounded-md transition-colors shadow-lg min-w-[200px] ${
              isRedirecting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 duration-150"
            }`}
          >
            {isRedirecting ? "Redirecting..." : "Return to Faculty Page"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
