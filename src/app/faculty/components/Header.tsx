"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { getCurrentFacultyInfo } from "../actions/facultyActions";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [facultyName, setFacultyName] = useState<string>("Loading...");
  const [facultyEmail, setFacultyEmail] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadFacultyInfo = async () => {
      try {
        // Check if we have an email in the URL
        const emailParam = searchParams.get("email");

        if (emailParam) {
          // Store the email in a cookie for server components
          document.cookie = `faculty_email=${encodeURIComponent(
            emailParam
          )}; path=/; max-age=86400;`;
          console.log("Set cookie from URL param:", emailParam);
        }

        const facultyInfo = await getCurrentFacultyInfo();

        if (facultyInfo) {
          setFacultyName(facultyInfo.name);
          setFacultyEmail(facultyInfo.email);
          setIsLoggedIn(true);

          // Always store the current faculty email in a cookie
          document.cookie = `faculty_email=${encodeURIComponent(
            facultyInfo.email
          )}; path=/; max-age=86400;`;
          console.log("Set cookie from facultyInfo:", facultyInfo.email);
        } else {
          setFacultyName("Guest");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error loading faculty info:", error);
        setFacultyName("Guest");
        setIsLoggedIn(false);
      }
    };

    loadFacultyInfo();
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      // Clear faculty email cookie on logout
      document.cookie = "faculty_email=; path=/; max-age=0;";

      // Call the logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoggedIn(false);
      signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      signOut();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 text-white bg-gray-800 shadow-md">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-medium">
          {isLoggedIn ? facultyName : "Welcome"}
        </span>
        {facultyEmail && (
          <span className="text-sm text-gray-300">({facultyEmail})</span>
        )}
      </div>
      <div className="flex space-x-4">
        {isLoggedIn && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 transition duration-300 flex items-center"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
