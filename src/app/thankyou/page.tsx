"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { signOut } from "next-auth/react";

const ThankYouPage = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/student/dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      signOut();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#aa6b95]">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <Image
                src="/FeedbackThankYouDesign.1.svg"
                alt="Feedback Thank You"
                width={300}
                height={300}
                className="w-full max-w-xs mx-auto"
              />
            </div>

            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Thank you for submitting your feedback!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your feedback has been successfully recorded.
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="bg-[#aa6b95] hover:bg-[#955d84] text-white py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ThankYouPage;
