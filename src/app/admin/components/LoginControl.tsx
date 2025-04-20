import React, { useState } from "react";

const LoginControl: React.FC = () => {
  const [isTeacherLoginActive, setIsTeacherLoginActive] = useState(true);

  const toggleTeacherLogin = (status: boolean) => {
    setIsTeacherLoginActive(status);
    //call an API to update the status
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Teacher Login ON/OFF
      </h1>

      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <p className="text-white">Click ON to activate Teacher Login</p>
          <button
            className={`px-6 py-2 rounded font-medium ${
              isTeacherLoginActive
                ? "bg-green-500"
                : "bg-green-700 hover:bg-green-600"
            }`}
            onClick={() => toggleTeacherLogin(true)}
          >
            ON
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-white">Click OFF to deactivate Teacher Login</p>
          <button
            className={`px-6 py-2 rounded font-medium ${
              !isTeacherLoginActive
                ? "bg-red-500"
                : "bg-red-700 hover:bg-red-600"
            }`}
            onClick={() => toggleTeacherLogin(false)}
          >
            OFF
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginControl;
