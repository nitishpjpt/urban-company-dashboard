import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  FiUserPlus, 
  FiSearch, 
  FiTrash2, 
  FiX, 
  FiUser, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiDollarSign, 
  FiEye, 
  FiEdit2,
  FiMap,
  FiTool,
  FiClock,
  FiCalendar,
  FiKey,
  FiSend,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import axios from "axios";

const Users = () => {
  const { darkMode } = useOutletContext();
  const [partners, setPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState({});
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  
  // Partner form state
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceName: "",
    serviceType: "",
    experience: "",
    serviceArea: "",
    charges: "",
    panNumber: "",
    aadharNumber: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner`
      );
      console.log("Fetched partners:", response.data);
      setPartners(response.data.data?.partners || []);
      
      // Fetch email status for all partners
      fetchEmailStatusForPartners(response.data.data?.partners || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      alert("Failed to load partners");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmailStatusForPartners = async (partnersList) => {
    const statusMap = {};
    for (const partner of partnersList) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/${partner._id}/email-status`
        );
        statusMap[partner._id] = response.data.data.emailStatus;
      } catch (error) {
        console.error(`Error fetching email status for partner ${partner._id}:`, error);
        statusMap[partner._id] = { sent: false, error: true };
      }
    }
    setEmailStatus(statusMap);
  };

  const StatusBadge = ({ serviceType }) => {
    const serviceConfig = {
      Electrician: {
        bg: darkMode ? "bg-yellow-900/30" : "bg-yellow-100",
        text: darkMode ? "text-yellow-200" : "text-yellow-800",
        icon: "⚡",
      },
      Plumber: {
        bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
        text: darkMode ? "text-blue-200" : "text-blue-800",
        icon: "🔧",
      },
      "Ac Technician": {
        bg: darkMode ? "bg-cyan-900/30" : "bg-cyan-100",
        text: darkMode ? "text-cyan-200" : "text-cyan-800",
        icon: "❄️",
      },
      Painter: {
        bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
        text: darkMode ? "text-purple-200" : "text-purple-800",
        icon: "🎨",
      },
      Other: {
        bg: darkMode ? "bg-gray-700" : "bg-gray-100",
        text: darkMode ? "text-gray-300" : "text-gray-800",
        icon: "🔧",
      },
    };

    const config = serviceConfig[serviceType] || {
      bg: darkMode ? "bg-gray-700" : "bg-gray-100",
      text: darkMode ? "text-gray-300" : "text-gray-800",
      icon: "👤",
    };

    return (
      <div
        className={`inline-flex items-center ${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}
      >
        <span className="mr-2">{config.icon}</span>
        {serviceType}
      </div>
    );
  };

  const EmailStatusBadge = ({ partnerId }) => {
    const status = emailStatus[partnerId];
    
    if (!status) {
      return (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading...
          </span>
        </div>
      );
    }

    if (status.error) {
      return (
        <div className="flex items-center" title="Error checking email status">
          <FiAlertCircle className={`w-3 h-3 mr-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Error
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <div 
          className={`w-2 h-2 rounded-full mr-2 ${status.sent ? (darkMode ? 'bg-green-500' : 'bg-green-600') : (darkMode ? 'bg-red-500' : 'bg-red-600')}`}
          title={status.sent ? 'Email sent successfully' : 'Email not sent'}
        ></div>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {status.sent ? 'Sent' : 'Not sent'}
        </span>
      </div>
    );
  };

  const handlePartnerFormChange = (e) => {
    const { name, value } = e.target;
    setPartnerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'serviceName', 'serviceType'];
      for (const field of requiredFields) {
        if (!partnerForm[field].trim()) {
          alert(`${field} is required!`);
          setIsSubmitting(false);
          return;
        }
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(partnerForm.email)) {
        alert("Please enter a valid email address!");
        setIsSubmitting(false);
        return;
      }

      // Phone validation (10 digits)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(partnerForm.phone.replace(/\D/g, ''))) {
        alert("Please enter a valid 10-digit phone number!");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const partnerData = {
        name: partnerForm.name,
        email: partnerForm.email,
        phone: partnerForm.phone,
        serviceName: partnerForm.serviceName,
        serviceType: partnerForm.serviceType,
        experience: parseInt(partnerForm.experience) || 0,
        serviceArea: partnerForm.serviceArea.split(',').map(area => area.trim()).filter(area => area),
        charges: parseInt(partnerForm.charges) || 0,
        panNumber: partnerForm.panNumber,
        aadharNumber: partnerForm.aadharNumber,
        address: partnerForm.address,
        notes: partnerForm.notes
      };

      // API call to submit partner application
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/register`,
        partnerData
      );
      
      if (response.data.success) {
        const successMessage = response.data.data?.emailSent 
          ? "Partner registered successfully! Login credentials have been sent via email."
          : "Partner registered successfully! (Note: Email notification may not have been sent)";
        
        alert(successMessage);
        setShowPartnerModal(false);
        resetPartnerForm();
        fetchPartners(); // Refresh the list
      }
    } catch (error) {
      console.error("Error submitting partner application:", error);
      const errorMessage = error.response?.data?.message || "Failed to register partner. Please try again.";
      
      // Check if it's a duplicate error
      if (errorMessage.includes("already exists")) {
        alert(`Registration failed: ${errorMessage}. Please use a different email or phone number.`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPartner = (partner) => {
    setSelectedPartner(partner);
    setShowViewModal(true);
  };

  const handleEditPartner = (partner) => {
    setSelectedPartner(partner);
    // Pre-fill the form with partner data
    setPartnerForm({
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      serviceName: partner.serviceName,
      serviceType: partner.serviceType,
      experience: partner.experience?.toString() || "",
      serviceArea: Array.isArray(partner.serviceArea) 
        ? partner.serviceArea.join(', ') 
        : partner.serviceArea || "",
      charges: partner.charges?.toString() || "",
      panNumber: partner.panNumber || "",
      aadharNumber: partner.aadharNumber || "",
      address: typeof partner.address === 'object' 
        ? `${partner.address.street || ''}, ${partner.address.city || ''}, ${partner.address.state || ''}, ${partner.address.pincode || ''}`
        : partner.address || "",
      notes: partner.notes || ""
    });
    setShowEditModal(true);
  };

  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const partnerData = {
        name: partnerForm.name,
        email: partnerForm.email,
        phone: partnerForm.phone,
        serviceName: partnerForm.serviceName,
        serviceType: partnerForm.serviceType,
        experience: parseInt(partnerForm.experience) || 0,
        serviceArea: partnerForm.serviceArea.split(',').map(area => area.trim()).filter(area => area),
        charges: parseInt(partnerForm.charges) || 0,
        panNumber: partnerForm.panNumber,
        aadharNumber: partnerForm.aadharNumber,
        address: partnerForm.address,
        notes: partnerForm.notes
      };

      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/${selectedPartner._id}`,
        partnerData
      );
      
      if (response.data.success) {
        const successMessage = response.data.message || "Partner updated successfully!";
        alert(successMessage);
        setShowEditModal(false);
        resetPartnerForm();
        fetchPartners(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      const errorMessage = error.response?.data?.message || "Failed to update partner. Please try again.";
      
      if (errorMessage.includes("already exists")) {
        alert(`Update failed: ${errorMessage}. Please use a different email or phone number.`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async (partnerId, partnerName) => {
    if (window.confirm(`Are you sure you want to delete partner "${partnerName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/${partnerId}`
        );
        alert("Partner deleted successfully!");
        fetchPartners(); // Refresh the list
      } catch (error) {
        console.error("Error deleting partner:", error);
        alert(error.response?.data?.message || "Failed to delete partner.");
      }
    }
  };

  const handleResendEmail = async (partnerId, partnerName) => {
    if (window.confirm(`Resend welcome email to ${partnerName}? They will receive new login credentials.`)) {
      setResendingEmail(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/${partnerId}/resend-email`
        );
        
        if (response.data.success) {
          alert(`Welcome email resent successfully to ${partnerName}`);
          // Update email status for this partner
          setEmailStatus(prev => ({
            ...prev,
            [partnerId]: { sent: true, lastLogin: null, isActive: false }
          }));
        }
      } catch (error) {
        console.error("Error resending email:", error);
        alert(error.response?.data?.message || "Failed to resend email. Please try again.");
      } finally {
        setResendingEmail(false);
      }
    }
  };

  const handleResetPassword = async (partnerId, partnerName) => {
    if (window.confirm(`Reset password for ${partnerName}? They will receive new credentials via email.`)) {
      setResettingPassword(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/partner/${partnerId}/reset-password`
        );
        
        if (response.data.success) {
          alert(`Password reset successfully for ${partnerName}. New credentials have been sent.`);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        alert(error.response?.data?.message || "Failed to reset password. Please try again.");
      } finally {
        setResettingPassword(false);
      }
    }
  };

  const resetPartnerForm = () => {
    setPartnerForm({
      name: "",
      email: "",
      phone: "",
      serviceName: "",
      serviceType: "",
      experience: "",
      serviceArea: "",
      charges: "",
      panNumber: "",
      aadharNumber: "",
      address: "",
      notes: ""
    });
  };

  const handleCloseModal = (modalType) => {
    if (window.confirm("Are you sure? All unsaved data will be lost.")) {
      if (modalType === 'add') {
        setShowPartnerModal(false);
      } else if (modalType === 'edit') {
        setShowEditModal(false);
      } else if (modalType === 'view') {
        setShowViewModal(false);
      }
      resetPartnerForm();
    }
  };

  // View Modal Component (keep as before)
  const ViewPartnerModal = () => {
    if (!selectedPartner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          {/* Modal Header */}
          <div className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-xl font-semibold flex items-center ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}>
                  <FiUser className="mr-2" />
                  {selectedPartner.name}
                </h3>
                <p className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  Partner Details
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 rounded-full hover:bg-opacity-20 ${
                  darkMode 
                    ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Partner Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold pb-2 border-b ${
                  darkMode ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-200"
                }`}>
                  Personal Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Name</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>{selectedPartner.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiMail className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>{selectedPartner.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiPhone className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Phone</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>{selectedPartner.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold pb-2 border-b ${
                  darkMode ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-200"
                }`}>
                  Service Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiTool className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Service Type</p>
                      <div className="mt-1">
                        <StatusBadge serviceType={selectedPartner.serviceType} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiBriefcase className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Service Name</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>{selectedPartner.serviceName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiClock className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Experience</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>{selectedPartner.experience} years</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiDollarSign className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Charges</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>₹{selectedPartner.charges}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Status */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold pb-2 border-b ${
                  darkMode ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-200"
                }`}>
                  Account Status
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiMail className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Email Status</p>
                      <div className="mt-1">
                        <EmailStatusBadge partnerId={selectedPartner._id} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleResendEmail(selectedPartner._id, selectedPartner.name);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                        darkMode 
                          ? "bg-purple-600 hover:bg-purple-700 text-white" 
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                      disabled={resendingEmail}
                    >
                      {resendingEmail ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Resend Email
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleResetPassword(selectedPartner._id, selectedPartner.name);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                        darkMode 
                          ? "bg-orange-600 hover:bg-orange-700 text-white" 
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
                      disabled={resettingPassword}
                    >
                      {resettingPassword ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <FiKey className="mr-2" />
                          Reset Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold pb-2 border-b ${
                  darkMode ? "text-gray-300 border-gray-700" : "text-gray-700 border-gray-200"
                }`}>
                  Registration Details
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiCalendar className={`mt-1 mr-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Registered On</p>
                      <p className={darkMode ? "text-gray-200" : "text-gray-900"}>
                        {new Date(selectedPartner.registrationDate || selectedPartner.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`mt-6 pt-6 border-t flex justify-end space-x-3 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditPartner(selectedPartner);
                }}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                  darkMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FiEdit2 className="mr-2" />
                Edit Partner
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  darkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal Component (keep as before)
  const EditPartnerModal = () => {
    if (!selectedPartner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          {/* Modal Header */}
          <div className={`p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                <FiEdit2 className="inline mr-2" />
                Edit Partner: {selectedPartner.name}
              </h3>
              <button
                onClick={() => handleCloseModal('edit')}
                className={`p-2 rounded-full hover:bg-opacity-20 ${
                  darkMode 
                    ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdatePartner} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className={`font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Personal Information
                </h4>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={partnerForm.name}
                    onChange={handlePartnerFormChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={partnerForm.email}
                    onChange={handlePartnerFormChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={partnerForm.phone}
                    onChange={handlePartnerFormChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-4">
                <h4 className={`font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Service Information
                </h4>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={partnerForm.serviceName}
                    onChange={handlePartnerFormChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={partnerForm.serviceType}
                    onChange={handlePartnerFormChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Select service type</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Ac Technician">AC Technician</option>
                    <option value="Painter">Painter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={partnerForm.experience}
                    onChange={handlePartnerFormChange}
                    min="0"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Service Area
                  </label>
                  <input
                    type="text"
                    name="serviceArea"
                    value={partnerForm.serviceArea}
                    onChange={handlePartnerFormChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Area1, Area2, Area3"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="charges"
                    value={partnerForm.charges}
                    onChange={handlePartnerFormChange}
                    min="0"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={partnerForm.panNumber}
                    onChange={handlePartnerFormChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={partnerForm.aadharNumber}
                    onChange={handlePartnerFormChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={partnerForm.address}
                  onChange={handlePartnerFormChange}
                  rows="2"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={partnerForm.notes}
                  onChange={handlePartnerFormChange}
                  rows="3"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className={`mt-6 pt-6 border-t flex justify-end space-x-3 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <button
                type="button"
                onClick={() => handleCloseModal('edit')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  darkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Partner"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 max-w-full ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      } p-6`}
    >
      {/* Modals */}
      {showViewModal && <ViewPartnerModal />}
      {showEditModal && <EditPartnerModal />}

      {/* Partner Registration Modal (keep as before) */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <FiUserPlus className="inline mr-2" />
                  Register New Partner
                </h3>
                <button
                  onClick={() => handleCloseModal("add")}
                  className={`p-2 rounded-full hover:bg-opacity-20 ${
                    darkMode
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p
                className={`mt-2 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Fill in the details below to register a new partner for
                Easy2Get.
              </p>
            </div>

            {/* Partner Form */}
            <form onSubmit={handleAddPartner} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Personal Information
                  </h4>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiUser className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={partnerForm.name}
                      onChange={handlePartnerFormChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiMail className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={partnerForm.email}
                      onChange={handlePartnerFormChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiPhone className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={partnerForm.phone}
                      onChange={handlePartnerFormChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Service Information
                  </h4>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiBriefcase className="inline mr-2" />
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="serviceName"
                      value={partnerForm.serviceName}
                      onChange={handlePartnerFormChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter service name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Service Type *
                    </label>
                    <select
                      name="serviceType"
                      value={partnerForm.serviceType}
                      onChange={handlePartnerFormChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="">Select service type</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Ac Technician">AC Technician</option>
                      <option value="Painter">Painter</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={partnerForm.experience}
                      onChange={handlePartnerFormChange}
                      min="0"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter years of experience"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiMapPin className="inline mr-2" />
                      Service Area
                    </label>
                    <input
                      type="text"
                      name="serviceArea"
                      value={partnerForm.serviceArea}
                      onChange={handlePartnerFormChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Area1, Area2, Area3"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <FiDollarSign className="inline mr-2" />
                      Charges (₹)
                    </label>
                    <input
                      type="number"
                      name="charges"
                      value={partnerForm.charges}
                      onChange={handlePartnerFormChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter charges in INR"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      PAN Number
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={partnerForm.panNumber}
                      onChange={handlePartnerFormChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter PAN number"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={partnerForm.aadharNumber}
                      onChange={handlePartnerFormChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      placeholder="Enter Aadhar number"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={partnerForm.address}
                    onChange={handlePartnerFormChange}
                    rows="2"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={partnerForm.notes}
                    onChange={handlePartnerFormChange}
                    rows="3"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Any additional information or requirements"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div
                className={`mt-6 pt-6 border-t flex justify-end space-x-3 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleCloseModal("add")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                      Submitting...
                    </span>
                  ) : (
                    "Register Partner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  Partners
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {isLoading
                    ? "Loading..."
                    : `${partners.length} registered partners`}
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
                    placeholder="Search partners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <button
                  onClick={() => setShowPartnerModal(true)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <FiUserPlus className="mr-2" />
                  Add Partner
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name & Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Experience & Charges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Email Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div
                          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                            darkMode ? "border-gray-400" : "border-gray-600"
                          }`}
                        ></div>
                      </div>
                      <p
                        className={`mt-2 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Loading partners...
                      </p>
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div
                        className={`text-center py-8 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FiUser className="mx-auto h-12 w-12 opacity-50" />
                        <p className="mt-2">No partners found</p>
                        <p className="text-sm">
                          Click "Add Partner" to register a new partner
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  partners
                    .filter(
                      (partner) =>
                        partner.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        partner.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        partner.serviceName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((partner) => (
                      <tr
                        key={partner._id}
                        className={`transition-colors duration-150 ${
                          darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <span
                                className={`font-semibold ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {partner.name?.[0]?.toUpperCase() || "P"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div
                                className={`font-medium ${
                                  darkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                              >
                                {partner.name}
                              </div>
                              <div className="mt-1">
                                <StatusBadge
                                  serviceType={partner.serviceType}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {partner.email}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {partner.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            <span className="font-medium">
                              {partner.experience}
                            </span>{" "}
                            years
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            ₹{partner.charges}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <EmailStatusBadge partnerId={partner._id} />
                            {emailStatus[partner._id]?.lastLogin && (
                              <div
                                className={`text-xs ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                                title="Last login"
                              >
                                Last login: {new Date(emailStatus[partner._id].lastLogin).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPartner(partner)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                                  : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              }`}
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditPartner(partner)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "text-green-400 hover:text-green-300 hover:bg-gray-700"
                                  : "text-green-600 hover:text-green-800 hover:bg-green-50"
                              }`}
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleResendEmail(partner._id, partner.name)}
                              disabled={resendingEmail}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "text-purple-400 hover:text-purple-300 hover:bg-gray-700"
                                  : "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                              } disabled:opacity-50`}
                              title="Resend Welcome Email"
                            >
                              <FiSend className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleResetPassword(partner._id, partner.name)}
                              disabled={resettingPassword}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "text-orange-400 hover:text-orange-300 hover:bg-gray-700"
                                  : "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                              } disabled:opacity-50`}
                              title="Reset Password"
                            >
                              <FiKey className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePartner(partner._id, partner.name)
                              }
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? "text-red-400 hover:text-red-300 hover:bg-gray-700"
                                  : "text-red-600 hover:text-red-800 hover:bg-red-50"
                              }`}
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination/Footer */}
          {partners.length > 0 && (
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
                <span className="font-medium">{partners.length}</span> of{" "}
                <span className="font-medium">{partners.length}</span> partners
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