/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { dbUser, refetchUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!dbUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const updatedUser = {
      name: form.name.value,
      bloodGroup: form.bloodGroup.value,
      district: form.district.value,
      upazila: form.upazila.value,
    };

    try {
      await axios.patch(
        `http://localhost:5000/users/email/${dbUser.email}`,
        updatedUser
      );

      await refetchUser(); // 🔄 reload user from DB
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">
          My Profile
        </h2>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex justify-center">
          <img
            src={dbUser.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>

        <input
          name="name"
          defaultValue={dbUser.name}
          disabled={!editing}
          className="w-full border p-2 rounded"
        />

        {/* EMAIL (NOT EDITABLE) */}
        <input
          value={dbUser.email}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />

        <select
          name="bloodGroup"
          defaultValue={dbUser.bloodGroup}
          disabled={!editing}
          className="w-full border p-2 rounded"
        >
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          name="district"
          defaultValue={dbUser.district}
          disabled={!editing}
          className="w-full border p-2 rounded"
        />

        <input
          name="upazila"
          defaultValue={dbUser.upazila}
          disabled={!editing}
          className="w-full border p-2 rounded"
        />

        {editing && (
          <button
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </form>
    </div>
  );
}
