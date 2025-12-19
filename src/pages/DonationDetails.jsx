/* eslint-disable */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function DonationDetails() {
  const { id } = useParams();
  const { dbUser, user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/donation-requests/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);
      });
  }, [id]);

  const handleConfirmDonate = async () => {
    await axios.patch(
      `http://localhost:5000/donation-requests/${id}`,
      {
        donationStatus: "inprogress",
        donorName: dbUser?.name,
        donorEmail: user?.email,
      }
    );

    setShowModal(false);
    alert("Donation confirmed!");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Donation Request Details
      </h2>

      <div className="space-y-2">
        <p><b>Recipient:</b> {request.recipientName}</p>
        <p><b>Blood Group:</b> {request.bloodGroup}</p>
        <p>
          <b>Location:</b> {request.recipientDistrict},{" "}
          {request.recipientUpazila}
        </p>
        <p><b>Date:</b> {request.donationDate}</p>
        <p><b>Time:</b> {request.donationTime}</p>
        <p><b>Status:</b> {request.donationStatus}</p>
      </div>

      {request.donationStatus === "pending" && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded"
        >
          Donate
        </button>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Confirm Donation
            </h3>

            <input
              value={dbUser?.name}
              readOnly
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              value={user?.email}
              readOnly
              className="w-full border p-2 mb-4 rounded"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
