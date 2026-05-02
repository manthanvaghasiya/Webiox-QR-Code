"use client";

const STEPS = [
  { id: 1, label: "Business" },
  { id: 2, label: "AI Magic" },
  { id: 3, label: "Contact" },
  { id: 4, label: "Social" },
  { id: 5, label: "Services" },
  { id: 6, label: "Design" },
];

export default function WizardProgressBar({ currentStep, totalSteps = 6 }) {
  const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step labels */}
      <div className="flex items-center justify-between mb-3 px-1">
        {STEPS.map((step) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  done
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                    : active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] font-semibold hidden sm:block transition-colors duration-300 ${
                  active ? "text-brand-700" : done ? "text-brand-500" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
