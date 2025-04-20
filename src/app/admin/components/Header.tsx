import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    //clear authentication tokens/cookies here
    setIsLoggedIn(false);
    router.push("/");
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
