"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isFacultyDashboardVisible } from "../faculty/actions/facultyActions";

interface GiveFeedbackButtonProps {
  context:
    | "Faculty Feedback"
    | "Guest Feedback"
    | "Faculty Curriculum Feedback"
    | "Student Curriculum Feedback"
    | "Guest Curriculum Feedback"
    | "Open Dashboard";
}

const GiveFeedbackButton: React.FC<GiveFeedbackButtonProps> = ({ context }) => {
  const router = useRouter();
  const [isDashboardEnabled, setIsDashboardEnabled] = useState<boolean | null>(
    null
  );

  // Check dashboard visibility state if this is a dashboard button
  useEffect(() => {
    if (context === "Open Dashboard") {
      const checkDashboardVisibility = async () => {
        try {
          const isVisible = await isFacultyDashboardVisible();
          setIsDashboardEnabled(isVisible);
        } catch (error) {
          console.error("Error checking dashboard visibility:", error);
          setIsDashboardEnabled(true); // Default to enabled on error
        }
      };

      checkDashboardVisibility();
    }
  }, [context]);

  const handleClick = () => {
    switch (context) {
      case "Faculty Feedback":
        router.push("/student/faculty-feedback");
        break;
      case "Guest Feedback":
        router.push("/student/guest-feedback");
        break;
      case "Faculty Curriculum Feedback":
        router.push("/faculty/curriculum-feedback");
        break;
      case "Student Curriculum Feedback":
        router.push("/student/curriculum-feedback");
        break;
      case "Guest Curriculum Feedback":
        router.push("/guest/curriculum-feedback");
        break;
      case "Open Dashboard":
        // Check dashboard state and route accordingly
        if (isDashboardEnabled === false) {
          router.push("/faculty/dashboard-disabled");
        } else {
          router.push("/faculty/dashboard");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="relative inline-block group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative text-white rounded-lg p-2 z-10">
        {context === "Open Dashboard" ? "Open Dashboard" : "Give Feedback"}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-buttons-gradientlight to-buttons-gradientdark rounded-lg z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-buttons-gradientlight to-buttons-gradientdark rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-[1000ms] ease-in-out z-0"></div>
    </div>
  );
};

export default GiveFeedbackButton;
