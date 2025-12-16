import { useState, useRef, useEffect } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowLeft,
  Grid,
  Settings,
  Maximize2,
  MessageSquare,
  Mail,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import Sidebar from "../SideBar";
import React from "react";
import { FiSearch } from "react-icons/fi";
import {
  IoIosGrid,
  IoMdGlobe,
  IoMdMail,
  IoMdNotifications,
} from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardLayout() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const searchRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/admin/protected-dashboard`,
          { withCredentials: true }
        );

        if (res.data?.admin?.role === "admin") {
          setIsAuthorized(true);
          console.log(res.data.admin.name);
          setMessage(res.data.message);
          setEmail(res.data.admin.email);
          setName(res.data.admin.name);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/logout`,
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-1 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-md shadow-sm transition-colors ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 shadow-md h-full overflow-y-auto transition-transform duration-300 ease-in-out 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <Sidebar darkMode={darkMode} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header
          className={`sticky top-0 z-10 w-full h-20 flex items-center justify-between px-10 ${
            darkMode
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-800 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2 ">
            {/* Left - Greeting */}
            <div
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <span className="capitalize text-[#1DB954]  font-bold">
                {name}
              </span>{" "}
              👋 {message}
            </div>

            {/* Center - Search */}
            <div className="flex-1 mx-6 max-w-md">
              <div
                className={`relative ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search Here . . ."
                  className={`w-full px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
                    darkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-100 text-gray-800 placeholder-gray-500"
                  }`}
                />
                <FiSearch className="absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Right Section */}
          </div>
          <div className="flex items-center gap-4">
            {/* Icons */}
            {/* <button
              className={`p-2 rounded-full ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IoIosGrid size={20} />
            </button> */}

            {/* <button
              className={`p-2 rounded-full relative ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IoMdMail size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                0
              </span>
            </button> */}

            <button
              className={`p-2 rounded-full ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IoMdNotifications size={20} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile + Dropdown */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="text-sm">
                  <p
                    className={`font-semibold capitalize ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {name}
                  </p>
                  <p className="text-xs text-gray-400">{email}</p>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 top-12 w-56 rounded-md shadow-lg ring-1 z-20 origin-top-right ${
                    darkMode
                      ? "bg-gray-800 ring-gray-700"
                      : "bg-white ring-black ring-opacity-5"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Settings
                    </Link>
                  </div>
                  <div
                    className={`py-1 border-t ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Page Content */}

        <main
          className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
          }`}
        >
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
}
