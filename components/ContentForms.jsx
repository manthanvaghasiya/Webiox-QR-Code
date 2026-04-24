"use client";
import { Upload } from "lucide-react";

const C = "w-full p-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md";

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

  if (activeTab === "vcard") return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input className={C} placeholder="First Name" value={s.vcFirstName} onChange={(e) => set({ vcFirstName: e.target.value })} />
        <input className={C} placeholder="Last Name" value={s.vcLastName} onChange={(e) => set({ vcLastName: e.target.value })} />
      </div>
      <input type="tel" className={C} placeholder="Phone" value={s.vcPhone} onChange={(e) => set({ vcPhone: e.target.value })} />
      <input type="email" className={C} placeholder="Email" value={s.vcEmail} onChange={(e) => set({ vcEmail: e.target.value })} />
      <input className={C} placeholder="Company" value={s.vcCompany} onChange={(e) => set({ vcCompany: e.target.value })} />
      <input className={C} placeholder="Job Title" value={s.vcTitle} onChange={(e) => set({ vcTitle: e.target.value })} />
      <input className={C} placeholder="Address" value={s.vcAddress} onChange={(e) => set({ vcAddress: e.target.value })} />
      <input type="url" className={C} placeholder="Website" value={s.vcWebsite} onChange={(e) => set({ vcWebsite: e.target.value })} />
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
      <div className="grid grid-cols-2 gap-3">
        <input type="number" step="any" className={C} placeholder="Latitude (e.g. 40.7128)" value={s.lat} onChange={(e) => set({ lat: e.target.value })} />
        <input type="number" step="any" className={C} placeholder="Longitude (e.g. -74.0060)" value={s.lng} onChange={(e) => set({ lng: e.target.value })} />
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
  if (activeTab === "pdf") return <FileUploadBox accept=".pdf" label="Upload PDF Document" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;
  if (activeTab === "gallery") return <FileUploadBox accept="image/*" label="Upload Image for Gallery" file={s.uploadFile} onChange={(f) => set({ uploadFile: f })} />;

  return null;
}
