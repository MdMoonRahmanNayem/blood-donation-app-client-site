/* eslint-disable */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const { user, dbUser } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ADMIN + VOLUNTEER
        if (
          dbUser?.role === "admin" ||
          dbUser?.role === "volunteer"
        ) {
          const res = await axios.get(
            "http://localhost:5000/admin-stats"
          );
          setStats(res.data);
        }

        // DONOR
        if (dbUser?.role === "donor" && user?.email) {
          const res = await axios.get(
            `http://localhost:5000/donation-requests/recent/${user.email}`
          );
          setRecentRequests(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ ALWAYS STOP LOADING
      }
    };

    if (dbUser) {
      loadData();
    }
  }, [dbUser, user]);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-red-600">
          Welcome, {dbUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          Role: {dbUser?.role} | Status: {dbUser?.status}
        </p>
      </div>

      {(dbUser?.role === "admin" ||
        dbUser?.role === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <h4>Total Users</h4>
            <p className="text-3xl font-bold">
              {stats?.totalUsers || 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h4>Total Funding</h4>
            <p className="text-3xl font-bold">
              {stats?.totalFunding || 0}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h4>Total Requests</h4>
            <p className="text-3xl font-bold">
              {stats?.totalRequests || 0}
            </p>
          </div>
        </div>
      )}

      {dbUser?.role === "donor" &&
        recentRequests.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h3>Recent Donation Requests</h3>
              <Link
                to="/dashboard/my-donation-requests"
                className="text-red-600"
              >
                View All →
              </Link>
            </div>
          </div>
        )}
    </div>
  );
}
