"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface GiveFeedbackButtonProps {
  context: "Faculty Feedback" | "Guest Feedback" | "Curriculum Feedback";
}

const GiveFeedbackButton: React.FC<GiveFeedbackButtonProps> = ({ context }) => {
  const router = useRouter();

  const handleClick = () => {
    switch (context) {
      case "Faculty Feedback":
        router.push("/faculty-feedback");
        break;
      case "Guest Feedback":
        router.push("/guest-feedback");
        break;
      case "Curriculum Feedback":
        router.push("/curriculum-feedback");
        break;
      default:
        break;
    }
  };

  return (
    <button
      className="bg-gradient-to-r from-buttons-gradientlight to to-buttons-gradientdark text-white rounded-lg p-2 opacity-100"
      onClick={handleClick}
    >
      Give Feedback
    </button>
  );
};

export default GiveFeedbackButton;
