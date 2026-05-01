"use client";
import { useState } from "react";
import { Upload, ChevronDown, ChevronUp, User, Phone, Mail, Building, MapPin, Globe, FileText, Share2, Image, Briefcase } from "lucide-react";

const C = "w-full p-3.5 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md text-sm";

function FileUploadBox({ accept, label, file, onChange }) {
  return (
    <div className="space-y-2">
      <label className="flex flex-col items-center justify-center p-8 bg-white/40 border-2 border-dashed border-gray-300/60 rounded-2xl cursor-pointer hover:bg-white/70 hover:border-blue-400 transition-all backdrop-blur-sm">
        <Upload className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {file && <span className="text-xs text-blue-600 mt-1 font-semibold">{file.name}</span>}
        <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
      </label>
    </div>
  );
}

function FormSection({ title, icon: Icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200/50 rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 transition-all"
      >
        {Icon && <Icon className="w-4 h-4 text-brand-500" />}
        <span className="flex-1 text-sm font-bold text-gray-800">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{children}</label>;
}

export default function ContentForms({ activeTab, s, set }) {
  // s = state object, set = setter function that merges partial state

  if (activeTab === "url") return <textarea rows={4} className={C + " resize-none"} placeholder="https://yourwebsite.com" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "text") return <textarea rows={4} className={C + " resize-none"} placeholder="Enter your text here..." value={s.content} onChange={(e) => set({ content: e.target.value })} />;

  if (activeTab === "email") return (
    <div className="space-y-3">
      <input type="email" className={C} placeholder="Email Address" value={s.emailAddress} onChange={(e) => set({ emailAddress: e.target.value })} />
      <input type="text" className={C} placeholder="Subject" value={s.emailSubject} onChange={(e) => set({ emailSubject: e.target.value })} />
      <textarea rows={3} className={C + " resize-none"} placeholder="Message" value={s.emailMessage} onChange={(e) => set({ emailMessage: e.target.value })} />
    </div>
  );

  if (activeTab === "phone") return <input type="tel" className={C} placeholder="+1 234 567 8900" value={s.phone} onChange={(e) => set({ phone: e.target.value })} />;

  if (activeTab === "sms") return (
    <div className="space-y-3">
      <input type="tel" className={C} placeholder="Phone Number" value={s.smsPhone} onChange={(e) => set({ smsPhone: e.target.value })} />
      <textarea rows={3} className={C + " resize-none"} placeholder="Message" value={s.smsMessage} onChange={(e) => set({ smsMessage: e.target.value })} />
    </div>
  );

  // ── vCard Plus (QRCG-style rich form) ──
  if (activeTab === "vcard") return (
    <div className="space-y-4">
      {/* Profile Image */}
      <FormSection title="Profile Image" icon={Image} defaultOpen={false}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-100/80 border-2 border-dashed border-gray-300/60 flex items-center justify-center overflow-hidden flex-shrink-0">
            {s.vcImage ? (
              <img src={typeof s.vcImage === "string" ? s.vcImage : URL.createObjectURL(s.vcImage)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-300" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-brand-600 transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) set({ vcImage: f });
              }} />
            </label>
            {s.vcImage && (
              <button onClick={() => set({ vcImage: null })} className="text-xs text-red-500 font-semibold hover:text-red-600 ml-2">
                Remove
              </button>
            )}
          </div>
        </div>
      </FormSection>

      {/* Personal Information */}
      <FormSection title="Personal Information" icon={User}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <FieldLabel>First Name</FieldLabel>
            <input className={C} placeholder="Jane" value={s.vcFirstName} onChange={(e) => set({ vcFirstName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <FieldLabel>Last Name</FieldLabel>
            <input className={C} placeholder="Doe" value={s.vcLastName} onChange={(e) => set({ vcLastName: e.target.value })} />
          </div>
        </div>
      </FormSection>

      {/* Phone Numbers */}
      <FormSection title="Phone Numbers" icon={Phone}>
        <div className="space-y-1">
          <FieldLabel>Mobile</FieldLabel>
          <input type="tel" className={C} placeholder="+1 555-555-1234" value={s.vcPhone} onChange={(e) => set({ vcPhone: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <FieldLabel>Work Phone</FieldLabel>
            <input type="tel" className={C} placeholder="Work number" value={s.vcWorkPhone || ""} onChange={(e) => set({ vcWorkPhone: e.target.value })} />
          </div>
          <div className="space-y-1">
            <FieldLabel>Fax</FieldLabel>
            <input type="tel" className={C} placeholder="Fax number" value={s.vcFax || ""} onChange={(e) => set({ vcFax: e.target.value })} />
          </div>
        </div>
      </FormSection>

      {/* Email */}
      <FormSection title="Email" icon={Mail}>
        <input type="email" className={C} placeholder="jane@example.com" value={s.vcEmail} onChange={(e) => set({ vcEmail: e.target.value })} />
      </FormSection>

      {/* Company */}
      <FormSection title="Company" icon={Building}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <FieldLabel>Company</FieldLabel>
            <input className={C} placeholder="Acme Inc." value={s.vcCompany} onChange={(e) => set({ vcCompany: e.target.value })} />
          </div>
          <div className="space-y-1">
            <FieldLabel>Job Title</FieldLabel>
            <input className={C} placeholder="Designer" value={s.vcTitle} onChange={(e) => set({ vcTitle: e.target.value })} />
          </div>
        </div>
      </FormSection>

      {/* Address */}
      <FormSection title="Address" icon={MapPin} defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-1">
            <FieldLabel>Street</FieldLabel>
            <input className={C} placeholder="123 Main Street" value={s.vcStreet || ""} onChange={(e) => set({ vcStreet: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <FieldLabel>City</FieldLabel>
              <input className={C} placeholder="New York" value={s.vcCity || ""} onChange={(e) => set({ vcCity: e.target.value })} />
            </div>
            <div className="space-y-1">
              <FieldLabel>State</FieldLabel>
              <input className={C} placeholder="NY" value={s.vcState || ""} onChange={(e) => set({ vcState: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <FieldLabel>ZIP Code</FieldLabel>
              <input className={C} placeholder="10001" value={s.vcZip || ""} onChange={(e) => set({ vcZip: e.target.value })} />
            </div>
            <div className="space-y-1">
              <FieldLabel>Country</FieldLabel>
              <input className={C} placeholder="United States" value={s.vcCountry || ""} onChange={(e) => set({ vcCountry: e.target.value })} />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Website */}
      <FormSection title="Website" icon={Globe} defaultOpen={false}>
        <input type="url" className={C} placeholder="https://www.yourwebsite.com" value={s.vcWebsite} onChange={(e) => set({ vcWebsite: e.target.value })} />
      </FormSection>

      {/* Summary / Bio */}
      <FormSection title="Summary" icon={FileText} defaultOpen={false}>
        <div className="space-y-1">
          <textarea
            rows={3}
            className={C + " resize-none"}
            placeholder="Tell people about yourself..."
            maxLength={250}
            value={s.vcSummary || ""}
            onChange={(e) => set({ vcSummary: e.target.value })}
          />
          <p className="text-[10px] text-gray-400 text-right font-medium">{(s.vcSummary || "").length}/250</p>
        </div>
      </FormSection>

      {/* Social Media */}
      <FormSection title="Social Media" icon={Share2} defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-1">
            <FieldLabel>LinkedIn</FieldLabel>
            <input type="url" className={C} placeholder="https://linkedin.com/in/yourprofile" value={s.vcLinkedin || ""} onChange={(e) => set({ vcLinkedin: e.target.value })} />
          </div>
          <div className="space-y-1">
            <FieldLabel>Instagram</FieldLabel>
            <input type="url" className={C} placeholder="https://instagram.com/yourhandle" value={s.vcInstagram || ""} onChange={(e) => set({ vcInstagram: e.target.value })} />
          </div>
          <div className="space-y-1">
            <FieldLabel>Twitter / X</FieldLabel>
            <input type="url" className={C} placeholder="https://x.com/yourhandle" value={s.vcTwitter || ""} onChange={(e) => set({ vcTwitter: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <FieldLabel>Facebook</FieldLabel>
              <input type="url" className={C} placeholder="facebook.com/..." value={s.vcFacebook || ""} onChange={(e) => set({ vcFacebook: e.target.value })} />
            </div>
            <div className="space-y-1">
              <FieldLabel>YouTube</FieldLabel>
              <input type="url" className={C} placeholder="youtube.com/..." value={s.vcYoutube || ""} onChange={(e) => set({ vcYoutube: e.target.value })} />
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );

  if (activeTab === "mecard") return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input className={C} placeholder="First Name" value={s.mcName} onChange={(e) => set({ mcName: e.target.value })} />
        <input className={C} placeholder="Reading (Kana)" value={s.mcReading} onChange={(e) => set({ mcReading: e.target.value })} />
      </div>
      <input type="tel" className={C} placeholder="Phone" value={s.mcPhone} onChange={(e) => set({ mcPhone: e.target.value })} />
      <input type="email" className={C} placeholder="Email" value={s.mcEmail} onChange={(e) => set({ mcEmail: e.target.value })} />
      <input className={C} placeholder="Address" value={s.mcAddress} onChange={(e) => set({ mcAddress: e.target.value })} />
      <input type="url" className={C} placeholder="Website" value={s.mcUrl} onChange={(e) => set({ mcUrl: e.target.value })} />
    </div>
  );

  if (activeTab === "location") return (
    <div className="space-y-3">
      <input type="url" className={C} placeholder="Google Maps Link (e.g. https://maps.app.goo.gl/...)" value={s.locUrl || ""} onChange={(e) => set({ locUrl: e.target.value })} />
      <div className="flex items-center gap-2 py-1">
        <div className="h-px bg-gray-200/60 flex-1"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">OR COORDINATES</span>
        <div className="h-px bg-gray-200/60 flex-1"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" step="any" className={C} placeholder="Latitude (e.g. 40.71)" value={s.lat} onChange={(e) => set({ lat: e.target.value })} />
        <input type="number" step="any" className={C} placeholder="Longitude (e.g. -74.00)" value={s.lng} onChange={(e) => set({ lng: e.target.value })} />
      </div>
    </div>
  );

  if (activeTab === "wifi") return (
    <div className="space-y-3">
      <input className={C} placeholder="Network Name (SSID)" value={s.wifiSsid} onChange={(e) => set({ wifiSsid: e.target.value })} />
      <input className={C} placeholder="Password" value={s.wifiPassword} onChange={(e) => set({ wifiPassword: e.target.value })} />
      <select className={C + " appearance-none cursor-pointer"} value={s.wifiEncryption} onChange={(e) => set({ wifiEncryption: e.target.value })}>
        <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Unencrypted</option>
      </select>
    </div>
  );

  if (activeTab === "event") return (
    <div className="space-y-3">
      <input className={C} placeholder="Event Title" value={s.evTitle} onChange={(e) => set({ evTitle: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500 uppercase">Start</label><input type="datetime-local" className={C} value={s.evStart} onChange={(e) => set({ evStart: e.target.value })} /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-gray-500 uppercase">End</label><input type="datetime-local" className={C} value={s.evEnd} onChange={(e) => set({ evEnd: e.target.value })} /></div>
      </div>
      <input className={C} placeholder="Location" value={s.evLocation} onChange={(e) => set({ evLocation: e.target.value })} />
      <textarea rows={2} className={C + " resize-none"} placeholder="Description" value={s.evDescription} onChange={(e) => set({ evDescription: e.target.value })} />
    </div>
  );

  if (activeTab === "bitcoin") return (
    <div className="space-y-3">
      <input className={C} placeholder="Bitcoin Address" value={s.btcAddress} onChange={(e) => set({ btcAddress: e.target.value })} />
      <input type="number" step="any" className={C} placeholder="Amount (BTC)" value={s.btcAmount} onChange={(e) => set({ btcAmount: e.target.value })} />
      <input className={C} placeholder="Message (optional)" value={s.btcMessage} onChange={(e) => set({ btcMessage: e.target.value })} />
    </div>
  );

  if (activeTab === "facebook") return <input type="url" className={C} placeholder="https://facebook.com/yourpage" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "twitter") return <input type="url" className={C} placeholder="https://twitter.com/yourhandle" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "youtube") return <input type="url" className={C} placeholder="https://youtube.com/watch?v=..." value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "social") return <input type="url" className={C} placeholder="https://instagram.com/yourprofile" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "appstore") return <input type="url" className={C} placeholder="App Store or Play Store URL" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "rating") return <input type="url" className={C} placeholder="Google Maps or Review Page URL" value={s.content} onChange={(e) => set({ content: e.target.value })} />;
  if (activeTab === "feedback") return <input type="url" className={C} placeholder="Feedback Form URL (Google Forms, Typeform, etc.)" value={s.content} onChange={(e) => set({ content: e.target.value })} />;

  if (activeTab === "mp3") return <FileUploadBox accept="audio/*" label="Upload MP3 / Audio File" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;
  if (activeTab === "video") return <FileUploadBox accept="video/*" label="Upload Video File" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;
  if (activeTab === "pdf") return <FileUploadBox accept=".pdf" label="Upload PDF Document (up to 20MB)" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;
  if (activeTab === "gallery") return <FileUploadBox accept="image/*" label="Upload Image for Gallery" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;

  return null;
}
