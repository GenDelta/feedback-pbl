"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-800 h-14 w-svw fixed bottom-0">
      <hr className="w-svw border-gray-200" />
      <div className="grid grid-cols-3 items-center pt-4">
        <div className="text-gray-200 text-left font-poppins pl-4 ml-6">
          Feedback | Copyright © 2025
        </div>
        <div className="text-gray-200 text-center font-poppins ml-6">
          Ideation by Dr.Deepali Vora, Head CS IT
        </div>
        <div className="text-gray-200 text-right font-poppins mr-6">
          <button
            className="text-blue-500 bg-transparent"
            onClick={() => router.push("/team")}
          >
            Meet the team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
