import React from "react";
import DonutChart from "./DonutChart";

const AnalyticsDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Analytics Even 2025
      </h1>

      {/* Analytics Charts */}
      <div className="flex flex-wrap gap-8 mb-10">
        <DonutChart
          title="Faculty Feedback Submitted"
          submittedPercentage={80}
        />
        <DonutChart
          title="Curriculum Feedback Submitted"
          submittedPercentage={10}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">
            Total Students
          </h3>
          <p className="text-3xl text-pink-500 font-bold">367</p>
          <p className="text-gray-300 mt-2">Registered in system</p>
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">
            Faculty Members
          </h3>
          <p className="text-3xl text-blue-500 font-bold">42</p>
          <p className="text-gray-300 mt-2">Active in system</p>
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">
            Pending Submissions
          </h3>
          <p className="text-3xl text-orange-400 font-bold">78</p>
          <p className="text-gray-300 mt-2">Faculty feedback</p>
        </div>

        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">
            Total Subjects
          </h3>
          <p className="text-3xl text-green-500 font-bold">32</p>
          <p className="text-gray-300 mt-2">Being evaluated</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
