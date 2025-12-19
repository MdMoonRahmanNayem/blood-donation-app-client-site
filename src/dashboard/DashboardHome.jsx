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
    // ======================
    // ADMIN + VOLUNTEER → STATS
    // ======================
    if (
      (dbUser?.role === "admin" || dbUser?.role === "volunteer")
    ) {
      axios
        .get("http://localhost:5000/admin-stats")
        .then((res) => {
          setStats(res.data);
          setLoading(false);
        });
    }

    {/* ======================
    VOLUNTEER QUICK ACTION
====================== */}
{dbUser?.role === "volunteer" && (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-xl font-semibold mb-2 text-red-600">
      Volunteer Actions
    </h3>
    <p className="text-gray-600 mb-4">
      You can manage all blood donation requests and update their status.
    </p>

    <Link
      to="/dashboard/all-blood-donation-requests"
      className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Manage Blood Donation Requests →
    </Link>
  </div>
)}


    // ======================
    // DONOR → RECENT REQUESTS
    // ======================
    if (dbUser?.role === "donor" && user?.email) {
      axios
        .get(
          `http://localhost:5000/donation-requests/recent/${user.email}`
        )
        .then((res) => {
          const recent = res.data
            .sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            .slice(0, 3);

          setRecentRequests(recent);
          setLoading(false);
        });
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
      {/* ======================
          WELCOME
      ====================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-red-600">
          Welcome, {dbUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          Role: {dbUser?.role} | Status: {dbUser?.status}
        </p>
      </div>

      {/* ======================
          ADMIN + VOLUNTEER DASHBOARD
      ====================== */}
      {(dbUser?.role === "admin" ||
        dbUser?.role === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="text-gray-500">Total Users</h4>
            <p className="text-3xl font-bold mt-2">
              {stats?.totalUsers ?? 0}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="text-gray-500">Total Funding</h4>
            <p className="text-3xl font-bold mt-2">
              {stats?.totalFunding ?? 0}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h4 className="text-gray-500">
              Total Donation Requests
            </h4>
            <p className="text-3xl font-bold mt-2">
              {stats?.totalRequests ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* ======================
          DONOR DASHBOARD
      ====================== */}
      {dbUser?.role === "donor" &&
        recentRequests.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Recent Donation Requests
              </h3>

              <Link
                to="/dashboard/my-donation-requests"
                className="text-red-600 font-medium hover:underline"
              >
                View My All Requests →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">#</th>
                    <th className="border p-2">Recipient</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Blood</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((req, index) => (
                    <tr
                      key={req._id}
                      className="text-center"
                    >
                      <td className="border p-2">
                        {index + 1}
                      </td>
                      <td className="border p-2">
                        {req.recipientName}
                      </td>
                      <td className="border p-2">
                        {req.recipientDistrict},{" "}
                        {req.recipientUpazila}
                      </td>
                      <td className="border p-2">
                        {req.donationDate}
                      </td>
                      <td className="border p-2">
                        {req.donationTime}
                      </td>
                      <td className="border p-2">
                        {req.bloodGroup}
                      </td>
                      <td className="border p-2 capitalize">
                        {req.donationStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
