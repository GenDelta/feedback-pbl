import React, { useState } from "react";
import DownloadCard from "./DownloadCard";
import {
  getCurrentCoordinatorBranch,
  getStudentsWithoutCurriculumFeedback, // Changed to the correct function
  convertStudentsWithoutFeedbackToCSV,
  getCurriculumFeedbackByBranch,
  convertCurriculumFeedbackToCSV,
} from "../actions/coordinatorActions";

const CurriculumFeedback: React.FC = () => {
  const [notSubmittedLoading, setNotSubmittedLoading] =
    useState<boolean>(false);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);

  // Function to handle downloading students who haven't submitted curriculum feedback
  const handleNotSubmittedDownload = async () => {
    try {
      setNotSubmittedLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();
      console.log("Coordinator branch:", branch);

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get students who haven't submitted curriculum feedback
      // Changed to use the correct function for curriculum feedback
      const students = await getStudentsWithoutCurriculumFeedback(branch);
      console.log(
        `Found ${students.length} students without curriculum feedback`
      );

      if (students.length === 0) {
        alert(
          "All students in your branch have submitted curriculum feedback."
        );
        return;
      }

      // Log student details for debugging
      students.forEach((student, index) => {
        console.log(
          `Student ${index + 1}: ${student.name}, PRN: ${student.prn}`
        );
      });

      // Convert to CSV and download
      const csvData = await convertStudentsWithoutFeedbackToCSV(students);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `curriculum_feedback_not_submitted_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading curriculum feedback not submitted data:",
        error
      );
      alert("An error occurred while downloading data.");
    } finally {
      setNotSubmittedLoading(false);
    }
  };

  // Function to handle downloading curriculum feedback data
  const handleFeedbackDownload = async () => {
    try {
      setFeedbackLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get curriculum feedback data for the coordinator's branch
      const feedbackData = await getCurriculumFeedbackByBranch(branch);

      if (feedbackData.length === 0) {
        alert("No curriculum feedback data found for your branch.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertCurriculumFeedbackToCSV(feedbackData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `curriculum_feedback_data_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading curriculum feedback data:", error);
      alert("An error occurred while downloading curriculum feedback data.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Curriculum Feedback Manager
      </h1>

      <div className="flex flex-wrap gap-6 mb-20">
        <div className="w-96">
          <DownloadCard
            title="Feedback Not Submitted"
            description="Download File for students who have not submitted Curriculum Feedback"
            iconSrc="/DownloadIcon.svg"
            iconAlt="Download"
            onClick={handleNotSubmittedDownload}
            loading={notSubmittedLoading}
          />
        </div>
        <div className="w-96">
          <DownloadCard
            title="Feedback Download"
            description="Download Curriculum Feedback File with all responses from your branch"
            iconSrc="/DownloadIcon.svg"
            iconAlt="Download"
            onClick={handleFeedbackDownload}
            loading={feedbackLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CurriculumFeedback;
