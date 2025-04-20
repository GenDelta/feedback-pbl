import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const getTabStyle = (tabName: string) => {
    const baseStyle =
      "px-4 py-3 flex items-center space-x-4 rounded-md cursor-pointer transition-all duration-200";

    if (activeTab === tabName) {
      return `${baseStyle} bg-gray-700 text-white shadow-lg`;
    }
    return `${baseStyle} text-gray-300 hover:bg-gray-800`;
  };

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <nav className="space-y-6 mt-6">
          <div
            className={getTabStyle("student")}
            onClick={() => setActiveTab("student")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>Student</span>
          </div>

          <div
            className={getTabStyle("teacher")}
            onClick={() => setActiveTab("teacher")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span>Teacher</span>
          </div>

          <div
            className={getTabStyle("faculty-feedback")}
            onClick={() => setActiveTab("faculty-feedback")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <span>Faculty Feedback</span>
          </div>

          <div
            className={getTabStyle("curriculum-feedback")}
            onClick={() => setActiveTab("curriculum-feedback")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>Curriculum Feedback</span>
          </div>

          <div
            className={getTabStyle("analytics")}
            onClick={() => setActiveTab("analytics")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span>Analytics</span>
          </div>

          <button className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition duration-300">
            <span>View Subject List</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
