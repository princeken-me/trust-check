import React, { useState } from 'react';
import { 
  Building, Globe, ShieldCheck, MapPin, Calendar, Bookmark, AlertTriangle, 
  CheckCircle2, ArrowLeft, UserCheck, MessageSquare, History, FileText 
} from 'lucide-react';
import { Entity, TrustScore, RiskSignal, TrustSignal, Evidence } from '../types/index.js';
import { ScoreGauge } from './ScoreGauge.js';
import { SignalList } from './SignalList.js';
import { EvidenceGallery } from './EvidenceGallery.js';

interface EntityProfileProps {
  data: {
    entity: Entity;
    score: TrustScore;
    risk_signals: RiskSignal[];
    trust_signals: TrustSignal[];
    evidence: Evidence[];
    website_data?: any;
    business_data?: any;
    score_history?: any[];
  };
  onBack: () => void;
  onToggleWatchlist: (entityId: string) => void;
  isWatched: boolean;
  onOpenReportModal: (entityId: string) => void;
  onOpenVerificationModal: (entityId: string) => void;
}

export const EntityProfile: React.FC<EntityProfileProps> = ({
  data,
  onBack,
  onToggleWatchlist,
  isWatched,
  onOpenReportModal,
  onOpenVerificationModal
}) => {
  const { entity, score, risk_signals, trust_signals, evidence, website_data, business_data, score_history } = data;
  const [activeTab, setActiveTab] = useState<'signals' | 'evidence' | 'history'>('signals');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button & Title bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleWatchlist(entity.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition cursor-pointer ${
              isWatched
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isWatched ? 'Watching' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => onOpenReportModal(entity.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Concern</span>
          </button>

          {entity.verification_status !== 'verified' && (
            <button
              onClick={() => onOpenVerificationModal(entity.id)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Claim Entity</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Entity Header Card */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {entity.entity_type}
              </span>

              {entity.verification_status === 'verified' ? (
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Identity</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                  Unverified Registration
                </span>
              )}

              {entity.country && (
                <span className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{entity.city ? `${entity.city}, ` : ''}{entity.country}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{entity.name}</h1>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">{entity.description}</p>
          </div>

          {/* Contact & Link Bar */}
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2 shrink-0 md:w-72">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200">Entity Profile Metadata</div>
            
            {entity.website && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Website:</span>
                <a
                  href={entity.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-semibold truncate max-w-[150px]"
                >
                  {entity.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {website_data?.domain_age_days !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Domain Age:</span>
                <span className="text-slate-800 font-semibold font-mono">
                  {Math.floor(website_data.domain_age_days / 365)} yrs ({website_data.domain_age_days} days)
                </span>
              </div>
            )}

            {entity.phone && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-800 font-medium">{entity.phone}</span>
              </div>
            )}

            {entity.email && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-800 font-medium truncate max-w-[150px]">{entity.email}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Composite Score Gauge */}
      {score && <ScoreGauge score={score} verificationStatus={entity.verification_status} />}

      {/* Tabs navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('signals')}
          className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'signals'
              ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          Signals & Risk Factors ({risk_signals.length + trust_signals.length})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'evidence'
              ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          Evidence & Footprint ({evidence.length})
        </button>

        {score_history && score_history.length > 0 && (
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 border border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Trust Score History ({score_history.length})
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'signals' && (
        <SignalList riskSignals={risk_signals} trustSignals={trust_signals} />
      )}

      {activeTab === 'evidence' && (
        <EvidenceGallery evidence={evidence} />
      )}

      {activeTab === 'history' && score_history && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-base">Historical Trust Index Changes</h3>
          <div className="space-y-3">
            {score_history.map((hist, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Score changed from {hist.previous_score} to {hist.new_score} ({hist.risk_level})
                  </div>
                  <p className="text-slate-600">{hist.change_reason}</p>
                </div>
                <span className="text-slate-500 font-mono font-bold">{new Date(hist.changed_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
