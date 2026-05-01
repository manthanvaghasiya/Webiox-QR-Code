"use client";

import { forwardRef } from "react";

/**
 * Wraps the QR canvas in a decorative frame that renders
 * both in the live preview AND in the exported image.
 *
 * The outer div gets a ref so we can use html2canvas on it for download.
 */
const QrFrameWrapper = forwardRef(function QrFrameWrapper(
  { frameStyle, frameText, frameTextColor, frameFillColor, frameBorderColor, children },
  ref
) {
  if (frameStyle === "none" || !frameStyle) {
    return <div ref={ref}>{children}</div>;
  }

  // Common data attribute for download logic to find the frame wrapper
  const wrapperAttr = { "data-frame-wrapper": "true" };

  const border = frameBorderColor && frameBorderColor !== "transparent" ? frameBorderColor : "transparent";
  const fill = frameFillColor || "#4F46E5";
  const textCol = frameTextColor || "#FFFFFF";
  const text = frameText || "SCAN ME";

  // ── Rounded Box ──
  if (frameStyle === "rounded-box") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 24,
          border: `4px solid ${fill}`,
          padding: 16,
          gap: 12,
          background: "#fff",
        }}
      >
        {children}
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "8px 16px",
            borderRadius: 12,
            background: fill,
            color: textCol,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ── Banner Bottom ──
  if (frameStyle === "banner-bottom") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: border !== "transparent" ? `3px solid ${border}` : "none",
        }}
      >
        <div style={{ padding: 12 }}>{children}</div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "12px 16px",
            background: fill,
            color: textCol,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ── Banner Top ──
  if (frameStyle === "banner-top") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: border !== "transparent" ? `3px solid ${border}` : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "12px 16px",
            background: fill,
            color: textCol,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {text}
        </div>
        <div style={{ padding: 12 }}>{children}</div>
      </div>
    );
  }

  // ── Speech Bubble ──
  if (frameStyle === "speech-bubble") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <div style={{ padding: 4 }}>{children}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -2 }}>
          {/* Triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: `12px solid ${fill}`,
            }}
          />
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 20,
              background: fill,
              color: textCol,
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  }

  // ── Scan Corners ──
  if (frameStyle === "scan-corners") {
    const cornerSize = 28;
    const strokeW = 5;
    const cornerStyle = {
      position: "absolute",
      width: cornerSize,
      height: cornerSize,
      borderColor: fill,
      borderStyle: "solid",
    };
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: 20,
          background: "#fff",
        }}
      >
        {/* Corners */}
        <div style={{ ...cornerStyle, top: 0, left: 0, borderWidth: `${strokeW}px 0 0 ${strokeW}px`, borderRadius: "8px 0 0 0" }} />
        <div style={{ ...cornerStyle, top: 0, right: 0, borderWidth: `${strokeW}px ${strokeW}px 0 0`, borderRadius: "0 8px 0 0" }} />
        <div style={{ ...cornerStyle, bottom: text ? 36 : 0, left: 0, borderWidth: `0 0 ${strokeW}px ${strokeW}px`, borderRadius: "0 0 0 8px" }} />
        <div style={{ ...cornerStyle, bottom: text ? 36 : 0, right: 0, borderWidth: `0 ${strokeW}px ${strokeW}px 0`, borderRadius: "0 0 8px 0" }} />
        {children}
        {text && (
          <div
            style={{
              marginTop: 10,
              color: fill,
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  }

  // ── Circle Badge ──
  if (frameStyle === "circle-badge") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 20,
          border: `4px solid ${fill}`,
          padding: 16,
        }}
      >
        {children}
        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 40,
            background: fill,
            color: textCol,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: 18 }}>📱</span>
          {text}
        </div>
      </div>
    );
  }

  // ── Ticket ──
  if (frameStyle === "ticket") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          border: `3px solid ${fill}`,
          position: "relative",
        }}
      >
        {/* Notch left */}
        <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: fill }} />
        {/* Notch right */}
        <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: fill }} />
        <div style={{ padding: 16 }}>{children}</div>
        {/* Dashed line */}
        <div style={{ width: "80%", borderTop: `2px dashed ${fill}`, opacity: 0.4 }} />
        <div
          style={{
            padding: "10px 16px",
            color: fill,
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ── Gradient Border ──
  if (frameStyle === "gradient-border") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: `linear-gradient(135deg, ${fill}, ${adjustColor(fill, 40)})`,
          borderRadius: 20,
          padding: 5,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {children}
          <div
            style={{
              padding: "6px 20px",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${fill}, ${adjustColor(fill, 40)})`,
              color: textCol,
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  }

  // ── Shadow Card ──
  if (frameStyle === "shadow-card") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 24,
          padding: 20,
          boxShadow: `0 20px 60px -10px ${fill}40, 0 8px 24px -8px ${fill}30`,
          gap: 14,
        }}
      >
        {children}
        <div
          style={{
            color: fill,
            fontWeight: 900,
            fontSize: 15,
            letterSpacing: 3,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ── Dotted Border ──
  if (frameStyle === "dotted-border") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          border: `4px dotted ${fill}`,
          borderRadius: 16,
          padding: 16,
          background: "#fff",
          gap: 12,
        }}
      >
        {children}
        <div
          style={{
            color: fill,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // ── Double Border ──
  if (frameStyle === "double-border") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          border: `3px solid ${fill}`,
          borderRadius: 20,
          padding: 6,
          background: "#fff",
        }}
      >
        <div
          style={{
            border: `2px solid ${fill}`,
            borderRadius: 14,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {children}
          <div
            style={{
              color: fill,
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  }

  // ── Arrow Down ──
  if (frameStyle === "arrow-down") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "10px 20px",
            borderRadius: "16px 16px 0 0",
            background: fill,
            color: textCol,
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {text}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: `14px solid ${fill}`,
          }}
        />
        <div style={{ padding: "8px 4px 4px" }}>{children}</div>
      </div>
    );
  }

  // ── Stamp ──
  if (frameStyle === "stamp") {
    return (
      <div
        ref={ref} {...wrapperAttr}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: fill,
          borderRadius: 4,
          padding: 16,
          gap: 10,
          // Stamp perforation via repeating radial gradient  
          backgroundImage: `radial-gradient(circle, #fff 4px, transparent 4px)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "-8px -8px",
        }}
      >
        <div style={{ background: "#fff", borderRadius: 4, padding: 8 }}>
          {children}
        </div>
        <div
          style={{
            color: textCol,
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 3,
            textTransform: "uppercase",
            textAlign: "center",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // Fallback
  return <div ref={ref}>{children}</div>;
});

/** Shift a hex color's lightness by amount */
function adjustColor(hex, amount) {
  try {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return hex;
  }
}

export default QrFrameWrapper;
