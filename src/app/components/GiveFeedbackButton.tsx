"use client";

import React from "react";
import { useRouter } from "next/navigation";

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
        router.push("/faculty/dashboard");
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
