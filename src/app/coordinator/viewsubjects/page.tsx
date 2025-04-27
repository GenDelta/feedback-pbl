"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSubjects,
  searchSubjects,
  Subject,
} from "../actions/coordinatorActions";
import Header from "../components/Header";
import Footer from "@/app/components/Footer";

export default function ViewSubjects() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [nameSearch, setNameSearch] = useState<string>("");
  const [typeSearch, setTypeSearch] = useState<string>("");
  const [batchSearch, setBatchSearch] = useState<string>("");

  // Create memoized search function to avoid dependency issues
  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass the trimmed search terms to avoid issues with whitespace
      const results = await searchSubjects(
        nameSearch.trim(),
        typeSearch.trim(),
        batchSearch.trim()
      );
      setSubjects(results);
    } catch (error) {
      console.error("Error during search:", error);
      setError("Failed to search subjects. Please try again.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [nameSearch, typeSearch, batchSearch]);

  // Debounce search to prevent excessive database calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [performSearch]);

  // Initial data fetch - only runs once on component mount
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const data = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="container mx-auto p-6 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Subject List</h1>
          <button
            onClick={() => router.push("/coordinator/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back
          </button>
        </div>

        {/* Search filters with better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label
              htmlFor="nameSearch"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Subject Name
            </label>
            <input
              id="nameSearch"
              type="text"
              placeholder="Search for subject names..."
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="typeSearch"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Subject Type
            </label>
            <input
              id="typeSearch"
              type="text"
              placeholder="Theory or Practical"
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="batchSearch"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Batch
            </label>
            <input
              id="batchSearch"
              type="text"
              placeholder="Search for batches..."
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={batchSearch}
              onChange={(e) => setBatchSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-700 text-white p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Subjects Table with improved column spacing */}
        <div className="overflow-auto rounded-lg shadow mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-4 pl-6 border-b border-gray-700 w-1/2">
                  Name
                </th>
                <th className="p-4 border-b border-gray-700 w-1/4">Type</th>
                <th className="p-4 pr-6 border-b border-gray-700 w-1/4">
                  Batch
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-6">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                      <span>Loading subjects...</span>
                    </div>
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">No subjects found</span>
                      <span className="text-sm text-gray-400 mt-1">
                        Try adjusting your search criteria
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4 pl-6">{subject.name}</td>
                    <td className="p-4">{subject.type}</td>
                    <td className="p-4 pr-6">{subject.batch || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
