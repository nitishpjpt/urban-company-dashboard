import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUsers,
  FiDollarSign,
  FiMusic,
  FiTrendingUp,
  FiClock,
  FiStar,
  FiGlobe,
  FiDownload,
  FiHeart,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const Analytics = () => {
  const { darkMode = false } = useOutletContext();
  const [timeRange, setTimeRange] = useState("6m");
  const [activeTab, setActiveTab] = useState("overview");

  // Data for charts
  const userGrowth = [
    { month: "Jan", users: 1200, premium: 800, free: 400 },
    { month: "Feb", users: 2100, premium: 1300, free: 800 },
    { month: "Mar", users: 3200, premium: 2000, free: 1200 },
    { month: "Apr", users: 4300, premium: 2800, free: 1500 },
    { month: "May", users: 5100, premium: 3500, free: 1600 },
    { month: "Jun", users: 6300, premium: 4200, free: 2100 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 2000, subscriptions: 1800, ads: 200 },
    { month: "Feb", revenue: 3500, subscriptions: 3100, ads: 400 },
    { month: "Mar", revenue: 4000, subscriptions: 3500, ads: 500 },
    { month: "Apr", revenue: 4800, subscriptions: 4200, ads: 600 },
    { month: "May", revenue: 5200, subscriptions: 4500, ads: 700 },
    { month: "Jun", revenue: 5900, subscriptions: 5100, ads: 800 },
  ];

  const songPlays = [
    { name: "Pop", plays: 4000, fill: "#1DB954" },
    { name: "Hip-Hop", plays: 3000, fill: "#191414" },
    { name: "Lo-fi", plays: 2000, fill: "#B3B3B3" },
    { name: "Rock", plays: 1500, fill: "#535353" },
    { name: "Electronic", plays: 1200, fill: "#4B917D" },
  ];

  const topSongs = [
    { title: "Blinding Lights", artist: "The Weeknd", plays: 4200000 },
    { title: "Save Your Tears", artist: "The Weeknd", plays: 3800000 },
    { title: "Stay", artist: "The Kid LAROI, Justin Bieber", plays: 3500000 },
    { title: "good 4 u", artist: "Olivia Rodrigo", plays: 3200000 },
    { title: "Levitating", artist: "Dua Lipa", plays: 3000000 },
  ];

  const userDemographics = [
    { country: "USA", users: 45, fill: "#1DB954" },
    { country: "UK", users: 15, fill: "#191414" },
    { country: "Germany", users: 10, fill: "#B3B3B3" },
    { country: "France", users: 8, fill: "#535353" },
    { country: "Other", users: 22, fill: "#4B917D" },
  ];

  const listeningHabits = [
    { hour: "12AM", plays: 800 },
    { hour: "3AM", plays: 400 },
    { hour: "6AM", plays: 1200 },
    { hour: "9AM", plays: 2500 },
    { hour: "12PM", plays: 3800 },
    { hour: "3PM", plays: 4200 },
    { hour: "6PM", plays: 5000 },
    { hour: "9PM", plays: 6500 },
  ];

  const platformStats = [
    { name: "Total Users", value: "6.3M", icon: <FiUsers />, change: "+12%" },
    { name: "Premium Users", value: "4.2M", icon: <FiStar />, change: "+18%" },
    { name: "Monthly Revenue", value: "$5.9M", icon: <FiDollarSign />, change: "+15%" },
    { name: "Avg. Session", value: "32 min", icon: <FiClock />, change: "+5%" },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <FiTrendingUp
              className={`w-6 h-6 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
            <h2 className="text-2xl font-bold">Analytics Data</h2>
          </div>
          <div className="flex gap-2">
            <select
              className={`px-3 py-1 rounded-lg border focus:ring-2 focus:ring-green-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="12m">Last 12 months</option>
            </select>
            <div className="flex rounded-lg overflow-hidden border">
              <button
                className={`px-3 py-1 text-sm ${
                  activeTab === "overview"
                    ? darkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-600 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  activeTab === "users"
                    ? darkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-600 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  activeTab === "content"
                    ? darkMode
                      ? "bg-green-600 text-white"
                      : "bg-green-600 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("content")}
              >
                Content
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {platformStats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-colors duration-300 ${
                darkMode
                  ? "border-gray-700 bg-gray-800 hover:bg-gray-700/50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {React.cloneElement(stat.icon, {
                    className: `w-5 h-5 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`,
                  })}
                </div>
              </div>
              <p
                className={`text-sm mt-2 ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change} from last period
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Growth Chart */}
              <div
                className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiUsers className="w-5 h-5" /> User Growth
                  </h3>
                  <div
                    className={`text-sm px-2 py-1 rounded ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {timeRange === "6m" ? "Last 6 months" : "Last 12 months"}
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowth}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="month"
                        stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                      />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <Tooltip
                        contentStyle={
                          darkMode
                            ? {
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#F3F4F6",
                              }
                            : {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                              }
                        }
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="users"
                        name="Total Users"
                        stroke="#1DB954"
                        fill="#1DB954"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="premium"
                        name="Premium Users"
                        stroke="#191414"
                        fill="#191414"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="free"
                        name="Free Users"
                        stroke="#B3B3B3"
                        fill="#B3B3B3"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Chart */}
              <div
                className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5" /> Revenue Breakdown
                  </h3>
                  <div
                    className={`text-sm px-2 py-1 rounded ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {timeRange === "6m" ? "Last 6 months" : "Last 12 months"}
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? "#4B5563" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="month"
                        stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                      />
                      <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                      <Tooltip
                        contentStyle={
                          darkMode
                            ? {
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#F3F4F6",
                              }
                            : {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                              }
                        }
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        name="Total Revenue"
                        fill="#1DB954"
                        barSize={30}
                      />
                      <Bar
                        dataKey="subscriptions"
                        name="Subscriptions"
                        fill="#191414"
                        barSize={30}
                      />
                      <Bar
                        dataKey="ads"
                        name="Advertising"
                        fill="#B3B3B3"
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Genre Distribution */}
              <div
                className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FiMusic className="w-5 h-5" /> Genre Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={songPlays}
                        dataKey="plays"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {songPlays.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [formatNumber(value), "Plays"]}
                        contentStyle={
                          darkMode
                            ? {
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#F3F4F6",
                              }
                            : {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                              }
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Demographics */}
              <div
                className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FiGlobe className="w-5 h-5" /> User Demographics
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDemographics}
                        dataKey="users"
                        nameKey="country"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {userDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value + "%", "Market Share"]}
                        contentStyle={
                          darkMode
                            ? {
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#F3F4F6",
                              }
                            : {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                              }
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Listening Habits */}
              <div
                className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FiClock className="w-5 h-5" /> Listening Habits
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={listeningHabits}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="hour" />
                      <PolarRadiusAxis />
                      <Radar
                        dataKey="plays"
                        stroke="#1DB954"
                        fill="#1DB954"
                        fillOpacity={0.4}
                      />
                      <Tooltip
                        formatter={(value) => [formatNumber(value), "Plays"]}
                        contentStyle={
                          darkMode
                            ? {
                                backgroundColor: "#1F2937",
                                borderColor: "#374151",
                                color: "#F3F4F6",
                              }
                            : {
                                backgroundColor: "#FFFFFF",
                                borderColor: "#E5E7EB",
                                color: "#111827",
                              }
                        }
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Songs Table */}
            <div
              className={`p-4 rounded-lg border transition-colors duration-300 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FiStar className="w-5 h-5" /> Top Songs
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <th
                        className={`text-left py-2 px-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        #
                      </th>
                      <th
                        className={`text-left py-2 px-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Title
                      </th>
                      <th
                        className={`text-left py-2 px-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Artist
                      </th>
                      <th
                        className={`text-right py-2 px-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Plays
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSongs.map((song, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-700/50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{song.title}</td>
                        <td className="py-3 px-4">{song.artist}</td>
                        <td className="py-3 px-4 text-right">
                          {formatNumber(song.plays)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div
            className={`p-4 rounded-lg border transition-colors duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Detailed user analytics coming soon...
            </p>
          </div>
        )}

        {activeTab === "content" && (
          <div
            className={`p-4 rounded-lg border transition-colors duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Content Analytics</h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Detailed content analytics coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;