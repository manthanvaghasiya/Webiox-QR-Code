"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";
import formatQrData from "@/lib/formatQrData";

const INITIAL_FIELDS = {
  content: "", emailAddress: "", emailSubject: "", emailMessage: "",
  phone: "", smsPhone: "", smsMessage: "",
  vcFirstName: "", vcLastName: "", vcPhone: "", vcWorkPhone: "", vcFax: "",
  vcEmail: "", vcCompany: "", vcTitle: "",
  vcStreet: "", vcCity: "", vcState: "", vcZip: "", vcCountry: "",
  vcAddress: "", vcWebsite: "", vcSummary: "", vcImage: null,
  vcLinkedin: "", vcInstagram: "", vcTwitter: "", vcFacebook: "", vcYoutube: "",
  mcName: "", mcReading: "", mcPhone: "", mcEmail: "", mcAddress: "", mcCity: "", mcUrl: "", mcBio: "",
  mcLinkedin: "", mcInstagram: "", mcTwitter: "", mcFacebook: "", mcYoutube: "",
  lat: "", lng: "", locUrl: "",
  wifiSsid: "", wifiPassword: "", wifiEncryption: "WPA",
  evTitle: "", evStart: "", evEnd: "", evLocation: "", evDescription: "",
  btcAddress: "", btcAmount: "", btcMessage: "",
  asName: "", asDesc: "", asIos: "", asAndroid: "", asWeb: "",
  uploadFile: null,
};

/**
 * Owns ALL QR styling/content state plus generate/download methods.
 * Lifted to generator/page.js so both shells share the same instance.
 */
