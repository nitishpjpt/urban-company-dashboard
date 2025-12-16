import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiUserPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const Users = () => {
  const { darkMode } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user`
        );
        console.log("Fetched users:", users.data);
        setUsers(users.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Active: {
        bg: darkMode ? "bg-green-900/30" : "bg-green-100",
        text: darkMode ? "text-green-200" : "text-green-800",
        dot: "bg-green-500",
      },
      Inactive: {
        bg: darkMode ? "bg-red-900/30" : "bg-red-100",
        text: darkMode ? "text-red-200" : "text-red-800",
        dot: "bg-red-500",
      },
    };

    const config = statusConfig[status] || {
      bg: darkMode ? "bg-gray-700" : "bg-gray-100",
      text: darkMode ? "text-gray-300" : "text-gray-800",
      dot: "bg-gray-500",
    };

    return (
      <div
        className={`inline-flex items-center ${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}
      >
        <span className={`w-2 h-2 mr-2 rounded-full ${config.dot}`}></span>
        {status}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 max-w-full ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`rounded-lg shadow-sm overflow-hidden border transition-colors duration-300 ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b transition-colors duration-300 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Users
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {users.length} active Users
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Joined Date
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    DOB
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {users
                  .filter((user) =>
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-150 ${
                        darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                      }`}
                    >

                       <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar}
                                alt={user.name || user.email}
                              />
                            ) : (
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                                  darkMode
                                    ? "bg-gray-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {user.email?.[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {new Date(user.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {new Date(user.dob).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {user.gender}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {users.length > 0 && (
            <div
              className={`px-6 py-3 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } flex items-center justify-between`}
            >
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{users.length}</span> of{" "}
                <span className="font-medium">{users.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
                  disabled
                >
                  Previous
                </button>
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
