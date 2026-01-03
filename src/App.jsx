import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import DashboardLayout from "./AdminDashboard/DashboardLayout/DashboardLayout";

// Pages
import AdminDashboard from "./AdminDashboard/Dashboard";
import Users from "./AdminDashboard/Components/Users/Users";
import Analytics from "./AdminDashboard/Components/Analytics/Analytics";
import Subscriptions from "./AdminDashboard/Components/Subscriptions/Subscriptions";
import Reports from "./AdminDashboard/Components/Reports/Reports";
import Settings from "./AdminDashboard/Components/Setting/Settings";
import Login from "./AdminDashboard/loginPage/Login";
import Register from "./AdminDashboard/RegisterPage/Register";
import ProtectedRoute from "../src/ProtectedRoute/ProtectedRoute"

import Notification from "./AdminDashboard/Components/Notification/Notification";
import Main from "../src/Pages/Main"

import Tips from "./AdminDashboard/Components/Tips/Tips";
import ElectricProducts from "./AdminDashboard/Components/ElectricProduct/ElectricProducts";
import HardwareProducts from "./AdminDashboard/Components/HardwareProducts/HardwareProducts";

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Main/>} />


        <Route
          element={
            <ProtectedRoute>
            <DashboardLayout />
             </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/electric-products" element={<ElectricProducts/>} />
          <Route path="/hardware-products" element={<HardwareProducts/>} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/send-notifications" element={<Notification />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/settings/reset-password/:token"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