export default function useQrGenerator(qrCodeRef, qrCodeInstanceRef) {
  // ── Active tab ──
  const [activeTab, _setActiveTab] = useState("url");

  // ── Generating / preview state ──
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // ── Last created hosted page (for showing edit link panel) ──
  const [lastCreatedPage, setLastCreatedPage] = useState(null);

  // Wrap setActiveTab to clear the success panel on tab switch
  const setActiveTab = useCallback((tab) => {
    _setActiveTab(tab);
    setLastCreatedPage(null);
  }, []);

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
      case "rating": case "feedback": return !!s.content.trim();
      case "appstore": return !!s.asName.trim() && !!(s.asIos.trim() || s.asAndroid.trim() || s.asWeb.trim());
      case "social": return !!(socialPageTitle.trim() && socialLinks.some((l) => l.url.trim()));
      case "email": return !!s.emailAddress.trim();
      case "phone": return !!s.phone.trim();
      case "sms": return !!s.smsPhone.trim();
      case "vcard": return !!(s.vcCompany.trim() || s.vcFirstName.trim() || s.vcLastName.trim());
      case "mecard": return !!s.mcName.trim();
      case "location": return !!(s.locUrl?.trim() || (s.lat && s.lng));
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
    // Map custom pattern names to qr-code-styling supported types
    const mappedDotPattern = dotPattern === "diamond" ? "classy" : dotPattern;
    const dotsOpts = { type: mappedDotPattern };
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
      imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.3, hideBackgroundDots },
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

      if (currentTab === "social" || currentTab === "vcard" || currentTab === "mecard" || currentTab === "appstore") {
        if (skipSave) {
          // For auto-preview of design changes, use the existing URL or a placeholder
          finalContent = lastCreatedPage?.pageUrl || `https://dukaancard.com/preview`;
        } else {
          const pagePayload = {
            type: currentTab,
            config: currentTab === "social" ? {
              pageTitle: socialPageTitle,
              pageDescription: socialPageDescription,
              links: socialLinks.filter((l) => l.url.trim()),
            } : fields, // Send all fields for vcard and mecard
            theme: { bgColor, textColor: fgColor },
            meta: currentTab === "social"
              ? { title: socialPageTitle, description: socialPageDescription }
              : currentTab === "mecard"
                ? { title: fields.mcName.trim() || "My Profile", description: fields.mcBio }
                : currentTab === "appstore"
                  ? { title: fields.asName.trim() || "Download App", description: fields.asDesc }
                  : { title: fields.vcCompany || `${fields.vcFirstName} ${fields.vcLastName}`.trim(), description: fields.vcTitle },
          };
          
          const res = await fetch("/api/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pagePayload),
          });
          const data = await res.json();
          if (!data.pageUrl) { setIsGenerating(false); return; }
          finalContent = data.pageUrl;
          setLastCreatedPage({
            shortId: data.shortId,
            editToken: data.editToken,
            pageUrl: data.pageUrl,
            editUrl: data.editUrl,
          });
        }
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
      if (!skipSave && currentTab !== "social" && currentTab !== "vcard" && currentTab !== "mecard" && currentTab !== "appstore") {
        const hash = finalContent + fgColor + bgColor + (logo ? "logo" : "");
        if (!savedHashesRef.current.has(hash)) {
          savedHashesRef.current.add(hash);
          const designPayload = {
            fgColor, bgColor, useGradient, gradientColor1, gradientColor2, gradientType,
            useCustomEyeColor, eyeFrameColor, eyeBallColor, dotPattern, cornerStyle, eyeBallStyle,
            logo, errorCorrectionLevel, frameStyle, frameText, frameTextColor, frameFillColor
          };
          fetch("/api/qrcodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: finalContent, type: currentTab, design: designPayload }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Error generating QR code", err);
    }
    setIsGenerating(false);
  }, [activeTab, isValid, isGenerating, socialPageTitle, socialPageDescription,
    socialLinks, fgColor, bgColor, logo, fields, buildQrOptions, qrCodeRef, qrCodeInstanceRef, lastCreatedPage]);

  // ── Real-time preview with debounce ──
  useEffect(() => {
    if (!isValidCurrent()) return;
    // Skip file-upload tabs for auto-preview (they need server upload)
    if (["mp3", "video", "pdf", "gallery"].includes(activeTab)) return;

    const t = setTimeout(() => {
      generateQR({ skipSave: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fields, fgColor, bgColor, useGradient, gradientColor1,
    gradientColor2, gradientType, useCustomEyeColor, eyeFrameColor,
    eyeBallColor, dotPattern, cornerStyle, eyeBallStyle, qrSize,
    logo, hideBackgroundDots, errorCorrectionLevel, frameStyle,
    frameText, frameTextColor, frameFillColor, frameBorderColor]);

  // ── Download ──
  const downloadQR = useCallback(async (ext) => {
    if (!qrCodeInstanceRef.current) return;
    setLastFormat(ext);

    // For first download, save to DB (dynamic pages save separately during generation)
    if (activeTab !== "social" && activeTab !== "vcard" && activeTab !== "mecard" && activeTab !== "appstore") {
      try {
        const finalContent = await formatQrData(activeTab, fields);
        if (finalContent) {
          const hash = finalContent + fgColor + bgColor + (logo ? "logo" : "");
          if (!savedHashesRef.current.has(hash)) {
            savedHashesRef.current.add(hash);
            const designPayload = {
              fgColor, bgColor, useGradient, gradientColor1, gradientColor2, gradientType,
              useCustomEyeColor, eyeFrameColor, eyeBallColor, dotPattern, cornerStyle, eyeBallStyle,
              logo, errorCorrectionLevel, frameStyle, frameText, frameTextColor, frameFillColor
            };
            fetch("/api/qrcodes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: finalContent, type: activeTab, design: designPayload }),
            }).catch(() => {});
          }
        }
      } catch { /* ignore */ }
    }

    // ── When a frame is active, capture QR+frame via html2canvas ──
    if (frameStyle && frameStyle !== "none" && qrCodeRef.current) {
      try {
        const html2canvas = (await import("html2canvas")).default;
        // The frame wrapper is the parent of the qr container div
        const frameEl = qrCodeRef.current.closest("[data-frame-wrapper]") || qrCodeRef.current.parentElement;
        const canvas = await html2canvas(frameEl, {
          backgroundColor: null,
          scale: 3, // high-res
          useCORS: true,
          logging: false,
        });

        if (ext === "pdf") {
          const { jsPDF } = await import("jspdf");
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const ratio = canvas.width / canvas.height;
          let qrW = Math.min(pageW - 40, 120);
          let qrH = qrW / ratio;
          if (qrH > pageH - 40) { qrH = pageH - 40; qrW = qrH * ratio; }
          const x = (pageW - qrW) / 2;
          const y = (pageH - qrH) / 2 - 10;
          pdf.addImage(imgData, "PNG", x, y, qrW, qrH);
          pdf.save("webiox-qr.pdf");
          return;
        }

        if (ext === "svg") {
          // SVG not supported for framed export, fallback to PNG
          const link = document.createElement("a");
          link.download = "webiox-qr.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
          return;
        }

        const mimeType = ext === "jpg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
        const link = document.createElement("a");
        link.download = `webiox-qr.${ext}`;
        link.href = canvas.toDataURL(mimeType, 0.95);
        link.click();
        return;
      } catch (err) {
        console.error("Frame export error, falling back:", err);
        // Fallback to non-frame export below
      }
    }

    if (ext === "pdf") {
      try {
        const { jsPDF } = await import("jspdf");
        const blob = await qrCodeInstanceRef.current.getRawData("png");
        const reader = new FileReader();
        reader.onload = () => {
          const imgData = reader.result;
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          const qrMm = Math.min(pageW - 40, 120);
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
  }, [qrCodeInstanceRef, qrCodeRef, activeTab, fields, fgColor, bgColor, logo,
    transparentBg, buildQrOptions, frameStyle]);

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
    setLastCreatedPage(null);
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
    lastCreatedPage, setLastCreatedPage,
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
