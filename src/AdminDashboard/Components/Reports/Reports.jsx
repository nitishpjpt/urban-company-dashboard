import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaTrash, FaCheck, FaExclamationTriangle, FaUserAlt, FaMusic } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const initialReports = [
  {
    id: 1,
    type: "Song",
    title: "Fake Love",
    artist: "BTS",
    reportedBy: "user123",
    reason: "Inappropriate lyrics",
    status: "Pending",
    date: "2023-05-15",
  },
  {
    id: 2,
    type: "User",
    title: "artist_spam01",
    reportedBy: "user456",
    reason: "Spamming uploads",
    status: "Pending",
    date: "2023-05-14",
  },
  {
    id: 3,
    type: "Song",
    title: "Stolen Track",
    artist: "Unknown",
    reportedBy: "user789",
    reason: "Copyright violation",
    status: "Pending",
    date: "2023-05-10",
  },
  {
    id: 4,
    type: "User",
    title: "troll_account",
    reportedBy: "moderator01",
    reason: "Hate speech in comments",
    status: "Resolved",
    date: "2023-05-08",
  },
  {
    id: 5,
    type: "Song",
    title: "Explicit Content",
    artist: "Explicit Artist",
    reportedBy: "user101",
    reason: "Graphic content",
    status: "Rejected",
    date: "2023-05-05",
  },
];

const Reports = () => {
  const { darkMode } = useOutletContext();
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.artist && report.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || report.status === statusFilter;
    const matchesType = typeFilter === "All" || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const updateStatus = (id, newStatus) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const removeReport = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Pending: {
        bg: darkMode ? "bg-yellow-900/30" : "bg-yellow-100",
        text: darkMode ? "text-yellow-200" : "text-yellow-800",
        dot: "bg-yellow-500",
      },
      Resolved: {
        bg: darkMode ? "bg-green-900/30" : "bg-green-100",
        text: darkMode ? "text-green-200" : "text-green-800",
        dot: "bg-green-500",
      },
      Rejected: {
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

  const getTypeIcon = (type) => {
    return type === "Song" 
      ? <FaMusic className={darkMode ? "text-purple-400" : "text-purple-600"} /> 
      : <FaUserAlt className={darkMode ? "text-blue-400" : "text-blue-600"} />;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-7xl mx-auto">
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2
                  className={`text-xl font-semibold flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FaExclamationTriangle className="text-red-500" />
                  Content Moderation Dashboard
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Review and manage reported content and users
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch
                      className={`h-5 w-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`px-6 py-3 border-b transition-colors duration-300 flex flex-wrap gap-3 ${
              darkMode ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <label htmlFor="type-filter" className={`mr-2 text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Type:
              </label>
              <select
                id="type-filter"
                className={`border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Song">Song</option>
                <option value="User">User</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="status-filter" className={`mr-2 text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Status:
              </label>
              <select
                id="status-filter"
                className={`border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className={`ml-auto px-3 py-1 rounded-md text-sm ${
              darkMode ? "bg-blue-900/30 text-blue-200" : "bg-blue-50 text-blue-800"
            }`}>
              Total Reports: {filteredReports.length}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Content
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Reported By
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className={`transition-colors duration-150 ${
                        darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getTypeIcon(report.type)}
                          </div>
                          <div className={`ml-2 text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {report.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          {report.title}
                        </div>
                        {report.artist && (
                          <div className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {report.artist}
                          </div>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        @{report.reportedBy}
                      </td>
                      <td className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } max-w-xs`}>
                        {report.reason}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => updateStatus(report.id, "Resolved")}
                            className={darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-800"}
                            title="Mark Resolved"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(report.id, "Rejected")}
                            className={darkMode ? "text-orange-400 hover:text-orange-300" : "text-orange-600 hover:text-orange-800"}
                            title="Reject Report"
                          >
                            <FaExclamationTriangle size={16} />
                          </button>
                          <button
                            onClick={() => removeReport(report.id)}
                            className={darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"}
                            title="Delete Report"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                        No reports match your criteria.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredReports.length > 0 && (
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
                <span className="font-medium">{filteredReports.length}</span> of{" "}
                <span className="font-medium">{filteredReports.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  Previous
                </button>
                <button
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50`}
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

export default Reports;