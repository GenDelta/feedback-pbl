import React from "react";
import DownloadCard from "./DownloadCard";

const StudentManager: React.FC = () => {
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
        />
        <DownloadCard
          title="Existing Data Download"
          description="Download Existing Student Data"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
        />
        <DownloadCard
          title="Upload"
          description="Upload Data of Student (CSV Format Only)"
          iconSrc="/UploadIcon.svg"
          iconAlt="Upload"
        />
        <DownloadCard
          title="Disable"
          description="Turn the student login ON or OFF"
          iconSrc="/DisableIcon.svg"
          iconAlt="Disable"
        />
      </div>
    </div>
  );
};

export default StudentManager;
