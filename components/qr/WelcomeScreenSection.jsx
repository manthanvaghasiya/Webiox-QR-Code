"use client";

import { useState } from "react";
import { Upload, X, Eye, EyeOff } from "lucide-react";

export default function WelcomeScreenSection({ fields, onFieldChange }) {
  const [showPreview, setShowPreview] = useState(false);

  const enabled = fields.welcomeScreenEnabled ?? false;
  const logo = fields.welcomeScreenLogo || "";
  const name = fields.welcomeScreenName || "";
  const title = fields.welcomeScreenTitle || "";
  const description = fields.welcomeScreenDescription || "";

  const handleToggle = () => {
    onFieldChange("welcomeScreenEnabled", !enabled);
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onFieldChange("welcomeScreenLogo", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onFieldChange("welcomeScreenLogo", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-900">
            Show Welcome Screen
          </span>
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hide
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Preview
            </>
          )}
        </button>
      </div>

      {enabled && (
        <div className="space-y-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo or Channel Image
            </label>
            <div className="flex items-center gap-3">
              {logo ? (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-gray-400" />
                </label>
              )}
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-semibold">
                    Click or drag to upload
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, 200×200px
                </p>
              </div>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Channel/Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onFieldChange("welcomeScreenName", e.target.value)}
              placeholder="e.g., YouTube Channel, Company Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title or Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onFieldChange("welcomeScreenTitle", e.target.value)}
              placeholder="e.g., Subscribe Now"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => onFieldChange("welcomeScreenDescription", e.target.value)}
              placeholder="Brief description or call-to-action"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Live Preview */}
      {showPreview && enabled && (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="aspect-[9/16] flex flex-col items-center justify-center p-4 text-center text-white">
            {logo && (
              <img
                src={logo}
                alt="Preview Logo"
                className="h-16 w-16 rounded-lg object-cover mb-4 shadow-lg"
              />
            )}
            {name && (
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
            )}
            {title && (
              <p className="text-lg text-purple-200 mb-3">{title}</p>
            )}
            {description && (
              <p className="text-sm text-gray-300 mb-6 max-w-xs">{description}</p>
            )}
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg transition-all duration-300">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
