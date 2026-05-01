/**
 * Formats QR data string based on the active tab type.
 * For file-based tabs, uploads to Vercel Blob first.
 */

// RFC 6350 (vCard) text-value escaping: backslash, newline, comma, semicolon.
const escVCard = (v) =>
  String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

// meCard spec escaping: backslash, semicolon, colon (commas are valid).
const escMeCard = (v) =>
  String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/:/g, "\\:");

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
      if (s.vcPhone) lines.push(`TEL;TYPE=CELL:${escVCard(s.vcPhone)}`);
      if (s.vcWorkPhone) lines.push(`TEL;TYPE=WORK:${escVCard(s.vcWorkPhone)}`);
      if (s.vcFax) lines.push(`TEL;TYPE=FAX:${escVCard(s.vcFax)}`);
      if (s.vcEmail) lines.push(`EMAIL:${escVCard(s.vcEmail)}`);
      if (s.vcCompany) lines.push(`ORG:${escVCard(s.vcCompany)}`);
      if (s.vcTitle) lines.push(`TITLE:${escVCard(s.vcTitle)}`);
      // Structured address: PO Box;Extended;Street;City;State;ZIP;Country
      const hasStructuredAddr = s.vcStreet || s.vcCity || s.vcState || s.vcZip || s.vcCountry;
      if (hasStructuredAddr) {
        lines.push(`ADR;TYPE=WORK:;;${escVCard(s.vcStreet || "")};${escVCard(s.vcCity || "")};${escVCard(s.vcState || "")};${escVCard(s.vcZip || "")};${escVCard(s.vcCountry || "")}`);
      } else if (s.vcAddress) {
        lines.push(`ADR:;;${escVCard(s.vcAddress)};;;;`);
      }
      if (s.vcWebsite) lines.push(`URL:${escVCard(s.vcWebsite)}`);
      if (s.vcSummary) lines.push(`NOTE:${escVCard(s.vcSummary)}`);
      // Social media as X-properties
      if (s.vcLinkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escVCard(s.vcLinkedin)}`);
      if (s.vcInstagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${escVCard(s.vcInstagram)}`);
      if (s.vcTwitter) lines.push(`X-SOCIALPROFILE;TYPE=twitter:${escVCard(s.vcTwitter)}`);
      if (s.vcFacebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${escVCard(s.vcFacebook)}`);
      if (s.vcYoutube) lines.push(`X-SOCIALPROFILE;TYPE=youtube:${escVCard(s.vcYoutube)}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "mecard": {
      let mc = `MECARD:N:${escMeCard(s.mcName)};`;
      if (s.mcPhone) mc += `TEL:${escMeCard(s.mcPhone)};`;
      if (s.mcEmail) mc += `EMAIL:${escMeCard(s.mcEmail)};`;
      if (s.mcAddress) mc += `ADR:${escMeCard(s.mcAddress)};`;
      if (s.mcUrl) mc += `URL:${escMeCard(s.mcUrl)};`;
      mc += ";";
      return mc;
    }

    case "location":
      if (s.locUrl) return s.locUrl;
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
