"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import NfcOrderWizard from "@/components/dashboard/nfc/NfcOrderWizard";

export default function NfcOrderPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/business-profiles");
        if (!res.ok) throw new Error("Failed to fetch profiles");
        const data = await res.json();
        if (data.success) {
          setProfiles(data.profiles || []);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSuccess = (order) => {
    setSuccessOrder(order);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        href="/dashboard/nfc"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to NFC Cards
      </Link>

      {successOrder ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-ink-100 shadow-card p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Order Created Successfully!
            </h2>

            <p className="text-gray-600 mb-6">
              Your NFC card order has been placed. You'll receive a confirmation
              email shortly with tracking information.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Card Type
                  </p>
                  <p className="font-bold text-gray-900">
                    {successOrder.cardType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase mb-1">
                    Quantity
                  </p>
                  <p className="font-bold text-gray-900">
                    {successOrder.quantity} cards
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Total Price
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{successOrder.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/nfc"
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-900 transition-colors text-center"
              >
                View All Orders
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Order NFC Cards
            </h1>
            <p className="text-gray-500 mt-2">
              Link your business profile to physical NFC cards for seamless
              sharing
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mb-3" />
                <p className="text-gray-500">Loading profiles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          ) : profiles.length === 0 ? (
            <div className="max-w-2xl mx-auto p-8 text-center bg-gray-50 rounded-3xl">
              <p className="text-gray-700 font-semibold mb-4">
                No profiles found
              </p>
              <p className="text-gray-600 mb-6">
                Create a business profile first to order NFC cards
              </p>
              <Link
                href="/dashboard/profiles/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-colors"
              >
                Create Profile
              </Link>
            </div>
          ) : (
            <NfcOrderWizard profiles={profiles} onSuccess={handleSuccess} />
          )}
        </>
      )}
    </div>
  );
}
