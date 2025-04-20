import React from "react";
import DownloadCard from "./DownloadCard";

const FacultyFeedback: React.FC = () => {
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
        />
        <DownloadCard
          title="Feedback Download"
          description="Download Feedback File for your branch (without remark)"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
        />
        <DownloadCard
          title="Remark Download"
          description="Download Remark File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
        />
        <DownloadCard
          title="Consolidated Download"
          description="Download Consolidated Feedback File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
        />
        <DownloadCard
          title="Complete Feedback Download"
          description="Download Complete Feedback File for your branch"
          iconSrc="/DownloadIcon.svg"
          iconAlt="Download"
        />
      </div>
    </div>
  );
};

export default FacultyFeedback;
