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
    <div className="w-64 bg-gray-900 text-white h-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Faculty Dashboard</h2>
        <nav className="space-y-6 mt-6">
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
            <span>Feedback Analytics</span>
          </div>

          <div
            className={getTabStyle("additional-feedback")}
            onClick={() => setActiveTab("additional-feedback")}
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              ></path>
            </svg>
            <span>Additional Feedback</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 