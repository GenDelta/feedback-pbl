"use client";

import React, { useState, useEffect } from "react";
import Appbar from "../../components/Appbar";
import background_login from "../../../../public/background_login.jpg";
import curriculum from "../../../../public/curriculum.png";
import dashboard from "../../../../public/dashboard.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GiveFeedbackButton from "@/app/components/GiveFeedbackButton";
import Footer from "@/app/components/Footer";
import { isFacultyDashboardVisible } from "../actions/facultyActions";

// Define a key for localStorage
const DASHBOARD_CHECK_KEY = "dashboard_checked";

export default function FacultyDashboard() {
  const router = useRouter();
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkDashboardVisibility() {
      try {
        const isVisible = await isFacultyDashboardVisible();
        setIsDashboardVisible(isVisible);

        // Store the result in localStorage for the dashboard redirect
        if (typeof window !== "undefined") {
          localStorage.setItem(
            DASHBOARD_CHECK_KEY,
            isVisible ? "true" : "false"
          );
        }
      } catch (error) {
        console.error("Error checking dashboard visibility:", error);
        setIsDashboardVisible(true); // Default to visible in case of error
      } finally {
        setLoading(false);
      }
    }

    checkDashboardVisibility();
  }, []);

  // Intercept navigation to dashboard
  useEffect(() => {
    // Find the original handler for the dashboard button
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dashboardButton = target.closest('a[href^="/faculty/dashboard"]');

      if (dashboardButton && isDashboardVisible === false) {
        e.preventDefault();
        console.log(
          "Intercepted click to dashboard - redirecting to disabled page"
        );
        fetch("/api/faculty/redirect-handler", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ destination: "/faculty/dashboard-disabled" }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              router.push("/faculty/dashboard-disabled");
            }
          })
          .catch((error) => {
            console.error("Error in redirect:", error);
            router.push("/faculty/dashboard-disabled");
          });
      }
    };

    // Add event listener
    if (isDashboardVisible !== null) {
      document.addEventListener("click", handleNavigation);
    }

    // Clean up
    return () => {
      document.removeEventListener("click", handleNavigation);
    };
  }, [isDashboardVisible, router]);

  return (
    <div
      className="min-h-svh bg-cover bg-center"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      <Appbar />
      <div>
        <div className="flex flex-col align-middle items-center justify-center min-h-screen p-10">
          <div className="text-4xl text-white font-poppins font-light mb-8">
            Faculty Page
          </div>
          <div className="flex space-x-8 mt-4">
            <div className="bg-primary-light rounded-lg p-8 flex flex-col items-center w-96 min-h-[28rem] bg-opacity-90">
              <Image
                src={dashboard}
                alt="teacher"
                width={800}
                height={800}
                className="mt-4"
              />
              <div className="text-primary-dark text-center text-xl font-poppins my-3">
                Dashboard
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins my-3 mb-6 max-w-[200px]">
                View feedback given by
                <br />
                students
              </div>
              <GiveFeedbackButton context="Open Dashboard" />
            </div>
            <div className="bg-primary-light rounded-lg p-8 flex flex-col items-center w-96 min-h-[28rem] bg-opacity-90">
              <Image
                src={curriculum}
                alt="teacher"
                width={800}
                height={800}
                className="mt-4"
              />
              <div className="text-primary-dark text-center text-xl font-poppins my-3">
                Curriculum Feedback
              </div>
              <div className="text-primary-dark text-center text-sm font-poppins my-3 mb-6">
                Please provide feedback on the courses and curriculum structure.
              </div>
              <GiveFeedbackButton context="Faculty Curriculum Feedback" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
