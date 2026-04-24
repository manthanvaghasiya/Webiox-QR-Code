"use client";

import { useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Download, QrCode, Upload, Link2, Type, Mail, Phone, MessageSquare, Contact, Wifi } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("url");

  // Input states
  const [content, setContent] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const [dotPattern, setDotPattern] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // Using as a boolean flag now
  const qrCodeRef = useRef(null);
  const qrCodeInstance = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogo(url);
    }
  };

  const generateQR = async () => {
    let finalContent = "";
    
    // Format content based on active tab
    if (activeTab === "url" || activeTab === "text") {
      finalContent = content;
    } else if (activeTab === "email") {
      finalContent = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
    } else if (activeTab === "wifi") {
      finalContent = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
    } else if (activeTab === "sms") {
      finalContent = `SMSTO:${smsPhone}:${smsMessage}`;
    }

    if (!finalContent.trim()) return;

    try {
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: finalContent,
        image: logo || undefined,
        dotsOptions: {
          color: fgColor,
          type: dotPattern,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: fgColor,
          type: cornerStyle,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: 0.4,
        },
      });

      qrCodeInstance.current = qrCode;

      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = ""; // Clear existing
        qrCode.append(qrCodeRef.current);
      }
      
      setQrCodeUrl("generated"); // Flag to enable download and hide placeholder

      // Asynchronously save configuration to the backend database
      fetch("/api/qrcodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: finalContent,
          fgColor: fgColor,
          bgColor: bgColor,
          hasLogo: !!logo,
        }),
      }).catch((err) => console.error("Error saving QR code to DB:", err));

    } catch (err) {
      console.error("Error generating QR code", err);
    }
  };

  const downloadQR = () => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.download({ name: "webiox-qr", extension: "png" });
    }
  };

  return (
    <div className="bg-gray-100 flex-grow flex flex-col items-center py-12 px-4 sm:px-8 w-full">
      
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-3xl mx-auto mt-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
          The 100% Free Premium QR Code Generator
        </h1>
        <p className="text-xl text-gray-600 font-medium">
          Create custom QR Codes with logos, colors, and high-quality designs for your brand.
        </p>
      </div>

      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Configuration Panel (Left Side) */}
        <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
          
          {/* Tabs Menu */}
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-gray-100 scrollbar-hide">
            {[
              { id: "url", icon: Link2, label: "URL" },
              { id: "text", icon: Type, label: "Text" },
              { id: "email", icon: Mail, label: "Email" },
              { id: "phone", icon: Phone, label: "Phone" },
              { id: "sms", icon: MessageSquare, label: "SMS" },
              { id: "vcard", icon: Contact, label: "vCard" },
              { id: "wifi", icon: Wifi, label: "WiFi" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8 flex-grow">
            {/* Section 1: Enter Content */}
            <div className="space-y-3">
              <label htmlFor="content" className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs">1</span>
                Enter Content
              </label>
              {(activeTab === "url" || activeTab === "text") && (
                <textarea
                  id="content"
                  rows={5}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none text-gray-800 placeholder-gray-400"
                  placeholder={activeTab === "url" ? "https://yourwebsite.com" : "Enter your text here..."}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              )}

              {activeTab === "email" && (
                <div className="space-y-4">
                  <input
                    type="email"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Email Address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                  <textarea
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    placeholder="Message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "wifi" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Network Name (SSID)"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                  />
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Unencrypted</option>
                  </select>
                </div>
              )}

              {activeTab === "sms" && (
                <div className="space-y-4">
                  <input
                    type="tel"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="Phone Number"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                  />
                  <textarea
                    rows={3}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    placeholder="Message"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                  />
                </div>
              )}

              {(activeTab === "phone" || activeTab === "vcard") && (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  Coming soon in the next update!
                </div>
              )}
            </div>

            {/* Section 2: Set Colors */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs">2</span>
                Set Colors
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl group-hover:border-blue-300 transition-colors">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <input
                        type="color"
                        id="fgColor"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="fgColor" className="text-sm text-gray-700 font-semibold cursor-pointer">
                      QR Color
                    </label>
                  </div>
                </div>

                <div className="flex-1 relative group">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl group-hover:border-blue-300 transition-colors">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <input
                        type="color"
                        id="bgColor"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="bgColor" className="text-sm text-gray-700 font-semibold cursor-pointer">
                      Background
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Add Logo */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs">3</span>
                Add Logo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Click to upload logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                {logo && (
                  <div className="relative w-24 h-24 rounded-2xl border border-gray-200 shadow-sm bg-white flex-shrink-0 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setLogo(null);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Customize Design */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs">4</span>
                Customize Design
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dot Pattern</label>
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    value={dotPattern}
                    onChange={(e) => setDotPattern(e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Corner Style</label>
                  <select
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    value={cornerStyle}
                    onChange={(e) => setCornerStyle(e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={generateQR}
            disabled={false}
            className="mt-10 w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 disabled:shadow-none"
          >
            <QrCode className="w-6 h-6" />
            Create QR Code
          </button>
        </div>

        {/* Preview Panel (Right Side) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="w-full max-w-sm flex flex-col items-center relative z-10">
            {/* Display Box */}
            <div className="w-full aspect-square bg-white border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center overflow-hidden mb-8 shadow-sm transition-all duration-300 hover:border-gray-400 p-6">
              <div 
                ref={qrCodeRef} 
                className={`flex items-center justify-center ${!qrCodeUrl ? 'hidden' : ''} animate-in fade-in zoom-in duration-500`} 
              />
              {!qrCodeUrl && (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <QrCode className="w-10 h-10 opacity-40" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Preview will appear here</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={downloadQR}
              disabled={!qrCodeUrl}
              className="w-full py-4 px-6 bg-gray-900 hover:bg-black active:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20 disabled:shadow-none"
            >
              <Download className="w-6 h-6" />
              Download PNG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
