import React from "react";
import Image from "next/image";

interface DownloadCardProps {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  onClick?: () => void;
  loading?: boolean;
}

const DownloadCard: React.FC<DownloadCardProps> = ({
  title,
  description,
  iconSrc,
  iconAlt,
  onClick,
  loading = false,
}) => {
  return (
    <div
      className={`bg-gray-800 p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors ${
        loading ? "opacity-70" : ""
      }`}
      onClick={!loading ? onClick : undefined}
    >
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>
      <div className="flex items-center justify-center w-32 h-32 ml-6">
        {loading ? (
          <div className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        ) : (
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={96}
            height={96}
            className="object-contain"
            priority
          />
        )}
      </div>
    </div>
  );
};

export default DownloadCard;
