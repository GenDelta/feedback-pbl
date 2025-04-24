"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getCurrentFacultyInfo,
  getFacultyFeedbackAnalytics,
  FeedbackData,
} from "../actions/facultyActions";

const FeedbackAnalytics: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get current faculty info
        const faculty = await getCurrentFacultyInfo();

        if (!faculty) {
          setError(
            "Unable to fetch faculty information. Please try logging in again."
          );
          setLoading(false);
          return;
        }

        // Get feedback analytics
        const analytics = await getFacultyFeedbackAnalytics(faculty.facultyId);

        setFeedbackData(analytics.feedbackData);
        setBatches(analytics.batches);
        setBranches(analytics.branches);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback analytics:", err);
        setError("An error occurred while fetching feedback data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = feedbackData.filter(
    (data) =>
      (selectedBatch === "all" || data.batch === selectedBatch) &&
      (selectedBranch === "all" || data.branch === selectedBranch)
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Feedback Analytics
      </h1>

      {error && (
        <div className="bg-red-500 bg-opacity-80 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <div>
          <label className="text-white mr-2">Batch:</label>
          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white mr-2">Branch:</label>
          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8">
        {/* Subject-wise Rating Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Subject-wise Average Rating
          </h2>
          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            ) : filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" name="Average Rating" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No feedback data available
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Average Rating
            </h3>
            <p className="text-3xl text-pink-500 font-bold">
              {loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : filteredData.length > 0 ? (
                (
                  filteredData.reduce((acc, curr) => acc + curr.rating, 0) /
                  filteredData.length
                ).toFixed(1)
              ) : (
                "0.0"
              )}
            </p>
            <p className="text-gray-300 mt-2">Overall performance</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Total Subjects
            </h3>
            <p className="text-3xl text-blue-500 font-bold">
              {loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                new Set(filteredData.map((data) => data.subject)).size
              )}
            </p>
            <p className="text-gray-300 mt-2">Being evaluated</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-2">
              Total Feedback
            </h3>
            <p className="text-3xl text-green-500 font-bold">
              {loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                filteredData.length
              )}
            </p>
            <p className="text-gray-300 mt-2">Responses received</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;
