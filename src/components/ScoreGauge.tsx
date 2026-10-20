import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle, CheckCircle, Info, Lock } from 'lucide-react';
import { RiskClassification, TrustScore } from '../types/index.js';

interface ScoreGaugeProps {
  score: TrustScore;
  verificationStatus?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, verificationStatus }) => {
  const scoreVal = score.score;
  const riskLevel = score.risk_level;

  // Determine color scheme based on risk classification
  const getClassificationStyle = (level: RiskClassification) => {
    switch (level) {
      case 'Verified Identity':
        return {
          bg: 'bg-emerald-950/80',
          text: 'text-emerald-400',
          border: 'border-emerald-700/60',
          barColor: '#10b981',
          icon: Lock
        };
      case 'Strong Trust Signals':
        return {
          bg: 'bg-teal-950/80',
          text: 'text-teal-400',
          border: 'border-teal-700/60',
          barColor: '#14b8a6',
          icon: ShieldCheck
        };
      case 'Generally Low Risk':
        return {
          bg: 'bg-emerald-950/60',
          text: 'text-emerald-300',
          border: 'border-emerald-800/40',
          barColor: '#34d399',
          icon: CheckCircle
        };
      case 'Moderate Risk':
        return {
          bg: 'bg-amber-950/80',
          text: 'text-amber-400',
          border: 'border-amber-700/60',
          barColor: '#f59e0b',
          icon: AlertCircle
        };
      case 'High Risk':
        return {
          bg: 'bg-orange-950/80',
          text: 'text-orange-400',
          border: 'border-orange-700/60',
          barColor: '#f97316',
          icon: ShieldAlert
        };
      case 'Suspicious':
        return {
          bg: 'bg-red-950/90',
          text: 'text-red-400',
          border: 'border-red-700/60',
          barColor: '#ef4444',
          icon: ShieldAlert
        };
      case 'Limited Verification':
      case 'Unable to Verify':
      default:
        return {
          bg: 'bg-slate-800/80',
          text: 'text-slate-300',
          border: 'border-slate-700',
          barColor: '#94a3b8',
          icon: Info
        };
    }
  };

  const style = getClassificationStyle(riskLevel);
  const IconComp = style.icon;

  // Calculate SVG stroke offset for score dial (radius 45, circumference = ~282.7)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreVal / 100) * circumference;

  return (
    <div className="bg-slate-900 rounded-md p-6 text-white border-0 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Score Dial & Gauge */}
        <div className="flex items-center space-x-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={style.barColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-white tracking-tight">{scoreVal}</span>
              <span className="text-[10px] block text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calculated Trust Score</span>
              <span className="text-xs text-slate-400">• Confidence {score.confidence}%</span>
            </div>

            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded ${style.bg} ${style.border} border`}>
              <IconComp className={`w-4 h-4 ${style.text}`} />
              <span className={`font-bold text-sm uppercase tracking-wider ${style.text}`}>{riskLevel}</span>
            </div>

            <div className="flex items-center space-x-4 pt-1 text-xs text-slate-300 font-medium">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{score.trust_signals_count} Trust Signals</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>{score.risk_signals_count} Risk Factors</span>
              </span>
            </div>
          </div>
        </div>

        {/* Score Explanation Box */}
        <div className="flex-1 bg-slate-800/80 rounded p-4 border border-slate-700/80 text-xs leading-relaxed text-slate-300 space-y-2">
          <div className="font-bold text-white mb-1 flex items-center justify-between border-b border-slate-700 pb-1">
            <span className="uppercase text-[11px] tracking-wider text-slate-300">Trust Intelligence Signal Assessment</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Last Checked: {new Date(score.calculated_date).toLocaleDateString()}
            </span>
          </div>
          <p>{score.score_explanation}</p>
          <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 italic space-y-0.5">
            <p>• Based on available information. Unverified fields are explicitly marked as "Unable to Verify".</p>
            <p>• TrustCheck cannot guarantee that an entity is completely safe or fraudulent. Always conduct independent due diligence.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
