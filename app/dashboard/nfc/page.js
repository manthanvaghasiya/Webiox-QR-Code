"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Plus, Package, TrendingUp } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

function statusBadge(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

function formatCardType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function NfcPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/nfc/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Error fetching NFC orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="NFC Cards"
        description="Order premium NFC tap cards that link directly to your business profile."
        action={
          <Link
            href="/dashboard/nfc/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Order now
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mb-3" />
            <p className="text-gray-500">Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
          <EmptyState
            icon={CreditCard}
            title="Order your first NFC tap card"
            description="Tap-to-share NFC cards in PVC, metal, or wood — link to any business profile instantly."
            cta="Order now"
            ctaHref="/dashboard/nfc/new"
          />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Total Orders
                </span>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Total Cards
                </span>
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {orders.reduce((sum, o) => sum + (o.quantity || 0), 0)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Total Spent
                </span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₹{orders
                  .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-3xl border border-ink-100 shadow-card overflow-hidden">
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {formatCardType(order.cardType)} Card Order
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {order.quantity} card{order.quantity !== 1 ? "s" : ""} •
                        Ordered{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(order.totalPrice / order.quantity)} per card
                      </p>
                    </div>
                  </div>

                  {order.design && (
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: order.design.color }}
                      />
                      <span className="text-xs text-gray-600">
                        Logo at {order.design.logoPosition}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
