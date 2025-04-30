import React, { useState } from "react";
import DownloadCard from "./DownloadCard";
import {
  getCurrentCoordinatorBranch,
  getStudentsByBranch,
  convertStudentsToCSV,
} from "../actions/coordinatorActions";

const StudentManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);

  // Function to download template
  const handleTemplateDownload = async () => {
    try {
      setTemplateLoading(true);

      // Fetch the template file from the public directory
      const response = await fetch("/student_template.csv");

      if (!response.ok) {
        throw new Error("Failed to fetch template file");
      }

      const templateContent = await response.text();

      // Create and trigger download
      const blob = new Blob([templateContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_template.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("An error occurred while downloading the template.");

      // Fallback to generating a basic template if file fetch fails
      const templateCSV = "Name,Email,Branch,Department,Semester,PRN\n,,,,";
      const blob = new Blob([templateCSV], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_template.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setTemplateLoading(false);
    }
  };

  // Function to download existing student data
  const handleExistingDataDownload = async () => {
    try {
      setLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get students from the coordinator's branch
      const students = await getStudentsByBranch(branch);

      if (students.length === 0) {
        alert("No student data found for your branch.");
        return;
      }

      // Convert to CSV and download - await the promise
      const csvData = await convertStudentsToCSV(students);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading student data:", error);
      alert("An error occurred while downloading student data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Student Manager
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <DownloadCard
          title="Template Download"
          description="Download template for student data"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleTemplateDownload}
          loading={templateLoading}
        />
        <DownloadCard
          title="Existing Data Download"
          description="Download Existing Student Data"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleExistingDataDownload}
          loading={loading}
        />
        <DownloadCard
          title="Upload"
          description="Upload Data of Student (CSV Format Only)"
          iconSrc="/UploadIcon.svg"
          iconAlt="Upload"
        />
        {/* <DownloadCard
          title="Disable"
          description="Turn the student login ON or OFF"
          iconSrc="/DisableIcon.svg"
          iconAlt="Disable"
        /> */}
      </div>
    </div>
  );
};

export default StudentManager;
