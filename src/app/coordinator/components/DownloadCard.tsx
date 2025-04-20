import React from "react";
import Image from "next/image";

interface DownloadCardProps {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
}

const DownloadCard: React.FC<DownloadCardProps> = ({
  title,
  description,
  iconSrc,
  iconAlt,
}) => {
  return (
    <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition duration-300">
      <div className="flex items-start">
        <div className="bg-gray-700 rounded-full mr-4 min-w-[5rem] min-h-[5rem] w-20 h-20 flex items-center justify-center overflow-hidden">
          <div className="relative w-[70%] h-[70%]">
            <Image src={iconSrc} alt={iconAlt} fill objectFit="contain" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
