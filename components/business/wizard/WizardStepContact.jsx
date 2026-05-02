"use client";

const FIELD = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm font-medium";
const LABEL = "block text-sm font-bold text-gray-700 mb-2";

function Field({ label, children }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

export default function WizardStepContact({ data, onChange }) {
  const c = data.contact || {};
  const a = data.address || {};

  const setContact = (key, value) =>
    onChange({ contact: { ...c, [key]: value } });
  const setAddress = (key, value) =>
    onChange({ address: { ...a, [key]: value } });

  return (
    <div className="space-y-6">
      {/* Contact */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-sm">📞</span>
          Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <input
              id="bp-phone"
              type="tel"
              className={FIELD}
              placeholder="+91 98765 43210"
              value={c.phone || ""}
              onChange={(e) => setContact("phone", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp Number">
            <input
              id="bp-whatsapp"
              type="tel"
              className={FIELD}
              placeholder="+91 98765 43210"
              value={c.whatsapp || ""}
              onChange={(e) => setContact("whatsapp", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address">
            <input
              id="bp-email"
              type="email"
              className={FIELD}
              placeholder="hello@example.com"
              value={c.email || ""}
              onChange={(e) => setContact("email", e.target.value)}
            />
          </Field>
          <Field label="Website URL">
            <input
              id="bp-website"
              type="url"
              className={FIELD}
              placeholder="https://example.com"
              value={c.website || ""}
              onChange={(e) => setContact("website", e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-sm">📍</span>
          Business Address
        </h3>

        <Field label="Street Address">
          <input
            id="bp-address-line1"
            type="text"
            className={FIELD}
            placeholder="123, Main Road, Near Landmark"
            value={a.addressLine1 || ""}
            onChange={(e) => setAddress("addressLine1", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City">
            <input
              id="bp-city"
              type="text"
              className={FIELD}
              placeholder="Ahmedabad"
              value={a.city || ""}
              onChange={(e) => setAddress("city", e.target.value)}
            />
          </Field>
          <Field label="State">
            <input
              id="bp-state"
              type="text"
              className={FIELD}
              placeholder="Gujarat"
              value={a.state || ""}
              onChange={(e) => setAddress("state", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="PIN / Postal Code">
            <input
              id="bp-postal"
              type="text"
              className={FIELD}
              placeholder="380001"
              value={a.postalCode || ""}
              onChange={(e) => setAddress("postalCode", e.target.value)}
            />
          </Field>
          <Field label="Country">
            <input
              id="bp-country"
              type="text"
              className={FIELD}
              placeholder="India"
              value={a.country || ""}
              onChange={(e) => setAddress("country", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
