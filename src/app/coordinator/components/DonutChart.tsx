import React from "react";

interface DonutChartProps {
  title: string;
  submittedPercentage: number;
  submittedCount?: number;
  totalCount?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  title,
  submittedPercentage,
  submittedCount,
  totalCount,
}) => {
  const notSubmittedPercentage = 100 - submittedPercentage;

  return (
    <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold text-white mb-4 text-center">
        {title}
      </h2>
      <div className="flex items-center mb-4 justify-center">
        <div className="h-4 w-8 bg-pink-500 mr-2 rounded"></div>
        <span className="text-white">Submitted</span>
        <div className="h-4 w-8 bg-orange-400 ml-6 mr-2 rounded"></div>
        <span className="text-white">Not Submitted</span>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-64 h-64 relative">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="bg-pink-500 h-full"
              style={{ width: `${submittedPercentage}%` }}
            ></div>
            <div
              className="bg-orange-400 h-full absolute top-0 right-0"
              style={{ width: `${notSubmittedPercentage}%` }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-800 rounded-full w-3/5 h-3/5 flex items-center justify-center flex-col">
              <span className="text-white text-xl font-bold">
                {submittedPercentage}%
              </span>
              {submittedCount !== undefined && totalCount !== undefined && (
                <span className="text-gray-400 text-sm mt-1">
                  {submittedCount} / {totalCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
