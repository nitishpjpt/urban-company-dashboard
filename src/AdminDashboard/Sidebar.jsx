import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  AppWindow,
  Wallet,
  Receipt,
  Building2,
  UserCircle2,
  Folder,
  ListTodo,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  LogOut,
  Mic2,
  BellRing,
  BadgeIndianRupee,
  Video
} from "lucide-react";
import {
  Music,
  ListMusic,
  BarChart2,
  Settings,
  Database,
  Radio,
  FileText,
  DollarSign,
  // FileVideoCamera,
} from "lucide-react";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: <Users size={18} />,
    path: "/users",
  },






  {
    title: "Tips",
    icon: <BadgeIndianRupee size={18} />,
    path: "/tips",
  },
  {
    title: "Send Notifications",
    icon: <BellRing size={18} />,
    path: "/send-notifications",
  },
  {
    title: "Subscriptions",
    icon: <DollarSign size={18} />,
    path: "/subscriptions",
  },
  {
    title: "Analytics",
    icon: <BarChart2 size={18} />,
    path: "/analytics",
  },
  {
    title: "Reports",
    icon: <FileText size={18} />,
    path: "/reports",
  },

  {
    title: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
  },
];

export default function Sidebar({ darkMode }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [platformLogo, setPlatformLogo] = useState("");
  const [platformName, setPlatformName] = useState("");

  const navigate = useNavigate();

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/admin/setting/details`,
          { withCredentials: true }
        );
        const settings = response.data[0];
        console.log("settings", settings);

        if (settings) {
          setPlatformName(settings.apkName || "");
          setPlatformLogo(settings.logo || "logo");

          console.log("platformName", settings);
        }
      } catch (error) {
        toast.error("Failed to load settings");
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <aside
      className={`h-screen overflow-y-auto shadow-sm z-20 flex flex-col ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
        }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 md:px-8 h-20 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
          }`}
      >
        <NavLink to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white">
            <img
              src={platformLogo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1
            className={`text-lg sm:text-xl md:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"
              }`}
          >
            {platformName}
          </h1>
        </NavLink>
      </div>

      {/* Menu Section */}
      <div className="p-4 flex-1">
        <p
          className={`text-xs uppercase font-semibold mb-3 tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Main Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div className="relative">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-500"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={`mr-3 ${isActive
                              ? "text-indigo-600"
                              : darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      {item.submenu && (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpand(index);
                          }}
                          className={
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          {expandedItems[index] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </div>

              {item.submenu && expandedItems[index] && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block py-1.5 px-3 text-sm rounded transition-all ${isActive
                          ? "text-indigo-600 font-medium"
                          : darkMode
                            ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                        }`
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
