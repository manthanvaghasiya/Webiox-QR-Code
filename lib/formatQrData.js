/**
 * Formats QR data string based on the active tab type.
 * For file-based tabs, uploads to Vercel Blob first.
 */

// RFC 6350 (vCard) and meCard text-value escaping: backslash, newline, comma, semicolon.
const escVCard = (v) =>
  String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

// Wi-Fi Alliance QR spec: escape \ ; , " : in SSID and password values.
const escWifi = (v) => String(v ?? "").replace(/([\\;,":])/g, "\\$1");

// iCal DTSTART/DTEND in UTC: YYYYMMDDTHHMMSSZ.
// Input from <input type="datetime-local"> is "YYYY-MM-DDTHH:MM" interpreted as local time.
const fmtICalUTC = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
};

export default async function formatQrData(activeTab, s) {
  switch (activeTab) {
    case "url":
    case "text":
    case "facebook":
    case "twitter":
    case "youtube":
    case "social":
    case "appstore":
    case "rating":
    case "feedback":
      return s.content || "";

    case "email":
      return `mailto:${s.emailAddress}?subject=${encodeURIComponent(s.emailSubject || "")}&body=${encodeURIComponent(s.emailMessage || "")}`;

    case "phone":
      return `tel:${s.phone || ""}`;

    case "sms":
      return `SMSTO:${s.smsPhone || ""}:${s.smsMessage || ""}`;

    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escVCard(s.vcLastName)};${escVCard(s.vcFirstName)};;;`,
        `FN:${escVCard(`${s.vcFirstName || ""} ${s.vcLastName || ""}`.trim())}`,
      ];
      if (s.vcPhone) lines.push(`TEL:${escVCard(s.vcPhone)}`);
      if (s.vcEmail) lines.push(`EMAIL:${escVCard(s.vcEmail)}`);
      if (s.vcCompany) lines.push(`ORG:${escVCard(s.vcCompany)}`);
      if (s.vcTitle) lines.push(`TITLE:${escVCard(s.vcTitle)}`);
      if (s.vcAddress) lines.push(`ADR:;;${escVCard(s.vcAddress)};;;;`);
      if (s.vcWebsite) lines.push(`URL:${escVCard(s.vcWebsite)}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "mecard": {
      let mc = `MECARD:N:${escVCard(s.mcName)};`;
      if (s.mcPhone) mc += `TEL:${escVCard(s.mcPhone)};`;
      if (s.mcEmail) mc += `EMAIL:${escVCard(s.mcEmail)};`;
      if (s.mcAddress) mc += `ADR:${escVCard(s.mcAddress)};`;
      if (s.mcUrl) mc += `URL:${escVCard(s.mcUrl)};`;
      mc += ";";
      return mc;
    }

    case "location":
      return `geo:${s.lat || 0},${s.lng || 0}`;

    case "wifi":
      return `WIFI:T:${s.wifiEncryption || "WPA"};S:${escWifi(s.wifiSsid)};P:${escWifi(s.wifiPassword)};;`;

    case "event": {
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${escVCard(s.evTitle)}`,
        `DTSTART:${fmtICalUTC(s.evStart)}`,
        `DTEND:${fmtICalUTC(s.evEnd)}`,
      ];
      if (s.evLocation) lines.push(`LOCATION:${escVCard(s.evLocation)}`);
      if (s.evDescription) lines.push(`DESCRIPTION:${escVCard(s.evDescription)}`);
      lines.push("END:VEVENT", "END:VCALENDAR");
      return lines.join("\n");
    }

    case "bitcoin": {
      let uri = `bitcoin:${s.btcAddress || ""}`;
      const params = [];
      if (s.btcAmount) params.push(`amount=${s.btcAmount}`);
      if (s.btcMessage) params.push(`message=${encodeURIComponent(s.btcMessage)}`);
      if (params.length) uri += "?" + params.join("&");
      return uri;
    }

    case "mp3":
    case "video":
    case "pdf":
    case "gallery": {
      if (!s.uploadFile) return "";
      const formData = new FormData();
      formData.append("file", s.uploadFile);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) return data.url;
      throw new Error(data.error || "Upload failed");
    }

    default:
      return s.content || "";
  }
}
