import React from "react";
import background_login from "../../../public/background_login.jpg";

const Team = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      {/* Credits Card */}
      <div className="bg-gray-800 rounded-2xl p-8 max-w-xl w-full mx-4 backdrop-blur-sm relative z-10 bg-opacity-80 shadow-lg">
        <h1 className="text-3xl font-semibold text-white mb-1">Credits</h1>
        <p className="text-gray-400 mb-6">Meet the Team</p>

        <div className="space-y-6">
          {/* Creators */}
          <div>
            <h2 className="text-xl text-white mb-2">Creators:</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="https://www.linkedin.com/in/skp2208/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Swayam Pendgaonkar
              </a>
              <a
                href="https://www.linkedin.com/in/sakshamgupta912/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Saksham Gupta
              </a>
              <a
                href="https://www.linkedin.com/in/yajushreshtha-shukla/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Yajushreshtha Shukla
              </a>
            </div>
          </div>

          {/* 1st Maintenance Team */}
          <div>
            <h2 className="text-xl text-white mb-2">
              1st Maintenance Team (22-26 Batch):
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="https://www.linkedin.com/in/pramit-sharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Pramit Sharma
              </a>
              <a
                href="https://www.linkedin.com/in/pranavsuri4/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Pranav Suri
              </a>
              <a
                href="https://www.linkedin.com/in/priyanshi-bhargava/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Priyanshi Bhargava
              </a>
            </div>
          </div>

          {/* 2nd Maintenance Team */}
          <div>
            <h2 className="text-xl text-white mb-2">
              2nd Maintenance Team (23-27 Batch):
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="https://www.linkedin.com/in/ankushdutta/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Ankush Dutta
              </a>
              <a
                href="https://www.linkedin.com/in/mitiksha-paliwal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Mitiksha Paliwal
              </a>
              <a
                href="https://www.linkedin.com/in/tanvee-patil-55b211283/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Tanvee Patil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
