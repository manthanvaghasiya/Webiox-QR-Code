"use client";

function ShapeBtn({ label, value, active, onClick, preview }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30 shadow-md"
          : "border-gray-200/60 bg-white/50 text-gray-500 hover:border-gray-300 hover:bg-white/80"
      }`}
    >
      <span className="text-lg">{preview}</span>
      <span>{label}</span>
    </button>
  );
}

export { ShapeBtn };

export default function DesignSection({ qr }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Dot Pattern</label>
        <div className="grid grid-cols-4 gap-2">
          <ShapeBtn label="Square" value="square" active={qr.dotPattern === "square"} onClick={qr.setDotPattern} preview="▪️" />
          <ShapeBtn label="Dots" value="dots" active={qr.dotPattern === "dots"} onClick={qr.setDotPattern} preview="⚫" />
          <ShapeBtn label="Rounded" value="rounded" active={qr.dotPattern === "rounded"} onClick={qr.setDotPattern} preview="🔵" />
          <ShapeBtn label="Classy" value="classy" active={qr.dotPattern === "classy"} onClick={qr.setDotPattern} preview="💎" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Frame Shape</label>
        <div className="grid grid-cols-3 gap-2">
          <ShapeBtn label="Square" value="square" active={qr.cornerStyle === "square"} onClick={qr.setCornerStyle} preview="⬛" />
          <ShapeBtn label="Dot" value="dot" active={qr.cornerStyle === "dot"} onClick={qr.setCornerStyle} preview="🔴" />
          <ShapeBtn label="Rounded" value="extra-rounded" active={qr.cornerStyle === "extra-rounded"} onClick={qr.setCornerStyle} preview="🟢" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Eye Ball Shape</label>
        <div className="grid grid-cols-2 gap-2 max-w-[50%]">
          <ShapeBtn label="Square" value="square" active={qr.eyeBallStyle === "square"} onClick={qr.setEyeBallStyle} preview="⬛" />
          <ShapeBtn label="Dot" value="dot" active={qr.eyeBallStyle === "dot"} onClick={qr.setEyeBallStyle} preview="⚫" />
        </div>
      </div>
    </div>
  );
}
