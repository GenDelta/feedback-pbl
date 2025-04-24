import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //clear authentication tokens/cookies here
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
          {isLoggedIn ? "coordinator@sitpune.edu.in" : "Coordinator Dashboard"}
        </span>
      </div>
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 transition duration-300 flex items-center"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2 transition duration-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            Login with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
