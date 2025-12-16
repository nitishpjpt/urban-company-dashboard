import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  FaTrashAlt,
  FaPlus,
  FaCloudUploadAlt,
  FaPalette,
  FaFont,
  FaImage,
  FaEdit,
  FaTimes,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Settings = () => {
  const { darkMode, setDarkMode } = useOutletContext();
  const [platformName, setPlatformName] = useState("");
  const [originalPlatformName, setOriginalPlatformName] = useState("");
  const [branding, setBranding] = useState({ logo: "" });
  const [originalBranding, setOriginalBranding] = useState({ logo: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Password reset states
  const [showPasswordTab, setShowPasswordTab] = useState(false);
  const [passwordFlow, setPasswordFlow] = useState("forgot"); // 'forgot', 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/setting/details`,
          { withCredentials: true }
        );
        const settings = response.data[0];

        if (settings) {
          setPlatformName(settings.apkName || "");
          setOriginalPlatformName(settings.apkName || "");
          if (settings.logo) {
            setBranding({ logo: settings.logo });
            setOriginalBranding({ logo: settings.logo });
          }
        }
      } catch (error) {
        toast.error("Failed to load settings");
        console.error("Error fetching settings:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchSettings();
  }, []);

   useEffect(() => {
    if (token) {
      setShowPasswordTab(true);
      setPasswordFlow("reset");
      setResetToken(token);
      
      // Automatically verify the token
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/verify-reset-token/${token}`
          );
          
          if (response.data.valid) {
            setIsTokenVerified(true);
            toast.success("Token verified. You can now reset your password.");
          } else {
            toast.error("Invalid or expired token");
            navigate("/settings", { replace: true }); // Clean up URL if token is invalid
          }
        } catch (error) {
          console.error("Verify token error:", error);
          toast.error("Failed to verify token");
          navigate("/settings", { replace: true });
        }
      };
      
      verifyToken();
    }
  }, [token, navigate]);
  // File upload handler
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Image removal handler
  const handleRemoveImage = (type) => {
    setBranding((prev) => ({ ...prev, [type]: "" }));
  };

  // Save settings handler
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("apkName", platformName);

      if (branding.logo && branding.logo.startsWith("data:image")) {
        const blob = await fetch(branding.logo).then((r) => r.blob());
        const file = new File([blob], "logo.png", { type: blob.type });
        formData.append("logo", file);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/update-settings`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.admin) {
        setBranding({ logo: response.data.admin.logo || "" });
        setOriginalBranding({ logo: response.data.admin.logo || "" });
        setPlatformName(response.data.admin.apkName || "");
        setOriginalPlatformName(response.data.admin.apkName || "");
      }

      toast.success("Settings saved successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      setPlatformName(originalPlatformName);
      setBranding(originalBranding);
    }
    setEditMode(!editMode);
  };

  // Forgot Password Handler - Updated version
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsForgotPasswordLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/forgot-password`,
        { email }
      );

      if (response.data.success) {
        toast.success("Password reset link sent to your email. Please check your inbox.");
        setShowPasswordTab(false); // Close the password tab
        setPasswordFlow("forgot"); // Reset the flow
        setEmail(""); // Clear the email
      } else {
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  // Reset Password Handler - Uncommented and updated
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsResetPasswordLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/reset-password/${resetToken}`,
        { password }
      );

      if (response.data.success) {
        toast.success("Password updated successfully");
        // Reset all states
        setShowPasswordTab(false);
        setPasswordFlow("forgot");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setResetToken("");
        setIsTokenVerified(false);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  // Go back to forgot password screen
  const handleBackToForgotPassword = () => {
    setPasswordFlow("forgot");
    setResetToken("");
    setIsTokenVerified(false);
  };

  if (initialLoad) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-4 md:p-6`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`rounded-xl shadow-sm overflow-hidden border transition-colors duration-300 ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b transition-colors duration-300 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex justify-between items-center`}
          >
            <div>
              <h2
                className={`text-2xl font-bold flex items-center gap-3 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <span className="bg-green-500/20 p-2 rounded-lg">⚙️</span>
                Platform Settings
              </h2>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Customize your platform appearance and behavior
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordTab(!showPasswordTab);
                  if (!showPasswordTab) {
                    setPasswordFlow("forgot");
                    setEmail("");
                    setResetToken("");
                    setIsTokenVerified(false);
                  }
                }}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showPasswordTab
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <FaLock className="mr-2" />
                {showPasswordTab ? "Cancel" : "Change Password"}
              </button>
              <button
                onClick={toggleEditMode}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  editMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {editMode ? (
                  <>
                    <FaTimes className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="mr-2" /> Edit Settings
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password Reset Section */}
          {showPasswordTab && (
            <div
              className={`p-6 border-b transition-colors duration-300 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 flex items-center ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <FaLock className="mr-3 text-green-500" />
                Password Management
              </h3>

              {passwordFlow === "forgot" ? (
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 placeholder-gray-500"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleForgotPassword}
                    disabled={isForgotPasswordLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      isForgotPasswordLoading
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    } ${darkMode ? "ring-offset-gray-800" : ""}`}
                  >
                    {isForgotPasswordLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleBackToForgotPassword}
                    className={`flex items-center mb-4 text-sm font-medium ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to forgot password
                  </button>

                  <div className="mb-4">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Reset Token
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaLock />
                      </div>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        disabled={isTokenVerified}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 placeholder-gray-500"
                        } ${isTokenVerified ? "opacity-70" : ""}`}
                        placeholder="Enter reset token from email"
                      />
                      {isTokenVerified && (
                        <div
                          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          <FaCheckCircle />
                        </div>
                      )}
                    </div>
                    {!isTokenVerified && (
                      <button
                        onClick={handleVerifyToken}
                        disabled={isVerifyingToken || !resetToken}
                        className={`mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isVerifyingToken || !resetToken
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        } ${darkMode ? "ring-offset-gray-800" : ""}`}
                      >
                        {isVerifyingToken ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          "Verify Token"
                        )}
                      </button>
                    )}
                  </div>

                  {isTokenVerified && (
                    <>
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <div
                            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <FaLock />
                          </div>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 placeholder-gray-500"
                            }`}
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div
                            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <FaLock />
                          </div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                              darkMode
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 placeholder-gray-500"
                            }`}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleResetPassword}
                        disabled={isResetPasswordLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          isResetPasswordLoading
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        } ${darkMode ? "ring-offset-gray-800" : ""}`}
                      >
                        {isResetPasswordLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Resetting...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Platform Name */}
              <div>
                <label
                  className={`block text-lg font-semibold mb-3 flex items-center ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaFont className="mr-3 text-green-500" />
                  Platform Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className={`mt-1 block w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="Enter platform name"
                  />
                ) : (
                  <div
                    className={`mt-1 p-3 rounded-lg text-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {platformName || "Not set"}
                  </div>
                )}
              </div>
            </div>

            {/* Branding Section */}
            <div
              className={`p-6 rounded-xl mb-8 ${
                darkMode ? "bg-gray-700/30" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 flex items-center ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <FaImage className="mr-3 text-green-500" />
                Branding Assets
              </h3>

              <div className="grid grid-cols-1 gap-8">
                {/* Logo Upload */}
                <div>
                  <label
                    className={`block text-lg font-semibold mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Platform Logo
                  </label>
                  {editMode ? (
                    <div className="space-y-4">
                      <div
                        className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                          darkMode
                            ? "border-gray-600 hover:border-gray-500"
                            : "border-gray-300 hover:border-gray-400"
                        } ${!branding.logo ? "min-h-48 cursor-pointer" : ""}`}
                        onClick={
                          !branding.logo
                            ? () =>
                                document.getElementById("logo-upload").click()
                            : undefined
                        }
                      >
                        {branding.logo ? (
                          <div className="flex flex-col items-center w-full">
                            <div className="relative w-full max-w-md">
                              <img
                                src={branding.logo}
                                alt="Logo Preview"
                                className="w-full h-auto max-h-64 object-contain rounded-lg shadow-md"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage("logo");
                                }}
                                className={`absolute -top-3 -right-3 p-2 rounded-full ${
                                  darkMode
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                              >
                                <FaTrashAlt className="text-sm" />
                              </button>
                            </div>
                            <p
                              className={`mt-3 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Click the trash icon to remove or drag a new image
                              here
                            </p>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <FaCloudUploadAlt
                              className={`text-5xl mb-4 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-lg font-medium mb-1 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Upload Logo
                            </span>
                            <span
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Drag & drop or click to browse
                            </span>
                            <span
                              className={`text-xs mt-2 ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              Recommended: 512x512px PNG with transparent
                              background
                            </span>
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "logo")}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {branding.logo ? (
                        <div className="w-full max-w-md">
                          <img
                            src={branding.logo}
                            alt="Current Logo"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow"
                          />
                        </div>
                      ) : (
                        <div
                          className={`h-48 w-full flex items-center justify-center rounded-xl ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`flex flex-col items-center ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <FaImage className="text-3xl mb-2" />
                            No logo uploaded
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button - Only shown in edit mode */}
            {editMode && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={toggleEditMode}
                  className={`flex items-center px-6 py-3 border rounded-lg text-sm font-medium transition-all ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className={`flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${
                    darkMode ? "ring-offset-gray-800" : ""
                  } ${isSaving ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <FiSave className="mr-2 text-lg" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;