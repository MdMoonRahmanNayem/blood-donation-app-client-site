/* eslint-disable */
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { user, dbUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }

    if (!loading && dbUser?.status === "blocked") {
      alert("Your account is blocked");
      logout();
      navigate("/login");
    }
  }, [user, dbUser, loading]);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-red-600 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className="block hover:bg-red-700 p-2 rounded">
            Dashboard Home
          </NavLink>

          {/* Donor Menu */}
          {dbUser?.role === "donor" && (
            <>
              <NavLink to="/dashboard/my-donation-requests" className="block hover:bg-red-700 p-2 rounded">
                My Donation Requests
              </NavLink>
              <NavLink to="/dashboard/create-donation-request" className="block hover:bg-red-700 p-2 rounded">
                Create Donation Request
              </NavLink>
            </>
          )}

          {/* Admin Menu */}
          {dbUser?.role === "admin" && (
            <>
              <NavLink to="/dashboard/all-users" className="block hover:bg-red-700 p-2 rounded">
                All Users
              </NavLink>
              <NavLink to="/dashboard/all-blood-donation-requests" className="block hover:bg-red-700 p-2 rounded">
                All Blood Donation Requests
              </NavLink>
            </>
          )}

          <button
            onClick={logout}
            className="w-full bg-white text-red-600 mt-6 py-2 rounded font-semibold"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
