"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

// Function to determine the user role and dashboard URL
async function getUserRole(): Promise<{ role: string; dashboardUrl: string }> {
  try {
    // Try to fetch the session info from the server
    const response = await fetch("/api/auth/session");
    const sessionData = await response.json();

    if (sessionData?.user?.role) {
      const role = sessionData.user.role;

      // Set appropriate dashboard URL based on role
      switch (role) {
        case "student":
          return { role, dashboardUrl: "/student/dashboard" };
        case "faculty":
          return { role, dashboardUrl: "/faculty/page" };
        case "coordinator":
          return { role, dashboardUrl: "/coordinator/dashboard" };
        case "admin":
          return { role, dashboardUrl: "/admin/dashboard" };
        case "guest":
          return { role, dashboardUrl: "/guest/dashboard" };
        default:
          return { role, dashboardUrl: "/" };
      }
    }

    // Default to home page if role not found
    return { role: "unknown", dashboardUrl: "/" };
  } catch (error) {
    console.error("Error fetching user role:", error);
    return { role: "unknown", dashboardUrl: "/" };
  }
}

export default function ThankYouPage() {
  const router = useRouter();
  const [dashboardUrl, setDashboardUrl] = useState<string>("/");

  useEffect(() => {
    // Get the user role and set the dashboard URL
    const getRole = async () => {
      const { dashboardUrl } = await getUserRole();
      setDashboardUrl(dashboardUrl);
    };

    getRole();
  }, []);

  const handleBackToDashboard = () => {
    router.push(dashboardUrl);
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
    <div className="min-h-screen bg-[#aa6b95] flex flex-col">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
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
    </div>
  );
}
