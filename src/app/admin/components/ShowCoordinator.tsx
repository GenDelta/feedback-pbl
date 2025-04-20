import React, { useState, useEffect } from "react";

interface Coordinator {
  id: number;
  email: string;
  branch: string;
}

const ShowCoordinator: React.FC = () => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([
    // Sample data (do an API call in production)
    { id: 1, email: "cscoordinator@sitpune.edu.in", branch: "cs" },
    { id: 2, email: "mechcoordinator@sitpune.edu.in", branch: "mech" },
    { id: 3, email: "fycoordinator@sitpune.edu.in", branch: "fy" },
    { id: 4, email: "civilcoordinator@sitpune.edu.in", branch: "civil" },
    { id: 5, email: "aimlcoordinator@sitpune.edu.in", branch: "aiml" },
    { id: 6, email: "racoordinator@sitpune.edu.in", branch: "ra" },
    { id: 7, email: "entccoordinator@sitpune.edu.in", branch: "entc" },
    { id: 8, email: "itcoordinator@sitpune.edu.in", branch: "it" },
  ]);

  const handleDelete = (id: number) => {
    //call an API to delete the coordinator
    setCoordinators(
      coordinators.filter((coordinator) => coordinator.id !== id)
    );
  };

  // fetch coordinators from an API
  useEffect(() => {
    // fetchCoordinators() would be an API call
    // setCoordinators(await fetchCoordinators());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">
        Active Coordinator List
      </h1>

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
                <td className="py-4 px-6">{coordinator.branch}</td>
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
    </div>
  );
};

export default ShowCoordinator;
