import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUsers,
  FiMusic,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiHeart,
  FiDownload,
  FiGlobe,
  FiBarChart2,
  FiDisc,
  FiStar,
  FiActivity,
  FiGift,
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
} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { darkMode } = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [playlist, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [tips, setTips] = useState([]);
  const [totalTips,setTotalTips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          genresRes,
          playlistsRes,
          albumsRes,
          artistsRes,
          usersRes,
          trackRes,
          growthRes,
          tipsRes,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/genres`),
          axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/playlists/all`
          ),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/albums`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/artist`),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user`),
          axios.get(
            "https://api.jamendo.com/v3.0/tracks/?client_id=3e2494c0&format=json&limit=10"
          ),
          axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/growth`
          ),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/tips`),
        ]);

        setGenres(genresRes.data.length);
        setPlaylists(playlistsRes.data.length);
        setAlbums(albumsRes.data.albums.length);
        setArtists(artistsRes.data.length);
        setUsers(usersRes.data.length);
        setTracks(trackRes.data.results.length);
        setUserGrowthData(growthRes.data);
        setTips(tipsRes.data.tips);
        setTotalTips(tipsRes.data.tips.length)

        console.log("tips", tipsRes.data.tips);
        console.log("Generes", genresRes.data.length);
        console.log("playist", playlistsRes.data.length);
        console.log("albums", albumsRes.data.albums.length);
        console.log("artists", artistsRes.data.length);
        console.log("user growth", growthRes.data);
        console.log("users", usersRes.data.length);
        console.log("tracks", trackRes.data.results.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const revenueData = [
    { month: "Jan", revenue: 2000000 },
    { month: "Feb", revenue: 2500000 },
    { month: "Mar", revenue: 3000000 },
    { month: "Apr", revenue: 3500000 },
    { month: "May", revenue: 4000000 },
    { month: "Jun", revenue: 5000000 },
  ];


  const topArtists = [
    { name: "The Weeknd", streams: 45000000 },
    { name: "Drake", streams: 42000000 },
    { name: "Taylor Swift", streams: 38000000 },
    { name: "Dua Lipa", streams: 35000000 },
    { name: "Ed Sheeran", streams: 32000000 },
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

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/genres`
        );

        // Optional: transform data for chart
        const data = res.data.map((genre, index) => ({
          name: genre.name,
          value: genre.totalSongs || 1, // fallback if no count available
          color: COLORS[index % COLORS.length],
        }));

        setGenreDistribution(data);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <FiActivity
              className={`w-6 h-6 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
            />
            <h1 className="text-2xl font-bold">TuneNest Admin Dashboard</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={users}
            change="+12% from last month"
            icon={<FiUsers className="text-green-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Free User"
            value="82M"
            change="+8% from last quarter"
            icon={<FiStar className="text-indigo-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Premuim User"
            value="$5.2B"
            change="+15% YoY growth"
            icon={<FiDollarSign className="text-blue-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Total Tracks"
            value={tracks}
            change="+12% from last month"
            icon={<FiUsers className="text-green-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Total Albums"
            value={albums}
            change="+5% from last month"
            icon={<FiClock className="text-purple-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Total Generes"
            value={genres}
            change="+8% from last quarter"
            icon={<FiStar className="text-indigo-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
          <StatCard
            title="Total Tips"
            value={totalTips}
            change="+2% from last quarter"
            icon={<FiStar className="text-indigo-500" size={24} />}
            darkMode={darkMode}
            trend="up"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5" /> User Growth
              </h2>
              <select
                className={`text-sm px-2 py-1 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                disabled
              >
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
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
                    formatter={(value) => [formatNumber(value), "Users"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#1DB954"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiDollarSign className="w-5 h-5" /> Revenue
              </h2>
              <select
                className={`text-sm px-2 py-1 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>Last 3 years</option>
              </select>
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
                    formatter={(value) => [
                      "$" + formatNumber(value),
                      "Revenue",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#1DB954"
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Genre Distribution */}
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FiMusic className="w-5 h-5" /> Genre Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {genreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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

          {/* Top Artists */}
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FiStar className="w-5 h-5" /> Top Artists
            </h2>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{index + 1}.</span>
                    <div>
                      <p className="font-medium">{artist.name}</p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatNumber(artist.streams)} streams
                      </p>
                    </div>
                  </div>
                  <button
                    className={`p-1 rounded-full ${
                      darkMode
                        ? "text-gray-400 hover:bg-gray-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <FiBarChart2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FiDisc className="w-5 h-5" /> Quick Stats
            </h2>
            <div className="space-y-4">
              <StatItem
                icon={<FiHeart className="text-pink-500" />}
                title="Liked Songs"
                value="12.4M daily"
                change="+3.2%"
                darkMode={darkMode}
              />
              <StatItem
                icon={<FiDownload className="text-blue-500" />}
                title="Downloads"
                value="8.7M weekly"
                change="+1.5%"
                darkMode={darkMode}
              />
              <StatItem
                icon={<FiGlobe className="text-green-500" />}
                title="Global Reach"
                value="184 countries"
                change="+2 new"
                darkMode={darkMode}
              />
              <StatItem
                icon={<FiUsers className="text-purple-500" />}
                title="New Users"
                value="1.2M monthly"
                change="+8.4%"
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`p-6 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm mb-8`}
        >
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FiGift className="w-5 h-5" /> Recent Tips
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`text-left py-3 px-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    User
                  </th>
                  <th
                    className={`text-left py-3 px-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Artist
                  </th>
                  <th
                    className={`text-left py-3 px-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Amount
                  </th>
                  <th
                    className={`text-left py-3 px-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {tips.map((tip) => (
                  <tr
                    key={tip._id}
                    className={`border-b ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {tip.user.image && (
                          <img
                            src={tip.user.image}
                            alt={tip.user.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium">{tip.user.name}</p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {tip.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {tip.artist.image && (
                          <img
                            src={tip.artist.image}
                            alt={tip.artist.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <p>{tip.artist.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-green-500">
                      ₹{tip.amount}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(tip.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, darkMode, trend }) => {
  return (
    <div
      className={`p-6 rounded-xl transition-all duration-300 hover:shadow-md ${
        darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
      } shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, title, value, change, darkMode }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
      <span
        className={`text-sm ${
          change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </span>
    </div>
  );
};

export default Dashboard;
