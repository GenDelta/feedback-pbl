import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    //clear authentication tokens/cookies here
    try {
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
          {isLoggedIn ? "System Admin" : "Admin Dashboard"}
        </span>
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
