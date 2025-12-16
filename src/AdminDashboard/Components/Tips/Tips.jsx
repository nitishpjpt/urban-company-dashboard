import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const Tips = () => {
  const { darkMode } = useOutletContext(); // context from layout
  const [tipsData, setTipsData] = useState({ success: false, tips: [] });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/tips`
        );
        setTipsData(res.data);
      } catch (error) {
        toast.error("Failed to fetch tips");
        console.error(error);
      }
    };

    fetchTips();
  }, []);

  const filteredTips = useMemo(() => {
    if (!tipsData.success) return [];
    
    return tipsData.tips.filter(tip => {
      const searchLower = searchTerm.toLowerCase();
      return (
        tip.user.name.toLowerCase().includes(searchLower) ||
        tip.artist.name.toLowerCase().includes(searchLower) ||
        tip.amount.toString().includes(searchTerm)
      );
    });
  }, [tipsData, searchTerm]);

  const PaymentBadge = ({ paymentId }) => {
    // Determine payment method based on razorpay_payment_id prefix
    let method = "Other";
    if (paymentId) {
      if (paymentId.startsWith("pay_")) method = "Razorpay";
      else if (paymentId.startsWith("upi_")) method = "UPI";
    }

    const colors = {
      UPI: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      Razorpay: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
      Other: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    const badgeStyle = colors[method] || colors.Other;

    return (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${badgeStyle}`}
      >
        {method}
      </span>
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
          className={`rounded-lg shadow overflow-hidden border ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
          >
            <div>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Tips Received from Users
              </h2>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {searchTerm ? (
                  <>
                    Showing {filteredTips.length} of {tipsData.tips.length} tips
                  </>
                ) : (
                  <>Total tips: {tipsData.tips.length}</>
                )}
              </p>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Search tips..."
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {!tipsData.success || filteredTips.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      {searchTerm ? "No matching tips found" : "No tips available"}
                    </td>
                  </tr>
                ) : (
                  filteredTips.map((tip) => (
                    <tr
                      key={tip._id}
                      className={`transition-colors duration-150 ${
                        darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          {tip.user.image && (
                            <img
                              src={tip.user.image}
                              alt={tip.user.name}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium capitalize">{tip.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {tip.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400">
                        ₹{tip.amount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          {tip.artist.image && (
                            <img
                              src={tip.artist.image}
                              alt={tip.artist.name}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                          )}
                          <span>{tip.artist.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(tip.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <PaymentBadge paymentId={tip.razorpay_payment_id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {tipsData.success && filteredTips.length > 0 && (
            <div
              className={`px-6 py-3 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Showing {filteredTips.length} {filteredTips.length === 1 ? "tip" : "tips"}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tips;