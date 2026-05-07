// ─────────────────────────────────────────────────────────────────────────────
// NfcOrderWizard — 5-step NFC card ordering flow
//
// Step 1 select profile, 2 choose card type + quantity (with live price from
// lib/nfc-pricing), 3 design (color + logo position + preview), 4 contact /
// shipping info, 5 review + submit to /api/nfc/orders.
// Used in: app/dashboard/nfc/page.js.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Zap, AlertCircle } from "lucide-react";
import { CARD_TYPE_INFO, calculatePrice } from "@/lib/nfc-pricing";

export default function NfcOrderWizard({ profiles, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [cardType, setCardType] = useState("pvc");
  const [quantity, setQuantity] = useState(25);
  const [design, setDesign] = useState({
    color: "#4F46E5",
    logoPosition: "center",
  });
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    name: "",
  });

  const selectedProfile = profiles.find((p) => p._id === selectedProfileId);
  const totalPrice = calculatePrice(cardType, quantity);

  const handleNextStep = () => {
    if (step === 1 && !selectedProfileId) {
      setError("Please select a profile");
      return;
    }
    if (step === 2 && !cardType) {
      setError("Please select a card type");
      return;
    }
    if (step === 3 && (!design.color || !design.logoPosition)) {
      setError("Please complete the design selection");
      return;
    }
    if (step === 4) {
      if (
        !contactInfo.email ||
        !contactInfo.phone ||
        !contactInfo.address ||
        !contactInfo.name
      ) {
        setError("Please fill in all contact information");
        return;
      }
    }

    setError(null);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nfc/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedProfileId,
          cardType,
          design,
          contactInfo,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      onSuccess(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-gray-900">
              Step {step} of 5
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {step === 1 && "Select Profile"}
            {step === 2 && "Choose Card Type"}
            {step === 3 && "Design Card"}
            {step === 4 && "Contact Information"}
            {step === 5 && "Review Order"}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Select Profile */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Select Profile
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Which business profile should this NFC card link to?
          </p>

          {profiles.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl">
              <p className="text-gray-600">No profiles found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  onClick={() => setSelectedProfileId(profile._id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedProfileId === profile._id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">
                    {profile.businessName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.totalScans || 0} scans • {profile.totalCalls || 0}{" "}
                    calls
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Choose Card Type */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Choose Card Type
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the material and style for your NFC cards.
          </p>

          <div className="space-y-3">
            {Object.entries(CARD_TYPE_INFO).map(([type, info]) => (
              <button
                key={type}
                onClick={() => setCardType(type)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  cardType === type
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{type}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {info.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{info.basePrice}</p>
                    <p className="text-xs text-gray-500">per card</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Quantity: {quantity} cards
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="mt-3 flex justify-between text-xs text-gray-600">
              <span>1</span>
              <span>100</span>
              <span>500</span>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </p>
              {quantity >= 25 && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Volume discount applied
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Design Card */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Design Card</h2>
          <p className="text-sm text-gray-600 mb-4">
            Customize the appearance of your NFC card.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Card Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.color}
                  onChange={(e) =>
                    setDesign({ ...design, color: e.target.value })
                  }
                  className="w-16 h-16 rounded-lg cursor-pointer border border-gray-200"
                />
                <div>
                  <p className="text-sm font-mono text-gray-600">
                    {design.color}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to choose color
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Logo Position
              </label>
              <div className="space-y-2">
                {["top", "center", "bottom"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() =>
                      setDesign({ ...design, logoPosition: pos })
                    }
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left capitalize ${
                      design.logoPosition === pos
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    Logo at {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Preview */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">
                Preview
              </p>
              <div
                className="w-full h-32 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 border-dashed"
                style={{
                  backgroundColor: design.color,
                  borderColor: design.color,
                }}
              >
                NFC Card Preview
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact Information */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Contact Information
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Where should we send your NFC cards?
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={contactInfo.name}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Shipping Address
              </label>
              <textarea
                value={contactInfo.address}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, address: e.target.value })
                }
                placeholder="123 Business Street, City, State 12345"
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review Order */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Review Order</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 uppercase mb-1">Profile</p>
              <p className="font-semibold text-gray-900">
                {selectedProfile?.businessName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Card Type
                </p>
                <p className="font-semibold text-gray-900">{cardType}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 uppercase mb-1">Quantity</p>
                <p className="font-semibold text-gray-900">{quantity} cards</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 uppercase mb-1">
                Shipping To
              </p>
              <p className="font-semibold text-gray-900">
                {contactInfo.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">{contactInfo.email}</p>
              <p className="text-sm text-gray-600">{contactInfo.phone}</p>
              <p className="text-sm text-gray-600 mt-2">{contactInfo.address}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-gray-600 uppercase mb-2">Total Price</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Includes {quantity >= 25 ? "volume discount" : "base pricing"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <button
            onClick={handlePrevStep}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={handleNextStep}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating order..." : <>
              <Zap className="w-4 h-4" />
              Complete Order
            </>}
          </button>
        )}
      </div>
    </div>
  );
}
