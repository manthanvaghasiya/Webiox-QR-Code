"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
 * Owns ALL QR styling/content state plus generate/download methods.
 * Lifted to generator/page.js so both shells share the same instance.
 */
export default function useQrGenerator(qrCodeRef, qrCodeInstanceRef) {
  // ── Active tab ──
  const [activeTab, setActiveTab] = useState("url");

  // ── Generating / preview state ──
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // ── Social links (for "social" tab) ──
  const [socialLinks, setSocialLinks] = useState([{ platform: "Instagram", url: "" }]);
  const [socialPageTitle, setSocialPageTitle] = useState("");
  const [socialPageDescription, setSocialPageDescription] = useState("");

  // ── Content fields ──
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

  // ── Color state ──
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#000000");
  const [gradientColor2, setGradientColor2] = useState("#4F46E5");
  const [gradientType, setGradientType] = useState("linear");
  const [useCustomEyeColor, setUseCustomEyeColor] = useState(false);
  const [eyeFrameColor, setEyeFrameColor] = useState("#000000");
  const [eyeBallColor, setEyeBallColor] = useState("#000000");

  // ── Logo state ──
  const [logo, setLogo] = useState(null);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);

  // ── Design state ──
  const [dotPattern, setDotPattern] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("square");
  const [eyeBallStyle, setEyeBallStyle] = useState("square");
  const [qrSize, setQrSize] = useState(1000);

  // ── Error Correction Level ──
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");

  // ── Frame state ──
  const [frameStyle, setFrameStyle] = useState("none");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [frameTextColor, setFrameTextColor] = useState("#FFFFFF");
  const [frameFillColor, setFrameFillColor] = useState("#4F46E5");
  const [frameBorderColor, setFrameBorderColor] = useState("transparent");

  // ── Transparent background toggle ──
  const [transparentBg, setTransparentBg] = useState(false);

  // ── Download state ──
  const [lastFormat, setLastFormat] = useState("png");

  // ── Content hash for dedup writes ──
  const savedHashesRef = useRef(new Set());

  // ── Logo setter that auto-adjusts ECC ──
  const setLogoAndUpdateEcc = useCallback((newLogo) => {
    setLogo(newLogo);
    setErrorCorrectionLevel(newLogo ? "H" : "M");
  }, []);

  // ── Validation ──
  const isValid = useCallback((tab) => {
    const s = fields;
    switch (tab) {
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
  }, [fields, socialPageTitle, socialLinks]);

  const isValidCurrent = useCallback(() => isValid(activeTab), [isValid, activeTab]);

  // ── Build QRCodeStyling options ──
  const buildQrOptions = useCallback((data, overrideBg) => {
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

    return {
      width: qrSize, height: qrSize, data,
      image: logo || undefined,
      qrOptions: { errorCorrectionLevel },
      dotsOptions: dotsOpts,
      backgroundOptions: { color: overrideBg ?? bgColor },
      cornersSquareOptions: cornersOpts,
      cornersDotOptions: cornersDotOpts,
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.4, hideBackgroundDots },
    };
  }, [dotPattern, useGradient, gradientType, gradientColor1, gradientColor2,
    fgColor, cornerStyle, useCustomEyeColor, eyeFrameColor, eyeBallStyle,
    eyeBallColor, bgColor, qrSize, logo, errorCorrectionLevel, hideBackgroundDots]);

  // ── Generate QR Code ──
  const generateQR = useCallback(async (opts = {}) => {
    const { skipSave = false, tab } = opts;
    const currentTab = tab ?? activeTab;
    if (!isValid(currentTab) || isGenerating) return;
    setIsGenerating(true);
    try {
      let finalContent;

      if (currentTab === "social") {
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
        finalContent = await formatQrData(currentTab, fields);
        if (!finalContent) { setIsGenerating(false); return; }
      }

      const qrCode = new QRCodeStyling(buildQrOptions(finalContent));
      qrCodeInstanceRef.current = qrCode;
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = "";
        qrCode.append(qrCodeRef.current);
      }
      setQrCodeUrl("generated");

      // Save to DB only on explicit download, not on preview
      if (!skipSave && currentTab !== "social") {
        const hash = finalContent + fgColor + bgColor + (logo ? "logo" : "");
        if (!savedHashesRef.current.has(hash)) {
          savedHashesRef.current.add(hash);
          fetch("/api/qrcodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: finalContent, fgColor, bgColor, hasLogo: !!logo }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Error generating QR code", err);
    }
    setIsGenerating(false);
  }, [activeTab, isValid, isGenerating, socialPageTitle, socialPageDescription,
    socialLinks, fgColor, bgColor, logo, fields, buildQrOptions, qrCodeRef, qrCodeInstanceRef]);

  // ── Real-time preview with debounce ──
  useEffect(() => {
    if (!isValidCurrent()) return;
    // Skip file-upload tabs for auto-preview (they need server upload)
    if (["mp3", "video", "pdf", "gallery"].includes(activeTab)) return;
    // Skip social tab (needs API call to create dynamic page)
    if (activeTab === "social") return;

    const t = setTimeout(() => {
      generateQR({ skipSave: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fields, fgColor, bgColor, useGradient, gradientColor1,
    gradientColor2, gradientType, useCustomEyeColor, eyeFrameColor,
    eyeBallColor, dotPattern, cornerStyle, eyeBallStyle, qrSize,
    logo, hideBackgroundDots, errorCorrectionLevel]);

  // ── Download ──
  const downloadQR = useCallback(async (ext) => {
    if (!qrCodeInstanceRef.current) return;
    setLastFormat(ext);

    // For first download, save to DB
    if (activeTab !== "social") {
      try {
        const finalContent = await formatQrData(activeTab, fields);
        if (finalContent) {
          const hash = finalContent + fgColor + bgColor + (logo ? "logo" : "");
          if (!savedHashesRef.current.has(hash)) {
            savedHashesRef.current.add(hash);
            fetch("/api/qrcodes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: finalContent, fgColor, bgColor, hasLogo: !!logo }),
            }).catch(() => {});
          }
        }
      } catch { /* ignore */ }
    }

    if (ext === "pdf") {
      try {
        const { jsPDF } = await import("jspdf");
        // Get QR as PNG data URL from the instance
        const blob = await qrCodeInstanceRef.current.getRawData("png");
        const reader = new FileReader();
        reader.onload = () => {
          const imgData = reader.result;
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const qrMm = Math.min(pageW - 40, 120); // max 120mm QR
          const x = (pageW - qrMm) / 2;
          const y = (pageH - qrMm) / 2 - 10;
          pdf.addImage(imgData, "PNG", x, y, qrMm, qrMm);
          pdf.save("webiox-qr.pdf");
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("PDF export error", err);
      }
      return;
    }

    // For transparent bg export
    if (transparentBg && ["png", "webp", "svg"].includes(ext)) {
      // Re-render with transparent bg then download
      try {
        const finalContent = await formatQrData(activeTab, fields);
        if (!finalContent) return;
        const tempQr = new QRCodeStyling(buildQrOptions(finalContent, "transparent"));
        tempQr.download({ name: "webiox-qr", extension: ext });
      } catch (err) {
        console.error("Transparent export error", err);
      }
      return;
    }

    const extension = ext === "jpg" ? "jpeg" : ext;
    qrCodeInstanceRef.current.download({ name: "webiox-qr", extension });
  }, [qrCodeInstanceRef, activeTab, fields, fgColor, bgColor, logo,
    transparentBg, buildQrOptions]);

  // ── Logo upload ──
  const handleLogoUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setLogoAndUpdateEcc(URL.createObjectURL(f));
  };

  // ── Apply template (bulk set style state) ──
  const applyTemplate = useCallback((t) => {
    if (t.dotPattern !== undefined) setDotPattern(t.dotPattern);
    if (t.cornerStyle !== undefined) setCornerStyle(t.cornerStyle);
    if (t.eyeBallStyle !== undefined) setEyeBallStyle(t.eyeBallStyle);
    if (t.fgColor !== undefined) setFgColor(t.fgColor);
    if (t.bgColor !== undefined) setBgColor(t.bgColor);
    if (t.useGradient !== undefined) setUseGradient(t.useGradient);
    if (t.gradientColor1 !== undefined) setGradientColor1(t.gradientColor1);
    if (t.gradientColor2 !== undefined) setGradientColor2(t.gradientColor2);
    if (t.gradientType !== undefined) setGradientType(t.gradientType);
    if (t.frameStyle !== undefined) setFrameStyle(t.frameStyle);
    if (t.frameText !== undefined) setFrameText(t.frameText);
    if (t.frameTextColor !== undefined) setFrameTextColor(t.frameTextColor);
    if (t.frameFillColor !== undefined) setFrameFillColor(t.frameFillColor);
    if (t.useCustomEyeColor !== undefined) setUseCustomEyeColor(t.useCustomEyeColor);
    if (t.eyeFrameColor !== undefined) setEyeFrameColor(t.eyeFrameColor);
    if (t.eyeBallColor !== undefined) setEyeBallColor(t.eyeBallColor);
  }, []);

  // ── Reset all ──
  const resetAll = useCallback(() => {
    setFields(INITIAL_FIELDS);
    setFgColor("#000000");
    setBgColor("#ffffff");
    setUseGradient(false);
    setGradientColor1("#000000");
    setGradientColor2("#4F46E5");
    setGradientType("linear");
    setUseCustomEyeColor(false);
    setEyeFrameColor("#000000");
    setEyeBallColor("#000000");
    setLogo(null);
    setHideBackgroundDots(true);
    setDotPattern("square");
    setCornerStyle("square");
    setEyeBallStyle("square");
    setQrSize(1000);
    setErrorCorrectionLevel("M");
    setFrameStyle("none");
    setFrameText("SCAN ME");
    setFrameTextColor("#FFFFFF");
    setFrameFillColor("#4F46E5");
    setFrameBorderColor("transparent");
    setTransparentBg(false);
    setQrCodeUrl("");
    setSocialLinks([{ platform: "Instagram", url: "" }]);
    setSocialPageTitle("");
    setSocialPageDescription("");
    if (qrCodeRef.current) qrCodeRef.current.innerHTML = "";
  }, [qrCodeRef]);

  return {
    // Tab
    activeTab, setActiveTab,
    // Generating
    isGenerating, qrCodeUrl,
    isValid, isValidCurrent, generateQR, downloadQR,
    // Social
    socialLinks, addSocialLink, removeSocialLink, updateSocialLink,
    socialPageTitle, setSocialPageTitle,
    socialPageDescription, setSocialPageDescription,
    // Fields
    fields, set,
    // Colors
    fgColor, setFgColor, bgColor, setBgColor,
    useGradient, setUseGradient,
    gradientColor1, setGradientColor1,
    gradientColor2, setGradientColor2,
    gradientType, setGradientType,
    useCustomEyeColor, setUseCustomEyeColor,
    eyeFrameColor, setEyeFrameColor,
    eyeBallColor, setEyeBallColor,
    // Logo
    logo, setLogo: setLogoAndUpdateEcc, handleLogoUpload,
    hideBackgroundDots, setHideBackgroundDots,
    // Design
    dotPattern, setDotPattern,
    cornerStyle, setCornerStyle,
    eyeBallStyle, setEyeBallStyle,
    qrSize, setQrSize,
    // ECC
    errorCorrectionLevel, setErrorCorrectionLevel,
    // Frame
    frameStyle, setFrameStyle,
    frameText, setFrameText,
    frameTextColor, setFrameTextColor,
    frameFillColor, setFrameFillColor,
    frameBorderColor, setFrameBorderColor,
    // Transparent
    transparentBg, setTransparentBg,
    // Download
    lastFormat, setLastFormat,
    // Template
    applyTemplate,
    // Reset
    resetAll,
  };
}
