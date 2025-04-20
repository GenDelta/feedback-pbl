"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Actions from "../components/Actions";
import FAQ from "../components/FAQ";
import LoginControl from "../components/LoginControl";
import ShowCoordinator from "../components/ShowCoordinator";
import AddCoordinator from "../components/AddCoordinator";
import Footer from "@/app/components/Footer";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("show-coordinator");

  const renderContent = () => {
    switch (activeTab) {
      case "actions":
        return <Actions />;
      case "faq":
        return <FAQ />;
      case "login-control":
        return <LoginControl />;
      case "add-coordinator":
        return (
          <div className="max-w-4xl mx-auto py-4">
            <AddCoordinator />
          </div>
        );
      case "show-coordinator":
      default:
        return <ShowCoordinator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <Header />
      <div className="flex" style={{ marginBottom: "56px" }}>
        <div
          className="w-64 bg-gray-800"
          style={{ minHeight: "calc(100vh - 112px)" }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
