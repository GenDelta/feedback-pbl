"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import StudentManager from "../components/StudentManager";
import TeacherManager from "../components/TeacherManager";
import FacultyFeedback from "../components/FacultyFeedback";
import CurriculumFeedback from "../components/CurriculumFeedback";
import Footer from "@/app/components/Footer";

const CoordinatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("student");

  const renderContent = () => {
    switch (activeTab) {
      case "student":
        return <StudentManager />;
      case "teacher":
        return <TeacherManager />;
      case "faculty-feedback":
        return <FacultyFeedback />;
      case "curriculum-feedback":
        return <CurriculumFeedback />;
      case "analytics":
      default:
        return <AnalyticsDashboard />;
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

export default CoordinatorDashboard;
