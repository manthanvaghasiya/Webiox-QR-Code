"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ShapePreview = ({ type, variant, active }) => {
  const color = active ? "bg-brand-500" : "bg-gray-400";
  const borderColor = active ? "border-brand-500" : "border-gray-400";

  if (type === "pattern") {
    let radius = "rounded-none";
    if (variant === "dots") radius = "rounded-full";
    if (variant === "rounded") radius = "rounded-sm";
    if (variant === "classy") radius = "rounded-tl-md rounded-br-md rounded-tr-sm rounded-bl-sm";
    if (variant === "classy-rounded") radius = "rounded-md";
    if (variant === "extra-rounded") radius = "rounded-lg";

    return (
      <div className="grid grid-cols-3 gap-1 p-0.5">
        {[...Array(9)].map((_, i) => {
          let style = {};
          if (variant === "classy" && i % 2 === 0) style = { borderRadius: "100%" };
          if (variant === "diamond") style = { transform: "rotate(45deg)", borderRadius: "2px" };
          return (
            <div
              key={i}
              className={`w-2 h-2 transition-all duration-300 ${color} ${variant === "diamond" ? "" : radius}`}
              style={style}
            />
          );
        })}
      </div>
    );
  }

  if (type === "frame") {
    let radius = "rounded-none";
    if (variant === "dot") radius = "rounded-full";
    if (variant === "extra-rounded") radius = "rounded-xl";
    if (variant === "classy") radius = "rounded-tl-xl rounded-br-xl";
    if (variant === "classy-rounded") radius = "rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg";

    return (
      <div className={`w-8 h-8 border-[3px] transition-all duration-300 ${borderColor} ${radius}`} />
    );
  }

  if (type === "ball") {
    let radius = "rounded-none";
    if (variant === "dot") radius = "rounded-full";
    if (variant === "rounded") radius = "rounded-md";
    if (variant === "classy") radius = "rounded-tl-lg rounded-br-lg";

    return (
      <div className={`w-4 h-4 transition-all duration-300 ${color} ${radius}`} />
    );
  }

  return null;
};

function ShapeBtn({ label, value, active, onClick, type }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(value)}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
        active
          ? "border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-500/20"
          : "border-gray-200/60 bg-white/60 hover:bg-white hover:border-brand-200 hover:shadow-sm"
      }`}
    >
      {active && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-sm">
          <Check className="w-2.5 h-2.5" />
        </span>
      )}
      <ShapePreview type={type} variant={value} active={active} />
      <span className={`text-[10px] font-bold ${active ? "text-brand-700" : "text-gray-600"}`}>
        {label}
      </span>
    </motion.button>
  );
}

export default function DesignSection({ qr }) {
  return (
    <div className="space-y-6">
      {/* Dot Pattern */}
      <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-gray-100/50">
        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-brand-500 rounded-full"></div>
          Body Shapes
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          <ShapeBtn type="pattern" label="Square" value="square" active={qr.dotPattern === "square"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Dots" value="dots" active={qr.dotPattern === "dots"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Rounded" value="rounded" active={qr.dotPattern === "rounded"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Classy" value="classy" active={qr.dotPattern === "classy"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Classy+" value="classy-rounded" active={qr.dotPattern === "classy-rounded"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Extra" value="extra-rounded" active={qr.dotPattern === "extra-rounded"} onClick={qr.setDotPattern} />
          <ShapeBtn type="pattern" label="Diamond" value="diamond" active={qr.dotPattern === "diamond"} onClick={qr.setDotPattern} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Eye Frame Shape */}
        <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-gray-100/50">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
            Corner Frame
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <ShapeBtn type="frame" label="Square" value="square" active={qr.cornerStyle === "square"} onClick={qr.setCornerStyle} />
            <ShapeBtn type="frame" label="Circle" value="dot" active={qr.cornerStyle === "dot"} onClick={qr.setCornerStyle} />
            <ShapeBtn type="frame" label="Rounded" value="extra-rounded" active={qr.cornerStyle === "extra-rounded"} onClick={qr.setCornerStyle} />
            <ShapeBtn type="frame" label="Classy" value="classy" active={qr.cornerStyle === "classy"} onClick={qr.setCornerStyle} />
            <ShapeBtn type="frame" label="Classy+" value="classy-rounded" active={qr.cornerStyle === "classy-rounded"} onClick={qr.setCornerStyle} />
          </div>
        </div>

        {/* Eye Ball Shape */}
        <div className="bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-gray-100/50">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-pink-500 rounded-full"></div>
            Corner Dot
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            <ShapeBtn type="ball" label="Square" value="square" active={qr.eyeBallStyle === "square"} onClick={qr.setEyeBallStyle} />
            <ShapeBtn type="ball" label="Circle" value="dot" active={qr.eyeBallStyle === "dot"} onClick={qr.setEyeBallStyle} />
            <ShapeBtn type="ball" label="Rounded" value="rounded" active={qr.eyeBallStyle === "rounded"} onClick={qr.setEyeBallStyle} />
            <ShapeBtn type="ball" label="Classy" value="classy" active={qr.eyeBallStyle === "classy"} onClick={qr.setEyeBallStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}
