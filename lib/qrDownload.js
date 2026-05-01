"use client";

import QRCodeStyling from "qr-code-styling";

function buildOptions(qr, size = 1024) {
  const { design = {}, destination, staticContent, isDynamic, shortId } = qr;

  const dotsOpts = { type: design.dotPattern || "square" };
  if (design.useGradient) {
    dotsOpts.gradient = {
      type: design.gradientType || "linear",
      rotation: 0,
      colorStops: [
        { offset: 0, color: design.gradientColor1 || "#000000" },
        { offset: 1, color: design.gradientColor2 || "#000000" },
      ],
    };
  } else {
    dotsOpts.color = design.fgColor || "#000000";
  }

  const cornersOpts = { type: design.cornerStyle || "square" };
  if (design.useCustomEyeColor) cornersOpts.color = design.eyeFrameColor;
  else if (design.useGradient) cornersOpts.gradient = dotsOpts.gradient;
  else cornersOpts.color = design.fgColor || "#000000";

  const cornersDotOpts = { type: design.eyeBallStyle || "square" };
  if (design.useCustomEyeColor) cornersDotOpts.color = design.eyeBallColor;
  else if (design.useGradient) cornersDotOpts.gradient = dotsOpts.gradient;
  else cornersDotOpts.color = design.fgColor || "#000000";

  const data = isDynamic
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${shortId}`
    : staticContent || destination || "";

  return {
    width: size,
    height: size,
    data,
    image: design.logo || undefined,
    qrOptions: { errorCorrectionLevel: design.errorCorrectionLevel || "M" },
    dotsOptions: dotsOpts,
    backgroundOptions: { color: design.bgColor || "#ffffff" },
    cornersSquareOptions: cornersOpts,
    cornersDotOptions: cornersDotOpts,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.4,
      hideBackgroundDots: true,
    },
  };
}

export async function downloadQrCode(qr, format = "png", size = 1024) {
  const qrCode = new QRCodeStyling(buildOptions(qr, size));
  const filename = (qr.name || qr.shortId || "qr-code").replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
  await qrCode.download({ name: filename, extension: format });
}

export function buildQrCodeStyling(qr, size = 400) {
  return new QRCodeStyling(buildOptions(qr, size));
}
