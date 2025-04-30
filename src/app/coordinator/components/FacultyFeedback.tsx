import React, { useState } from "react";
import DownloadCard from "./DownloadCard";
import {
  getCurrentCoordinatorBranch,
  getStudentsWithoutFeedback,
  convertStudentsWithoutFeedbackToCSV,
  getFeedbackByBranch,
  convertFeedbackToCSV,
  getRemarksByBranch,
  convertRemarksToCSV,
  getConsolidatedFeedbackByBranch,
  convertConsolidatedFeedbackToCSV,
  getCompleteFeedbackByBranch,
  convertCompleteFeedbackToCSV,
} from "../actions/coordinatorActions";

const FacultyFeedback: React.FC = () => {
  const [notSubmittedLoading, setNotSubmittedLoading] =
    useState<boolean>(false);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);
  const [remarkLoading, setRemarkLoading] = useState<boolean>(false);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [consolidatedLoading, setConsolidatedLoading] =
    useState<boolean>(false);

  // Function to handle downloading students who haven't submitted feedback
  const handleNotSubmittedDownload = async () => {
    try {
      setNotSubmittedLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get students who haven't submitted feedback
      const students = await getStudentsWithoutFeedback(branch);

      if (students.length === 0) {
        alert("All students in your branch have submitted feedback.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertStudentsWithoutFeedbackToCSV(students);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback_not_submitted_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading feedback not submitted data:", error);
      alert("An error occurred while downloading data.");
    } finally {
      setNotSubmittedLoading(false);
    }
  };

  // Function to handle downloading feedback data
  const handleFeedbackDownload = async () => {
    try {
      setFeedbackLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get feedback data for the coordinator's branch
      const feedbackData = await getFeedbackByBranch(branch);

      if (feedbackData.length === 0) {
        alert("No feedback data found for your branch.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertFeedbackToCSV(feedbackData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `feedback_data_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading feedback data:", error);
      alert("An error occurred while downloading feedback data.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Function to handle downloading remark data
  const handleRemarkDownload = async () => {
    try {
      setRemarkLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get remarks for the coordinator's branch
      const remarks = await getRemarksByBranch(branch);

      if (remarks.length === 0) {
        alert("No remarks found for your branch.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertRemarksToCSV(remarks);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `remarks_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading remarks data:", error);
      alert("An error occurred while downloading remarks data.");
    } finally {
      setRemarkLoading(false);
    }
  };

  // Function to handle downloading consolidated feedback data
  const handleConsolidatedDownload = async () => {
    try {
      setConsolidatedLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get consolidated feedback data for the coordinator's branch
      const feedbackData = await getConsolidatedFeedbackByBranch(branch);

      if (feedbackData.length === 0) {
        alert("No consolidated feedback data found for your branch.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertConsolidatedFeedbackToCSV(feedbackData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consolidated_feedback_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading consolidated feedback data:", error);
      alert("An error occurred while downloading consolidated feedback data.");
    } finally {
      setConsolidatedLoading(false);
    }
  };

  // Function to handle downloading complete feedback data
  const handleCompleteFeedbackDownload = async () => {
    try {
      setCompleteLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get complete feedback data for the coordinator's branch
      const feedbackData = await getCompleteFeedbackByBranch(branch);

      if (feedbackData.length === 0) {
        alert("No complete feedback data found for your branch.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertCompleteFeedbackToCSV(feedbackData);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `complete_feedback_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading complete feedback data:", error);
      alert("An error occurred while downloading complete feedback data.");
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Faculty Feedback Manager
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
        <DownloadCard
          title="Feedback Not Submitted"
          description="Download File for students who have not submitted Feedback"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleNotSubmittedDownload}
          loading={notSubmittedLoading}
        />
        <DownloadCard
          title="Feedback Download"
          description="Download Feedback File for your branch (without remark)"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleFeedbackDownload}
          loading={feedbackLoading}
        />
        <DownloadCard
          title="Remark Download"
          description="Download Remark File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleRemarkDownload}
          loading={remarkLoading}
        />
        <DownloadCard
          title="Consolidated Download"
          description="Download Consolidated Feedback File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleConsolidatedDownload}
          loading={consolidatedLoading}
        />
        <DownloadCard
          title="Complete Feedback Download"
          description="Download Complete Feedback File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleCompleteFeedbackDownload}
          loading={completeLoading}
        />
      </div>
    </div>
  );
};

export default FacultyFeedback;
