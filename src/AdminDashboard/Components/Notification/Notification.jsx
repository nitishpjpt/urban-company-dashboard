import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import React from "react";
import axios from "axios";
import {
  FiPlus,
  FiX,
  FiBell,
  FiAlertCircle,
  FiGift,
  FiInfo,
  FiClock,
  FiUsers,
  FiUser,
} from "react-icons/fi";

const Notification = () => {
  const { darkMode } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [targetAudience, setTargetAudience] = useState("all");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Fetch users and notifications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users for specific targeting
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user`
        );
        setUsers(usersResponse.data);

        // Fetch notification history
        const notificationsResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/save/token`
        );
        setNotifications(notificationsResponse.data);
        console.log("notifications", notificationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message.");
      return;
    }

    if (targetAudience === "specific" && !selectedUser) {
      toast.error("Please select a user for specific notification.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        body: message,
        type: notificationType,
        userId:
          targetAudience === "specific"
            ? selectedUser
            : targetAudience === "premium"
            ? "premium"
            : "all",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/save/token`,
        payload
      );

      // Add to local state
      const newNotification = {
        ...payload,
        id: response.data.id || Date.now(),
        date: new Date().toISOString(),
        audience: targetAudience,
        read: false,
      };

      setNotifications([newNotification, ...notifications]);
      toast.success("Notification sent successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSelectedUser("");
    setIsModalOpen(false);
  };

  const notificationIcons = {
    info: <FiInfo className="text-blue-500" />,
    alert: <FiAlertCircle className="text-yellow-500" />,
    promotion: <FiGift className="text-purple-500" />,
    update: <FiClock className="text-green-500" />,
    urgent: <FiBell className="text-red-500" />,
  };

  const getTypeName = (type) => {
    const typeNames = {
      info: "Information",
      alert: "Alert",
      promotion: "Promotion",
      update: "Update",
      urgent: "Urgent",
    };
    return typeNames[type] || type;
  };

  const getAudienceName = (audience) => {
    const audienceNames = {
      all: "All Users",
      premium: "Premium Users",
      specific: "Specific User",
    };
    return audienceNames[audience] || audience;
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Manage and send push notifications to users
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
            } transition-colors`}
          >
            <FiPlus />
            <span>Create Notification</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            darkMode={darkMode}
            title="Total Sent"
            value={notifications.length}
            icon={<FiBell />}
            color="indigo"
          />
          <StatCard
            darkMode={darkMode}
            title="Unread"
            value={notifications.filter((n) => !n.read).length}
            icon={<FiAlertCircle />}
            color="yellow"
          />
          <StatCard
            darkMode={darkMode}
            title="Urgent"
            value={notifications.filter((n) => n.type === "urgent").length}
            icon={<FiBell />}
            color="red"
          />
          <StatCard
            darkMode={darkMode}
            title="Promotions"
            value={notifications.filter((n) => n.type === "promotion").length}
            icon={<FiGift />}
            color="purple"
          />
        </div>

        {/* Notifications List */}
        <div
          className={`rounded-lg shadow-sm overflow-hidden border transition-colors duration-300 ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2 className="text-lg font-semibold">Notification History</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:${
                    darkMode ? "bg-gray-700/30" : "bg-gray-50"
                  } transition-colors cursor-pointer ${
                    !notification.read &&
                    (darkMode ? "bg-blue-900/20" : "bg-blue-50")
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      } mr-4`}
                    >
                      {notificationIcons[notification.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {notification.body}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {getAudienceName(notification.audience)}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center text-xs">
                        <span
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <span
                          className={`mx-2 ${
                            darkMode ? "text-gray-600" : "text-gray-300"
                          }`}
                        >
                          •
                        </span>
                        <span
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {getTypeName(notification.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No notifications sent yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Notification Modal */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
            darkMode ? "bg-gray-900/80" : "bg-black/50"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`px-4 py-3 border-b flex justify-between items-center ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3 className="text-lg font-medium">Create New Notification</h3>
                <button
                  onClick={resetForm}
                  className={`p-1 rounded-full ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Notification Type Selection */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Notification Type
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(notificationIcons).map(([type, icon]) => (
                        <button
                          key={type}
                          onClick={() => setNotificationType(type)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                            notificationType === type
                              ? darkMode
                                ? "border-indigo-500 bg-indigo-900/30"
                                : "border-indigo-500 bg-indigo-50"
                              : darkMode
                              ? "border-gray-700 hover:border-gray-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-xl mb-1">{icon}</span>
                          <span className="text-xs capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audience Selection */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Target Audience
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {["all", "premium", "specific"].map((audience) => (
                        <button
                          key={audience}
                          onClick={() => setTargetAudience(audience)}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                            targetAudience === audience
                              ? darkMode
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-600 text-white"
                              : darkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {audience === "all" ? (
                            <span className="flex items-center justify-center">
                              <FiUsers className="mr-1" /> All
                            </span>
                          ) : audience === "premium" ? (
                            <span className="flex items-center justify-center">
                              <FiGift className="mr-1" /> Premium
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <FiUser className="mr-1" /> Specific
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {targetAudience === "specific" && (
                      <div className="mt-2">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Select User
                        </label>
                        <select
                          className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          required
                        >
                          <option value="">Select a user</option>
                          {users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name || user.email}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter notification title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter detailed message"
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Preview Section */}
                  <div
                    className={`p-4 rounded-lg border ${
                      darkMode
                        ? "border-gray-700 bg-gray-700/30"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Preview
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {getAudienceName(targetAudience)}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded border ${
                        darkMode
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-xl mr-3 mt-0.5">
                          {notificationIcons[notificationType]}
                        </span>
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {title || "[Your notification title]"}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {message ||
                              "[Your notification message will appear here]"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`px-4 py-3 flex justify-end space-x-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <button
                  onClick={resetForm}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={
                    loading ||
                    !title.trim() ||
                    !message.trim() ||
                    (targetAudience === "specific" && !selectedUser)
                  }
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    loading ||
                    !title.trim() ||
                    !message.trim() ||
                    (targetAudience === "specific" && !selectedUser)
                      ? "bg-indigo-400 text-white cursor-not-allowed"
                      : darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard component remains the same as in your original code
const StatCard = ({ darkMode, title, value, icon, color }) => {
  const colorClasses = {
    indigo: {
      bg: darkMode ? "bg-indigo-900/30" : "bg-indigo-100",
      text: darkMode ? "text-indigo-300" : "text-indigo-800",
      iconBg: darkMode ? "bg-indigo-800" : "bg-indigo-200",
    },
    yellow: {
      bg: darkMode ? "bg-yellow-900/30" : "bg-yellow-100",
      text: darkMode ? "text-yellow-300" : "text-yellow-800",
      iconBg: darkMode ? "bg-yellow-800" : "bg-yellow-200",
    },
    red: {
      bg: darkMode ? "bg-red-900/30" : "bg-red-100",
      text: darkMode ? "text-red-300" : "text-red-800",
      iconBg: darkMode ? "bg-red-800" : "bg-red-200",
    },
    purple: {
      bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      text: darkMode ? "text-purple-300" : "text-purple-800",
      iconBg: darkMode ? "bg-purple-800" : "bg-purple-200",
    },
  };

  return (
    <div
      className={`rounded-lg p-4 ${colorClasses[color].bg} ${colorClasses[color].text}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${colorClasses[color].iconBg} text-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Notification;
