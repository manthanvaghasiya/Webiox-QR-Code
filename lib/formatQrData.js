/**
 * Formats QR data string based on the active tab type.
 * For file-based tabs, uploads to Vercel Blob first.
 */
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
        `N:${s.vcLastName || ""};${s.vcFirstName || ""};;;`,
        `FN:${s.vcFirstName || ""} ${s.vcLastName || ""}`.trim(),
      ];
      if (s.vcPhone) lines.push(`TEL:${s.vcPhone}`);
      if (s.vcEmail) lines.push(`EMAIL:${s.vcEmail}`);
      if (s.vcCompany) lines.push(`ORG:${s.vcCompany}`);
      if (s.vcTitle) lines.push(`TITLE:${s.vcTitle}`);
      if (s.vcAddress) lines.push(`ADR:;;${s.vcAddress};;;;`);
      if (s.vcWebsite) lines.push(`URL:${s.vcWebsite}`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "mecard": {
      let mc = `MECARD:N:${s.mcName || ""};`;
      if (s.mcPhone) mc += `TEL:${s.mcPhone};`;
      if (s.mcEmail) mc += `EMAIL:${s.mcEmail};`;
      if (s.mcAddress) mc += `ADR:${s.mcAddress};`;
      if (s.mcUrl) mc += `URL:${s.mcUrl};`;
      mc += ";";
      return mc;
    }

    case "location":
      return `geo:${s.lat || 0},${s.lng || 0}`;

    case "wifi":
      return `WIFI:T:${s.wifiEncryption || "WPA"};S:${s.wifiSsid || ""};P:${s.wifiPassword || ""};;`;

    case "event": {
      const fmt = (dt) => dt ? dt.replace(/[-:]/g, "").replace("T", "T") + "00" : "";
      const lines = [
        "BEGIN:VCALENDAR",
        "BEGIN:VEVENT",
        `SUMMARY:${s.evTitle || ""}`,
        `DTSTART:${fmt(s.evStart)}`,
        `DTEND:${fmt(s.evEnd)}`,
      ];
      if (s.evLocation) lines.push(`LOCATION:${s.evLocation}`);
      if (s.evDescription) lines.push(`DESCRIPTION:${s.evDescription}`);
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
