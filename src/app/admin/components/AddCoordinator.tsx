"use client";

import React, { useState } from "react";
import { addCoordinator } from "../actions/adminActions";

const AddCoordinator: React.FC = () => {
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !branch) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await addCoordinator(email, branch);

      if (result.success) {
        setSuccess(result.message);
        // Reset form
        setEmail("");
        setBranch("");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error adding coordinator:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-white mb-8">
        Add Coordinator
      </h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
      )}

      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white mb-2">
            Enter Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 bg-white rounded"
            placeholder="example@sitpune.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="branch" className="block text-white mb-2">
            Enter Branch Name
          </label>
          <input
            type="text"
            id="branch"
            className="w-full p-3 bg-white rounded"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-medium py-3 px-6 rounded transition duration-300`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Coordinator"}
        </button>
      </form>
    </div>
  );
};

export default AddCoordinator;
