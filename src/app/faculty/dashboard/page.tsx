"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FeedbackAnalytics from "../components/FeedbackAnalytics";
import AdditionalFeedback from "../components/AdditionalFeedback";
import Footer from "@/app/components/Footer";

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("analytics");

  const renderContent = () => {
    switch (activeTab) {
      case "additional-feedback":
        return <AdditionalFeedback />;
      case "analytics":
      default:
        return <FeedbackAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-8">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default FacultyDashboard;
