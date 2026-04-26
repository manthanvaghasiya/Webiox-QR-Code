"use client";

import { useState } from "react";
import QRCodeStyling from "qr-code-styling";
import formatQrData from "@/lib/formatQrData";

const INITIAL_FIELDS = {
  content: "", emailAddress: "", emailSubject: "", emailMessage: "",
  phone: "", smsPhone: "", smsMessage: "",
  vcFirstName: "", vcLastName: "", vcPhone: "", vcEmail: "", vcCompany: "", vcTitle: "", vcAddress: "", vcWebsite: "",
  mcName: "", mcReading: "", mcPhone: "", mcEmail: "", mcAddress: "", mcUrl: "",
  lat: "", lng: "",
  wifiSsid: "", wifiPassword: "", wifiEncryption: "WPA",
  evTitle: "", evStart: "", evEnd: "", evLocation: "", evDescription: "",
  btcAddress: "", btcAmount: "", btcMessage: "",
  uploadFile: null,
};

/**
 * Owns all QR styling/content state plus the generate/download methods.
 * The DOM container ref and qr-code-styling instance ref are passed in
 * by the consumer so the hook doesn't return refs (which would taint
 * property access under react-hooks/refs in Next.js 16).
 */
export default function useQrGenerator(qrCodeRef, qrCodeInstanceRef) {
  const [isGenerating, setIsGenerating] = useState(false);

  const [socialLinks, setSocialLinks] = useState([{ platform: "Instagram", url: "" }]);
  const [socialPageTitle, setSocialPageTitle] = useState("");
  const [socialPageDescription, setSocialPageDescription] = useState("");

  const [fields, setFields] = useState(INITIAL_FIELDS);
  const set = (partial) => setFields((prev) => ({ ...prev, ...partial }));

  const addSocialLink = () =>
    setSocialLinks((prev) => [...prev, { platform: "Instagram", url: "" }]);
  const removeSocialLink = (i) =>
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== i));
  const updateSocialLink = (i, field, value) =>
    setSocialLinks((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)),
    );

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#000000");
  const [gradientColor2, setGradientColor2] = useState("#4F46E5");
  const [gradientType, setGradientType] = useState("linear");
  const [useCustomEyeColor, setUseCustomEyeColor] = useState(false);
  const [eyeFrameColor, setEyeFrameColor] = useState("#000000");
  const [eyeBallColor, setEyeBallColor] = useState("#000000");
  const [logo, setLogo] = useState(null);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);
  const [dotPattern, setDotPattern] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [eyeBallStyle, setEyeBallStyle] = useState("square");
  const [qrSize, setQrSize] = useState(1000);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const isValid = (activeTab) => {
    const s = fields;
    switch (activeTab) {
      case "url": case "text": case "facebook": case "twitter": case "youtube":
      case "appstore": case "rating": case "feedback": return !!s.content.trim();
      case "social": return !!(socialPageTitle.trim() && socialLinks.some((l) => l.url.trim()));
      case "email": return !!s.emailAddress.trim();
      case "phone": return !!s.phone.trim();
      case "sms": return !!s.smsPhone.trim();
      case "vcard": return !!(s.vcFirstName.trim() || s.vcLastName.trim());
      case "mecard": return !!s.mcName.trim();
      case "location": return !!(s.lat && s.lng);
      case "wifi": return !!s.wifiSsid.trim();
      case "event": return !!(s.evTitle.trim() && s.evStart);
      case "bitcoin": return !!s.btcAddress.trim();
      case "mp3": case "video": case "pdf": case "gallery": return !!s.uploadFile;
      default: return false;
    }
  };

  const generateQR = async (activeTab) => {
    if (!isValid(activeTab) || isGenerating) return;
    setIsGenerating(true);
    try {
      let finalContent;

      if (activeTab === "social") {
        const res = await fetch("/api/qrcodes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isDynamic: true,
            pageConfig: {
              title: socialPageTitle,
              description: socialPageDescription,
              links: socialLinks.filter((l) => l.url.trim()),
            },
            fgColor, bgColor, hasLogo: !!logo,
          }),
        });
        const data = await res.json();
        if (!data.dynamicUrl) { setIsGenerating(false); return; }
        finalContent = data.dynamicUrl;
      } else {
        finalContent = await formatQrData(activeTab, fields);
        if (!finalContent) { setIsGenerating(false); return; }
      }

      const dotsOpts = { type: dotPattern };
      if (useGradient) {
        dotsOpts.gradient = {
          type: gradientType, rotation: 0,
          colorStops: [
            { offset: 0, color: gradientColor1 },
            { offset: 1, color: gradientColor2 },
          ],
        };
      } else {
        dotsOpts.color = fgColor;
      }

      const cornersOpts = { type: cornerStyle };
      if (useCustomEyeColor) cornersOpts.color = eyeFrameColor;
      else if (useGradient)
        cornersOpts.gradient = {
          type: gradientType, rotation: 0,
          colorStops: [
            { offset: 0, color: gradientColor1 },
            { offset: 1, color: gradientColor2 },
          ],
        };
      else cornersOpts.color = fgColor;

      const cornersDotOpts = { type: eyeBallStyle };
      if (useCustomEyeColor) cornersDotOpts.color = eyeBallColor;
      else if (useGradient)
        cornersDotOpts.gradient = {
          type: gradientType, rotation: 0,
          colorStops: [
            { offset: 0, color: gradientColor1 },
            { offset: 1, color: gradientColor2 },
          ],
        };
      else cornersDotOpts.color = fgColor;

      const qrCode = new QRCodeStyling({
        width: qrSize, height: qrSize, data: finalContent,
        image: logo || undefined,
        dotsOptions: dotsOpts,
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: cornersOpts,
        cornersDotOptions: cornersDotOpts,
        imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.4, hideBackgroundDots },
      });
      qrCodeInstanceRef.current = qrCode;
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = "";
        qrCode.append(qrCodeRef.current);
      }
      setQrCodeUrl("generated");

      if (activeTab !== "social") {
        fetch("/api/qrcodes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: finalContent, fgColor, bgColor, hasLogo: !!logo }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Error generating QR code", err);
    }
    setIsGenerating(false);
  };

  const downloadQR = (ext) => {
    if (qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current.download({ name: "webiox-qr", extension: ext });
    }
  };

  const handleLogoUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setLogo(URL.createObjectURL(f));
  };

  return {
    isGenerating, qrCodeUrl,
    isValid, generateQR, downloadQR,
    socialLinks, addSocialLink, removeSocialLink, updateSocialLink,
    socialPageTitle, setSocialPageTitle,
    socialPageDescription, setSocialPageDescription,
    fields, set,
    fgColor, setFgColor, bgColor, setBgColor,
    useGradient, setUseGradient,
    gradientColor1, setGradientColor1,
    gradientColor2, setGradientColor2,
    gradientType, setGradientType,
    useCustomEyeColor, setUseCustomEyeColor,
    eyeFrameColor, setEyeFrameColor,
    eyeBallColor, setEyeBallColor,
    logo, setLogo, handleLogoUpload,
    hideBackgroundDots, setHideBackgroundDots,
    dotPattern, setDotPattern,
    cornerStyle, setCornerStyle,
    eyeBallStyle, setEyeBallStyle,
    qrSize, setQrSize,
  };
}
