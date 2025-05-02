"use client";

import React, { useState, useEffect } from "react";
import {
  getVisibilityState,
  updateVisibilityState,
} from "../actions/adminActions";

const LoginControl: React.FC = () => {
  const [isFacultyLoginActive, setIsFacultyLoginActive] =
    useState<boolean>(true);
  const [isStudentLoginActive, setIsStudentLoginActive] =
    useState<boolean>(true);
  const [isFacultyDashboardActive, setIsFacultyDashboardActive] =
    useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateStatus, setUpdateStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Fetch current visibility states when component mounts
  useEffect(() => {
    const fetchVisibilityStates = async () => {
      try {
        setLoading(true);
        const facultyLoginState = await getVisibilityState("facultyLogin");
        const studentLoginState = await getVisibilityState("studentLogin");
        const facultyDashboardState = await getVisibilityState(
          "facultyDashboard"
        );

        setIsFacultyLoginActive(facultyLoginState === 1);
        setIsStudentLoginActive(studentLoginState === 1);
        setIsFacultyDashboardActive(facultyDashboardState === 1);
      } catch (error) {
        console.error("Error fetching visibility states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisibilityStates();
  }, []);

  const toggleFacultyLogin = async (status: boolean) => {
    try {
      setLoading(true);
      const success = await updateVisibilityState(
        "facultyLogin",
        status ? 1 : 0
      );

      if (success) {
        setIsFacultyLoginActive(status);
        setUpdateStatus({
          success: true,
          message: `Faculty login ${
            status ? "activated" : "deactivated"
          } successfully!`,
        });
      } else {
        setUpdateStatus({
          success: false,
          message: "Failed to update faculty login status.",
        });
      }
    } catch (error) {
      console.error("Error updating faculty login state:", error);
      setUpdateStatus({
        success: false,
        message: "An error occurred while updating faculty login status.",
      });
    } finally {
      setLoading(false);

      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    }
  };

  const toggleStudentLogin = async (status: boolean) => {
    try {
      setLoading(true);
      const success = await updateVisibilityState(
        "studentLogin",
        status ? 1 : 0
      );

      if (success) {
        setIsStudentLoginActive(status);
        setUpdateStatus({
          success: true,
          message: `Student login ${
            status ? "activated" : "deactivated"
          } successfully!`,
        });
      } else {
        setUpdateStatus({
          success: false,
          message: "Failed to update student login status.",
        });
      }
    } catch (error) {
      console.error("Error updating student login state:", error);
      setUpdateStatus({
        success: false,
        message: "An error occurred while updating student login status.",
      });
    } finally {
      setLoading(false);

      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    }
  };

  const toggleFacultyDashboard = async (status: boolean) => {
    try {
      setLoading(true);
      const success = await updateVisibilityState(
        "facultyDashboard",
        status ? 1 : 0
      );

      if (success) {
        setIsFacultyDashboardActive(status);
        setUpdateStatus({
          success: true,
          message: `Faculty dashboard ${
            status ? "activated" : "deactivated"
          } successfully!`,
        });
      } else {
        setUpdateStatus({
          success: false,
          message: "Failed to update faculty dashboard status.",
        });
      }
    } catch (error) {
      console.error("Error updating faculty dashboard state:", error);
      setUpdateStatus({
        success: false,
        message: "An error occurred while updating faculty dashboard status.",
      });
    } finally {
      setLoading(false);

      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Visibility Control Panel
      </h1>

      {/* Status message */}
      {updateStatus && (
        <div
          className={`p-4 mb-6 rounded ${
            updateStatus.success ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <p className="text-white">{updateStatus.message}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading...</span>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Student Login Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Student Login Control
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white text-lg">Current Status:</p>
                <span
                  className={`px-3 py-1 rounded font-medium ${
                    isStudentLoginActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isStudentLoginActive ? "ACTIVE" : "DISABLED"}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    !isStudentLoginActive
                      ? "bg-gray-600 hover:bg-green-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleStudentLogin(true)}
                  disabled={loading || isStudentLoginActive}
                >
                  ACTIVATE
                </button>

                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    isStudentLoginActive
                      ? "bg-gray-600 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleStudentLogin(false)}
                  disabled={loading || !isStudentLoginActive}
                >
                  DISABLE
                </button>
              </div>
            </div>
          </div>

          {/* Faculty Login Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Faculty Login Control
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white text-lg">Current Status:</p>
                <span
                  className={`px-3 py-1 rounded font-medium ${
                    isFacultyLoginActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isFacultyLoginActive ? "ACTIVE" : "DISABLED"}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    !isFacultyLoginActive
                      ? "bg-gray-600 hover:bg-green-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleFacultyLogin(true)}
                  disabled={loading || isFacultyLoginActive}
                >
                  ACTIVATE
                </button>

                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    isFacultyLoginActive
                      ? "bg-gray-600 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleFacultyLogin(false)}
                  disabled={loading || !isFacultyLoginActive}
                >
                  DISABLE
                </button>
              </div>
            </div>
          </div>

          {/* Faculty Dashboard Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Faculty Dashboard Control
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white text-lg">Current Status:</p>
                <span
                  className={`px-3 py-1 rounded font-medium ${
                    isFacultyDashboardActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isFacultyDashboardActive ? "ACTIVE" : "DISABLED"}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    !isFacultyDashboardActive
                      ? "bg-gray-600 hover:bg-green-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleFacultyDashboard(true)}
                  disabled={loading || isFacultyDashboardActive}
                >
                  ACTIVATE
                </button>

                <button
                  className={`px-6 py-2 rounded font-medium w-32 ${
                    isFacultyDashboardActive
                      ? "bg-gray-600 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => toggleFacultyDashboard(false)}
                  disabled={loading || !isFacultyDashboardActive}
                >
                  DISABLE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginControl;
