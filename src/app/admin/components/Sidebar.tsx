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
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <nav className="space-y-6 mt-6">
          <div
            className={getTabStyle("show-coordinator")}
            onClick={() => setActiveTab("show-coordinator")}
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
            <span>Show Coordinator</span>
          </div>

          <div
            className={getTabStyle("add-coordinator")}
            onClick={() => setActiveTab("add-coordinator")}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Add Coordinator</span>
          </div>

          <div
            className={getTabStyle("login-control")}
            onClick={() => setActiveTab("login-control")}
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
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              ></path>
            </svg>
            <span>Login ON/OFF</span>
          </div>

          <div
            className={getTabStyle("faq")}
            onClick={() => setActiveTab("faq")}
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>FAQ</span>
          </div>

          <div
            className={getTabStyle("actions")}
            onClick={() => setActiveTab("actions")}
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
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <span>Actions</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
