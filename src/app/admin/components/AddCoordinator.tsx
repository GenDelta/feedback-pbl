import React, { useState } from "react";

const AddCoordinator: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password || !confirmPassword || !branch) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // In a real app, this would call an API to add the coordinator
    console.log("Adding coordinator:", { email, password, branch });

    // Simulate successful addition
    setSuccess("Coordinator added successfully");

    // Reset form
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setBranch("");
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
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-white mb-2">
            Enter Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 bg-white rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-white mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-3 bg-white rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded transition duration-300"
        >
          Add Coordinator
        </button>
      </form>
    </div>
  );
};

export default AddCoordinator;
