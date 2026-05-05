"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Zap, AlertCircle, CheckCircle } from "lucide-react";

const priorityColors = {
  high: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-600" },
  medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-600" },
  low: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600" },
};

function InsightCard({ insight }) {
  const colors = priorityColors[insight.priority] || priorityColors.medium;
  const Icon = insight.priority === "high" ? AlertCircle : Zap;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 space-y-2`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-bold text-sm ${colors.text}`}>{insight.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
        </div>
      </div>
      {insight.action && (
        <div className={`text-xs ${colors.text} font-semibold pl-8 flex items-center gap-1`}>
          <TrendingUp className="w-3 h-3" />
          {insight.action}
        </div>
      )}
    </div>
  );
}

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/ai/analytics-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error("Failed to fetch insights");
        const data = await res.json();

        if (data.success) {
          setInsights(data.insights || []);
          setSummary(data.summary || "");
        }
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 animate-pulse">
        <div className="h-8 bg-blue-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-blue-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || insights.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Not enough data yet</h3>
            <p className="text-sm text-gray-600">
              AI insights will appear here once you have more QR code scans and profile activity.
              Keep sharing your profiles to unlock personalized recommendations!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">AI-Powered Insights</h3>
        </div>
        {summary && (
          <p className="text-sm text-gray-600 ml-13">{summary}</p>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid gap-3">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} />
        ))}
      </div>

      {/* Recommendation Footer */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-900">Keep growing!</p>
          <p className="text-xs text-green-700 mt-0.5">
            Continue sharing your profiles and QR codes. More data = smarter recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
