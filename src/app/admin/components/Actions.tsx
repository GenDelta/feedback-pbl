import React, { useState } from "react";

const Actions: React.FC = () => {
  const [subjectFile, setSubjectFile] = useState<File | null>(null);
  const [specializationFile, setSpecializationFile] = useState<File | null>(
    null
  );

  const handleSubjectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSubjectFile(files[0]);
    }
  };

  const handleSpecializationUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSpecializationFile(files[0]);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">Actions</h1>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300">
            Upload Subject List
          </button>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleSubjectUpload}
            className="text-white"
          />
          {subjectFile && (
            <span className="text-green-400">{subjectFile.name} selected</span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300">
            Upload Specialization List
          </button>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleSpecializationUpload}
            className="text-white"
          />
          {specializationFile && (
            <span className="text-green-400">
              {specializationFile.name} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
