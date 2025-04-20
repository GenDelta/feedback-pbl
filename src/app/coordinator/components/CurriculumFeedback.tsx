import React from "react";
import DownloadCard from "./DownloadCard";

const CurriculumFeedback: React.FC = () => {
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
          />
        </div>
        <div className="w-96">
          <DownloadCard
            title="Feedback Download"
            description="Download Curriculum Feedback File with all responses from your branch"
            iconSrc="/DownloadIcon.svg"
            iconAlt="Download"
          />
        </div>
      </div>
    </div>
  );
};

export default CurriculumFeedback;
