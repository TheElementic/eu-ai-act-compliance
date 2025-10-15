import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ReadinessScoreCard({ score, riskTier }) {
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreStatus = () => {
    if (score >= 80) return { label: "Excellent Progress", icon: CheckCircle2, color: "green" };
    if (score >= 50) return { label: "Good Progress", icon: TrendingUp, color: "blue" };
    if (score >= 30) return { label: "Making Progress", icon: TrendingUp, color: "orange" };
    return { label: "Needs Attention", icon: AlertTriangle, color: "red" };
  };

  const status = getScoreStatus();

  return (
    <Card className="border-2 border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <status.icon className={`w-6 h-6 text-${status.color}-600`} />
          Compliance Readiness Score
        </CardTitle>
        <CardDescription>
          Weighted score based on mandatory and optional requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative"
          >
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - score / 100)}`}
                className={getScoreColor()}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - score / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-5xl font-bold ${getScoreColor()}`}
              >
                {score}%
              </motion.span>
              <span className="text-slate-600 text-sm mt-1">{status.label}</span>
            </div>
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Overall Progress</span>
            <span className="text-sm font-semibold">{score}%</span>
          </div>
          <Progress value={score} className="h-3" />
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          score >= 80 
            ? "bg-green-50 border-green-200" 
            : score >= 50 
            ? "bg-blue-50 border-blue-200"
            : "bg-orange-50 border-orange-200"
        }`}>
          <p className="text-sm">
            {score >= 80 ? (
              "Excellent! Your compliance efforts are on track. Keep documenting evidence and maintaining your systems."
            ) : score >= 50 ? (
              "You're making good progress. Focus on completing mandatory requirements and gathering evidence."
            ) : score >= 30 ? (
              "Continue working through your checklist. Prioritize high-risk mandatory items first."
            ) : (
              "Important: Your compliance needs immediate attention. Start with mandatory requirements marked in red."
            )}
          </p>
        </div>

        {riskTier === "High Risk" && score < 100 && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-900">
                <p className="font-semibold mb-1">High-Risk System Notice</p>
                <p>Your system requires full compliance with all mandatory requirements before going live or remaining in service under the EU AI Act.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}