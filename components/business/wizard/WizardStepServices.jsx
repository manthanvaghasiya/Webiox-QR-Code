"use client";

import { useState, useRef } from "react";

const FIELD = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm font-medium";

function ServiceCard({ svc, index, onUpdate, onRemove }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            className={FIELD}
            placeholder="Service / Product name"
            value={svc.title || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            maxLength={120}
          />
          <input
            type="text"
            className={FIELD}
            placeholder="Short description (optional)"
            value={svc.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            maxLength={500}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              className={FIELD}
              placeholder="Price (e.g. 500 or Free)"
              value={svc.price || ""}
              onChange={(e) => onUpdate("price", e.target.value)}
              maxLength={30}
            />
            <select
              className={FIELD + " cursor-pointer"}
              value={svc.currency || "INR"}
              onChange={(e) => onUpdate("currency", e.target.value)}
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="AED">د.إ AED</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-lg transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function WizardStepServices({ data, onChange }) {
  const services = data.services || [];

  const addService = () => {
    if (services.length >= 20) return;
    onChange({
      services: [
        ...services,
        { title: "", description: "", price: "", currency: "INR", imageUrl: "", order: services.length },
      ],
    });
  };

  const updateService = (index, field, value) => {
    const updated = services.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onChange({ services: updated });
  };

  const removeService = (index) => {
    onChange({ services: services.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">
          Products & Services{" "}
          <span className="text-gray-400 font-normal">({services.length}/20)</span>
        </p>
        <button
          type="button"
          onClick={addService}
          disabled={services.length >= 20}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Item
        </button>
      </div>

      {services.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">🛍️</div>
          <p className="text-gray-500 font-semibold text-sm mb-1">No items yet</p>
          <p className="text-gray-400 text-xs mb-4">Add your products, services, or menu items</p>
          <button
            type="button"
            onClick={addService}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
          >
            + Add First Item
          </button>
        </div>
      )}

      <div className="space-y-3">
        {services.map((svc, i) => (
          <ServiceCard
            key={i}
            svc={svc}
            index={i}
            onUpdate={(field, value) => updateService(i, field, value)}
            onRemove={() => removeService(i)}
          />
        ))}
      </div>

      {services.length > 0 && (
        <button
          type="button"
          onClick={addService}
          disabled={services.length >= 20}
          className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-semibold hover:border-brand-300 hover:text-brand-600 transition-all disabled:opacity-50"
        >
          + Add Another Item
        </button>
      )}
    </div>
  );
}
