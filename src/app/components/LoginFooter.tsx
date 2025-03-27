import React from "react";

const LoginFooter = () => {
  return (
    <div className="bg-gray-800 h-14 w-svw">
      <hr className="absolute top-3 w-svw border-gray-200" />
      <div className="grid grid-cols-3 items-center pt-4">
        <div className="text-gray-200 text-left font-poppins pl-4">
          Feedback | Copyright © 2025
        </div>
        <div className="text-gray-200 text-center font-poppins">
          Ideation by Dr.Deepali Vora, Head CS IT
        </div>
        <div className="text-gray-200 text-right font-poppins">
          <div>
            Developed by Team: Mitiksha Paliwal, Tanvee Patil, Ankush Dutta
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFooter;
