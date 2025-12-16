import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiX,
} from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Subscriptions = () => {
  const { darkMode } = useOutletContext();
  const [plans, setPlans] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState([""]);
  const [interval, setInterval] = useState("monthly");
  const [intervalCount, setIntervalCount] = useState(1);
  const [type, setType] = useState("recurring");
  const [haveTrial, setHaveTrial] = useState(false);
  const [trialDays, setTrialDays] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("plans");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all plans
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/subscriptions/plans`
      );
      if (response.data) {
        setPlans(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch plans");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscribers (dummy data)
  const fetchSubscribers = async () => {
    try {
      // This would be your actual API call in a real app
      const dummyData = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          plan: "Premium",
          status: "active",
          joined: "2023-05-15",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          plan: "Basic",
          status: "active",
          joined: "2023-06-20",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          plan: "Family",
          status: "canceled",
          joined: "2023-04-10",
        },
        {
          id: 4,
          name: "Alice Brown",
          email: "alice@example.com",
          plan: "Premium",
          status: "active",
          joined: "2023-07-05",
        },
      ];
      setSubscribers(dummyData);
    } catch (error) {
      toast.error("Failed to load subscribers");
    }
  };

  useEffect(() => {
    fetchPlans();
    if (activeTab === "subscribers") {
      fetchSubscribers();
    }
  }, [activeTab]);

  // Create new plan
  const handleAddPlan = async () => {
    const filteredFeatures = features.filter((f) => f.trim() !== "");
    if (!name || !price || filteredFeatures.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/subscriptions/plans`,
        {
          name,
          amount: parseFloat(price),
          interval,
          interval_count: intervalCount,
          type,
          have_trial: haveTrial,
          trial_days: trialDays,
          features: filteredFeatures,
        }
      );

      if (response.data) {
        toast.success("Plan created successfully");
        fetchPlans();
        resetForm();
        setShowCreateModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create plan");
    } finally {
      setIsLoading(false);
    }
  };

  // Update plan
  const handleUpdatePlan = async () => {
    const filteredFeatures = features.filter((f) => f.trim() !== "");
    if (!name || !price || filteredFeatures.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/subscriptions/plans/${editingId}`,
        {
          name,
          amount: parseFloat(price),
          interval,
          interval_count: intervalCount,
          type,
          have_trial: haveTrial,
          trial_days: trialDays,
          features: filteredFeatures,
        }
      );

      if (response.data) {
        toast.success("Plan updated successfully");
        fetchPlans();
        resetForm();
        setShowCreateModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update plan");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete plan
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setIsLoading(true);
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/subscriptions/plans/${id}`
        );
        toast.success("Plan deleted successfully");
        fetchPlans();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete plan");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Edit plan - populate form
  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setName(plan.name);
    setPrice(plan.amount);
    setFeatures(plan.features.length > 0 ? plan.features : [""]);
    setInterval(plan.interval);
    setIntervalCount(plan.interval_count);
    setType(plan.type);
    setHaveTrial(plan.have_trial);
    setTrialDays(plan.trial_days);
    setShowCreateModal(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setFeatures([""]);
    setInterval("monthly");
    setIntervalCount(1);
    setType("recurring");
    setHaveTrial(false);
    setTrialDays(0);
  };

  // Cancel edit
  const cancelEdit = () => {
    resetForm();
    setShowCreateModal(false);
  };

  // Add new feature field
  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  // Remove feature field
  const removeFeatureField = (index) => {
    if (features.length > 1) {
      const newFeatures = [...features];
      newFeatures.splice(index, 1);
      setFeatures(newFeatures);
    }
  };

  // Update feature value
  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Filter plans by status
  const activePlans = plans.filter((plan) => plan.status !== "archived");
  const archivedPlans = plans.filter((plan) => plan.status === "archived");

  // Calculate analytics (mock data)
  const totalRevenue = activePlans.reduce(
    (sum, plan) => sum + (plan.amount * 1000 || 0),
    0
  );
  const totalUsers = activePlans.length * 1000; // Mock data

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Subscription Management
                </h2>
              </div>
              <div className="mt-3 sm:mt-0">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("plans")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      activeTab === "plans"
                        ? darkMode
                          ? "bg-gray-700 text-white border-b-2 border-green-500"
                          : "bg-white text-gray-800 border-b-2 border-green-500"
                        : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Plans
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      activeTab === "analytics"
                        ? darkMode
                          ? "bg-gray-700 text-white border-b-2 border-green-500"
                          : "bg-white text-gray-800 border-b-2 border-green-500"
                        : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab("subscribers")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      activeTab === "subscribers"
                        ? darkMode
                          ? "bg-gray-700 text-white border-b-2 border-green-500"
                          : "bg-white text-gray-800 border-b-2 border-green-500"
                        : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Subscribers
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {activeTab === "analytics" && (
            <div
              className={`p-6 border-b transition-colors duration-300 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div
                  className={`p-4 rounded-lg shadow ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Total Subscribers
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        darkMode ? "bg-gray-600" : "bg-green-100"
                      }`}
                    >
                      <FiUsers
                        className={`text-xl ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`mt-4 text-sm ${
                      darkMode ? "text-green-400" : "text-green-600"
                    } flex items-center`}
                  >
                    <FiTrendingUp className="mr-1" />
                    <span>12.5% increase from last month</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Monthly Revenue
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${(totalRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        darkMode ? "bg-gray-600" : "bg-blue-100"
                      }`}
                    >
                      <FiDollarSign
                        className={`text-xl ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`mt-4 text-sm ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    } flex items-center`}
                  >
                    <FiTrendingUp className="mr-1" />
                    <span>8.3% increase from last month</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg shadow ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Conversion Rate
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        24.7%
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${
                        darkMode ? "bg-gray-600" : "bg-purple-100"
                      }`}
                    >
                      <FiTrendingUp
                        className={`text-xl ${
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`mt-4 text-sm ${
                      darkMode ? "text-purple-400" : "text-purple-600"
                    } flex items-center`}
                  >
                    <FiTrendingUp className="mr-1" />
                    <span>3.2% increase from last month</span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg shadow ${
                  darkMode ? "bg-gray-700" : "bg-white"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Plan Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead
                      className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}
                    >
                      <tr>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Plan
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Subscribers
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Revenue
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Growth
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      {activePlans.map((plan) => (
                        <tr
                          key={plan._id}
                          className={
                            darkMode
                              ? "hover:bg-gray-700/30"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="ml-0">
                                <div className="text-sm font-medium">
                                  {plan.name}
                                </div>
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  ${plan.amount.toFixed(2)}/{plan.interval}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              darkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            <div className="text-sm">
                              {(Math.random() * 10000).toLocaleString(
                                undefined,
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              darkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            <div className="text-sm">
                              $
                              {(
                                (plan.amount * Math.random() * 1000) /
                                1000
                              ).toFixed(1)}
                              K
                            </div>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap ${
                              darkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            <div
                              className={`text-sm flex items-center ${
                                plan.growth > 0
                                  ? darkMode
                                    ? "text-green-400"
                                    : "text-green-600"
                                  : darkMode
                                  ? "text-red-400"
                                  : "text-red-600"
                              }`}
                            >
                              <FiTrendingUp className="mr-1" />
                              {(Math.random() * 15).toFixed(1)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === "subscribers" && (
            <div className="p-6">
              <div
                className={`rounded-xl shadow-sm overflow-hidden border ${
                  darkMode
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="px-6 py-4 flex justify-between items-center border-b dark:border-gray-700">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search subscribers..."
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <label
                        htmlFor="filter"
                        className={`mr-2 text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Filter:
                      </label>
                      <select
                        id="filter"
                        className={`rounded-md border py-1 pl-2 pr-8 text-sm ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      >
                        <option>All</option>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Plan
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className={
                          darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                        }
                      >
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                              <span
                                className={`font-medium ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {subscriber.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {subscriber.name}
                              </div>
                              <div
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                User ID: {subscriber.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {subscriber.email}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {subscriber.plan}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              subscriber.status === "active"
                                ? darkMode
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-green-100 text-green-800"
                                : darkMode
                                ? "bg-red-900/30 text-red-400"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subscriber.status === "active" ? (
                              <svg
                                className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                            ) : (
                              <svg
                                className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                            )}
                            {subscriber.status.charAt(0).toUpperCase() +
                              subscriber.status.slice(1)}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <div className="text-sm">{subscriber.joined}</div>
                          <div
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {subscriber.days} days ago
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  className={`px-6 py-4 border-t flex items-center justify-between ${
                    darkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">10</span> of{" "}
                    <span className="font-medium">24</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-md border ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      } disabled:opacity-50`}
                      disabled
                    >
                      Previous
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md border ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Management */}
          {activeTab === "plans" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Subscription Plans
                </h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    darkMode ? "ring-offset-gray-800" : ""
                  }`}
                >
                  <FiPlus className="mr-2" />
                  Create Plan
                </button>
              </div>

              {/* Active Plans */}
              <div className="mb-8">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Active Plans
                </h3>
                {isLoading && activePlans.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : activePlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePlans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`rounded-xl shadow hover:shadow-md transition-shadow duration-300 ${
                          darkMode ? "bg-gray-700" : "bg-white"
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className={`text-xl font-bold ${
                                darkMode ? "text-green-400" : "text-green-600"
                              }`}
                            >
                              {plan.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                darkMode
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {plan.type}
                            </span>
                          </div>
                          <p
                            className={`text-2xl font-bold mb-4 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₹{plan.amount.toFixed(2)}{" "}
                            <span
                              className={`text-sm font-normal ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              / {plan.interval}
                            </span>
                          </p>
                          {plan.have_trial && (
                            <p
                              className={`text-sm mb-2 ${
                                darkMode ? "text-blue-300" : "text-blue-600"
                              }`}
                            >
                              {plan.trial_days}-day free trial
                            </p>
                          )}
                          <ul
                            className={`text-sm mb-6 space-y-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start">
                                <span
                                  className={`inline-block mr-2 mt-0.5 ${
                                    darkMode
                                      ? "text-green-400"
                                      : "text-green-600"
                                  }`}
                                >
                                  ✓
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => handleEdit(plan)}
                              className={`flex items-center text-sm ${
                                darkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                            >
                              <FiEdit2 className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className={`flex items-center text-sm ${
                                darkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                            >
                              <FiTrash2 className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`p-8 text-center rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No active plans found.
                    </p>
                  </div>
                )}
              </div>

              {/* Archived Plans */}
              {archivedPlans.length > 0 && (
                <div>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Archived Plans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedPlans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`rounded-xl shadow hover:shadow-md transition-shadow duration-300 ${
                          darkMode ? "bg-gray-700" : "bg-white"
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className={`text-xl font-bold ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {plan.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                darkMode
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              Archived
                            </span>
                          </div>
                          <p
                            className={`text-2xl font-bold mb-4 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ₹{plan.amount.toFixed(2)}{" "}
                            <span
                              className={`text-sm font-normal ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              / {plan.interval}
                            </span>
                          </p>
                          <ul
                            className={`text-sm mb-6 space-y-2 ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-start">
                                <span
                                  className={`inline-block mr-2 mt-0.5 ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                >
                                  ✓
                                </span>
                                {f}
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => handleEdit(plan)}
                              className={`flex items-center text-sm ${
                                darkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                            >
                              <FiEdit2 className="mr-1" /> Restore
                            </button>
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className={`flex items-center text-sm ${
                                darkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                            >
                              <FiTrash2 className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div
          className={`fixed inset-0 bg-black/60 z-50 overflow-y-auto transition-opacity duration-300 ${
            darkMode ? "bg-gray-900/80" : "bg-gray-500/80"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3
                    className={`text-lg leading-6 font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {editingId ? "Edit Plan" : "Create New Plan"}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className={`p-1 rounded-full ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Plan Name*
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Duo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Price (INR)*
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 599"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Features*
                    </label>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            placeholder={`Feature ${index + 1}`}
                            value={feature}
                            onChange={(e) =>
                              updateFeature(index, e.target.value)
                            }
                            className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                              darkMode
                                ? "bg-gray-600 border-gray-500 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                          {features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeatureField(index)}
                              className={`ml-2 p-2 rounded-full ${
                                darkMode
                                  ? "text-red-400 hover:bg-gray-700"
                                  : "text-red-600 hover:bg-gray-100"
                              }`}
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeatureField}
                        className={`flex items-center text-sm ${
                          darkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                      >
                        <FiPlus className="mr-1" /> Add Feature
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Billing Interval
                      </label>
                      <select
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Interval Count
                      </label>
                      <input
                        type="number"
                        value={intervalCount}
                        onChange={(e) =>
                          setIntervalCount(parseInt(e.target.value))
                        }
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Plan Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="individual">Individual</option>
                        <option value="duo">Duo</option>
                        <option value="family">Family</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="haveTrial"
                        checked={haveTrial}
                        onChange={(e) => setHaveTrial(e.target.checked)}
                        className={`mr-2 rounded ${
                          darkMode
                            ? "bg-gray-600 border-gray-500"
                            : "border-gray-300"
                        }`}
                      />
                      <label
                        htmlFor="haveTrial"
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Include Free Trial
                      </label>
                    </div>
                  </div>

                  {haveTrial && (
                    <div className="mb-4">
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Trial Days
                      </label>
                      <input
                        type="number"
                        value={trialDays}
                        onChange={(e) => setTrialDays(parseInt(e.target.value))}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          darkMode
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                {editingId ? (
                  <>
                    <button
                      onClick={handleUpdatePlan}
                      disabled={isLoading}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Updating..." : "Update Plan"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isLoading}
                      className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                        darkMode
                          ? "border-gray-600 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          : "border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddPlan}
                    disabled={isLoading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Creating..." : "Create Plan"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
