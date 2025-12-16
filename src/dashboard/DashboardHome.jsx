/* eslint-disable */
import { useAuth } from "../context/AuthContext";

export default function DashboardHome() {
  const { user, dbUser } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.displayName}
      </h1>

      <p><strong>Role:</strong> {dbUser?.role}</p>
      <p><strong>Status:</strong> {dbUser?.status}</p>

      {/* Admin stats placeholder */}
      {dbUser?.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white shadow p-4 rounded">Total Users</div>
          <div className="bg-white shadow p-4 rounded">Total Funding</div>
          <div className="bg-white shadow p-4 rounded">Total Requests</div>
        </div>
      )}
    </div>
  );
}

