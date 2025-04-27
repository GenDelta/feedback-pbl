"use client";

import React, { useState, useEffect } from "react";
import {
  getCoordinators,
  deleteCoordinator,
  Coordinator,
} from "../actions/adminActions";

const ShowCoordinator: React.FC = () => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchCoordinators = async () => {
    setLoading(true);
    try {
      const data = await getCoordinators();
      setCoordinators(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching coordinators:", err);
      setError("Failed to load coordinators. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCoordinator(id);
      if (result.success) {
        setDeleteMessage({ type: "success", text: result.message });
        // Refresh the coordinator list
        fetchCoordinators();
      } else {
        setDeleteMessage({ type: "error", text: result.message });
      }
    } catch (err) {
      console.error("Error deleting coordinator:", err);
      setDeleteMessage({
        type: "error",
        text: "An error occurred while removing the coordinator",
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setDeleteMessage(null);
    }, 3000);
  };

  // Fetch coordinators when component mounts
  useEffect(() => {
    fetchCoordinators();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Active Coordinator List
      </h1>

      {deleteMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            deleteMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {deleteMessage.text}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500 text-white">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : coordinators.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-xl">No coordinators found</p>
          <p className="mt-2">Add a coordinator to see them listed here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-6 text-left">Sr. No.</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Branch</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {coordinators.map((coordinator, index) => (
                <tr key={coordinator.id} className="border-b border-gray-700">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">{coordinator.email}</td>
                  <td className="py-4 px-6">
                    {coordinator.branch || "Not specified"}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(coordinator.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowCoordinator;
