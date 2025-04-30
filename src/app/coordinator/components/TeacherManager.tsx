import React, { useState } from "react";
import DownloadCard from "./DownloadCard";
import {
  getCurrentCoordinatorBranch,
  getFacultyByDepartment,
  convertFacultyToCSV,
} from "../actions/coordinatorActions";

const TeacherManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);

  // Function to download template
  const handleTemplateDownload = async () => {
    try {
      setTemplateLoading(true);

      // Fetch the template file from the public directory
      const response = await fetch("/faculty_template.csv");

      if (!response.ok) {
        throw new Error("Failed to fetch template file");
      }

      const templateContent = await response.text();

      // Create and trigger download
      const blob = new Blob([templateContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "faculty_template.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("An error occurred while downloading the template.");

      // Fallback to generating a basic template if file fetch fails
      const templateCSV = "Name,Email,Department\n,,";
      const blob = new Blob([templateCSV], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "faculty_template.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setTemplateLoading(false);
    }
  };

  // Function to download existing faculty data
  const handleExistingDataDownload = async () => {
    try {
      setLoading(true);

      // Get the coordinator's branch
      const branch = await getCurrentCoordinatorBranch();

      if (!branch) {
        alert("Could not determine your branch. Please contact support.");
        return;
      }

      // Get faculty from the coordinator's branch/department
      const faculty = await getFacultyByDepartment(branch);

      if (faculty.length === 0) {
        alert("No faculty data found for your department.");
        return;
      }

      // Convert to CSV and download
      const csvData = await convertFacultyToCSV(faculty);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `faculty_${branch}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading faculty data:", error);
      alert("An error occurred while downloading faculty data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Teacher Manager
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <DownloadCard
          title="Template Download"
          description="Download template for teacher data"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleTemplateDownload}
          loading={templateLoading}
        />
        <DownloadCard
          title="Existing Data Download"
          description="Download Existing Teacher Data"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
          onClick={handleExistingDataDownload}
          loading={loading}
        />
        <DownloadCard
          title="Upload"
          description="Upload Data of Teacher (CSV Format Only)"
          iconSrc="/UploadIcon.svg"
          iconAlt="Upload"
        />
        {/* <DownloadCard
          title="Disable"
          description="Turn the teacher feedback visibility ON or OFF"
          iconSrc="/DisableIcon.svg"
          iconAlt="Disable"
        /> */}
      </div>
    </div>
  );
};

export default TeacherManager;
