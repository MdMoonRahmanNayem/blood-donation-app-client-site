import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHome from "../dashboard/DashboardHome";
import AllUsers from "../dashboard/AllUsers";
import AllBloodDonationRequests from "../dashboard/AllBloodDonationRequests";
import MyDonationRequests from "../dashboard/MyDonationRequests";
import CreateDonationRequest from "../dashboard/CreateDonationRequest";
import Profile from "../dashboard/Profile";

import AdminRoute from "../routes/AdminRoute";
import VolunteerOrAdminRoute from "../routes/VolunteerOrAdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ======================
  // DASHBOARD (Protected)
  // ======================
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />, // /dashboard
      },

      // 🔒 ADMIN ONLY
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },

      // 🔒 ADMIN + VOLUNTEER
      {
        path: "all-blood-donation-requests",
        element: (
          <VolunteerOrAdminRoute>
            <AllBloodDonationRequests />
          </VolunteerOrAdminRoute>
        ),
      },

      // 👤 DONOR
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },

      // 👤 ALL ROLES
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
