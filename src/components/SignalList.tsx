import React from 'react';
import { AlertTriangle, ShieldCheck, Info, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { RiskSignal, TrustSignal } from '../types/index.js';

interface SignalListProps {
  riskSignals: RiskSignal[];
  trustSignals: TrustSignal[];
}

export const SignalList: React.FC<SignalListProps> = ({ riskSignals, trustSignals }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Risk Signals Column */}
      <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Risk Signal Analysis</h3>
              <p className="text-xs text-slate-500 font-medium">{riskSignals.length} risk indicators identified</p>
            </div>
          </div>
        </div>

        {riskSignals.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800">No elevated risk signals identified</p>
            <p className="text-slate-500 mt-0.5">Entity matches clean operational criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {riskSignals.map((signal) => {
              const isCritical = signal.severity === 'critical';
              const isHigh = signal.severity === 'high';

              return (
                <div
                  key={signal.id}
                  className={`p-3.5 border-l-4 rounded-r-md flex flex-col gap-2 text-xs transition ${
                    isCritical
                      ? 'border-l-rose-600 bg-rose-50/60'
                      : isHigh
                      ? 'border-l-orange-500 bg-orange-50/60'
                      : 'border-l-amber-500 bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900">{signal.signal_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700'
                          : isHigh
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {signal.severity} risk
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-normal">{signal.description}</p>

                  <div className="bg-white p-2.5 rounded border border-slate-200/80 text-slate-600 text-[11px] space-y-1">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Evidence: </span>
                      <span className="text-slate-800 font-medium">{signal.evidence}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>Source: {signal.source}</span>
                      <span>Confidence: {signal.confidence}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust Signals Column */}
      <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Positive Trust Signals</h3>
              <p className="text-xs text-slate-500 font-medium">{trustSignals.length} verified positive factors</p>
            </div>
          </div>
        </div>

        {trustSignals.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-800">Limited positive trust factors verified</p>
            <p className="text-slate-500 mt-0.5">Submit verification documentation to strengthen profile.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trustSignals.map((signal) => {
              const isHigh = signal.significance === 'high';

              return (
                <div
                  key={signal.id}
                  className="p-3.5 border-l-4 border-l-emerald-500 bg-emerald-50/60 rounded-r-md flex flex-col gap-2 text-xs transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900">{signal.signal_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 shrink-0">
                      {signal.significance} significance
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-normal">{signal.description}</p>

                  <div className="bg-white p-2.5 rounded border border-slate-200/80 text-slate-600 text-[11px] space-y-1">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Evidence: </span>
                      <span className="text-slate-800 font-medium">{signal.evidence}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>Source: {signal.source}</span>
                      <span>Confidence: {signal.confidence}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
