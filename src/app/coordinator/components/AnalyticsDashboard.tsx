"use client";

import React, { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import {
  AnalyticsData,
  getAnalyticsData,
} from "../../coordinator/actions/analyticsActions";
import { getCurrentCoordinatorBranch } from "../../coordinator/actions/coordinatorActions";

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinatorBranch, setCoordinatorBranch] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchCoordinatorBranch = async () => {
      try {
        const branch = await getCurrentCoordinatorBranch();
        setCoordinatorBranch(branch);
        return branch;
      } catch (err) {
        console.error("Failed to fetch coordinator branch:", err);
        setError(
          "Failed to authenticate coordinator. Please try logging in again."
        );
        return null;
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        // First get the coordinator's branch
        const branch = await fetchCoordinatorBranch();
        if (!branch) {
          setLoading(false);
          return;
        }

        // Then fetch analytics data filtered by that branch
        const data = await getAnalyticsData(branch);
        setAnalyticsData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-2">
        Analytics Even 2025
      </h1>
      {coordinatorBranch && (
        <h2 className="text-xl text-gray-300 mb-8">
          Branch: {coordinatorBranch}
        </h2>
      )}

      {/* Analytics Charts */}
      <div className="flex flex-wrap gap-8 mb-10">
        {loading ? (
          <>
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg w-72 h-80" />
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg w-72 h-80" />
          </>
        ) : (
          <>
            <DonutChart
              title="Faculty Feedback Submitted"
              submittedPercentage={
                analyticsData?.facultyFeedbackStats.percentage || 0
              }
              submittedCount={analyticsData?.facultyFeedbackStats.submitted}
              totalCount={analyticsData?.facultyFeedbackStats.total}
            />
            <DonutChart
              title="Curriculum Feedback Submitted"
              submittedPercentage={
                analyticsData?.curriculumFeedbackStats.percentage || 0
              }
              submittedCount={analyticsData?.curriculumFeedbackStats.submitted}
              totalCount={analyticsData?.curriculumFeedbackStats.total}
            />
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {loading ? (
          <>
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg h-32" />
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg h-32" />
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg h-32" />
            <div className="bg-gray-800 bg-opacity-40 animate-pulse p-6 rounded-lg h-32" />
          </>
        ) : (
          <>
            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">
                Total Students
              </h3>
              <p className="text-3xl text-pink-500 font-bold">
                {analyticsData?.totalStudents || 0}
              </p>
              <p className="text-gray-300 mt-2">Registered in system</p>
            </div>

            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">
                Faculty Members
              </h3>
              <p className="text-3xl text-blue-500 font-bold">
                {analyticsData?.totalFaculty || 0}
              </p>
              <p className="text-gray-300 mt-2">Active in system</p>
            </div>

            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">
                Pending Submissions
              </h3>
              <p className="text-3xl text-orange-400 font-bold">
                {analyticsData?.pendingSubmissions || 0}
              </p>
              <p className="text-gray-300 mt-2">Faculty feedback</p>
            </div>

            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">
                Total Subjects
              </h3>
              <p className="text-3xl text-green-500 font-bold">
                {analyticsData?.totalSubjects || 0}
              </p>
              <p className="text-gray-300 mt-2">Being evaluated</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-80 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
