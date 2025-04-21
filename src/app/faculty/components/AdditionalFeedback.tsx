import React, { useState } from "react";

interface Feedback {
  id: string;
  subject: string;
  batch: string;
  branch: string;
  comment: string;
  timestamp: string;
}

const AdditionalFeedback: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Placeholder data - to be replaced with actual data from backend
  const feedbackData: Feedback[] = [];
  const batches: string[] = [];
  const branches: string[] = [];
  const subjects: string[] = [];

  const filteredData = feedbackData.filter(
    (data) =>
      (selectedBatch === "all" || data.batch === selectedBatch) &&
      (selectedBranch === "all" || data.branch === selectedBranch) &&
      (selectedSubject === "all" || data.subject === selectedSubject)
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Additional Feedback
      </h1>

      {/* Filters */}
      <div className="flex space-x-4 mb-8">
        <div>
          <label className="text-white mr-2">Batch:</label>
          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
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
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white mr-2">Subject:</label>
          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredData.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {feedback.subject}
                </h3>
                <p className="text-gray-300">
                  {feedback.branch} - Batch {feedback.batch}
                </p>
              </div>
              <span className="text-gray-400 text-sm">{feedback.timestamp}</span>
            </div>
            <p className="text-gray-200">{feedback.comment}</p>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No additional feedback found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default AdditionalFeedback; 