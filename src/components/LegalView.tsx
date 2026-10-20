import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle, Scale, Lock, CheckCircle2 } from 'lucide-react';

export const LegalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'community' | 'reports' | 'verification' | 'disclaimer'>('terms');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-slate-800">
          <FileText className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Legal & Governance Policies</h1>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          Official terms of service, privacy policies, community moderation guidelines, report policies, and legal disclaimers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        {[
          { id: 'terms', label: 'Terms of Service' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'community', label: 'Community Guidelines' },
          { id: 'reports', label: 'Report Policy' },
          { id: 'verification', label: 'Verification Policy' },
          { id: 'disclaimer', label: 'Platform Disclaimer' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Policy Content Body */}
      <div className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-6 text-xs text-slate-700 leading-relaxed font-normal">
        
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">1. Terms of Service</h2>
            <p>
              By accessing or utilizing TrustCheck ("the Platform"), you agree to abide by these Terms of Service. TrustCheck provides data aggregation and risk classification tools for informational purposes.
            </p>
            <h3 className="font-bold text-slate-900 text-sm pt-2">1.1 Permitted Use</h3>
            <p>
              Users may query the platform for personal due diligence prior to engaging in online transactions. Automated scraping or commercial resale of TrustCheck data is prohibited without express written authorization.
            </p>
            <h3 className="font-bold text-slate-900 text-sm pt-2">1.2 Account Accountability</h3>
            <p>
              Users submitting reports or corporate verification claims must provide truthful, verifiable evidence. False reporting may result in immediate suspension.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">2. Privacy Policy</h2>
            <p>
              TrustCheck respects user privacy and complies with EU GDPR and global privacy standards.
            </p>
            <h3 className="font-bold text-slate-900 text-sm pt-2">2.1 Information Collected</h3>
            <p>
              We collect query strings (URLs, business names, phone numbers submitted for verification), user email addresses provided during report submission, and standard telemetry logs.
            </p>
            <h3 className="font-bold text-slate-900 text-sm pt-2">2.2 Data Protection</h3>
            <p>
              User submitter identity data is encrypted at rest and is never disclosed publicly on entity profile reports.
            </p>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">3. Community Guidelines</h2>
            <p>
              To maintain an objective, constructive risk intelligence directory, community submissions must meet strict quality controls:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No hate speech, personal harassment, or doxxing of private individuals.</li>
              <li>Reports must focus on objective transaction facts, unfulfilled orders, or suspicious technical indicators.</li>
              <li>Defamatory or bad-faith reviews against competitors are strictly prohibited.</li>
            </ul>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">4. Incident Report Moderation Policy</h2>
            <p>
              All community-submitted reports undergo human analyst moderation before being published or impacting an entity's composite trust score.
            </p>
            <p>
              Submissions accompanied by verifiable evidence (transaction receipts, screenshots, header logs) are prioritized for compliance review.
            </p>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">5. Business Verification Policy</h2>
            <p>
              Organizations requesting the <strong>Verified Identity</strong> badge must submit official government registration certificates, corporate domain ownership proof, and active tax ID documentation.
            </p>
            <p>
              Verification status is subject to annual re-certification or revocation upon material changes in corporate standing or unresolved dispute surges.
            </p>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 text-rose-700">6. Platform Disclaimer</h2>
            <div className="bg-rose-50 border border-rose-200 rounded p-4 text-rose-950 font-medium">
              <strong>IMPORTANT NOTICE:</strong> TrustCheck does not guarantee that any website, business, job offer, rental listing, or investment opportunity is safe or fraudulent. Trust scores are algorithmic estimates based on available indicators. Users assume all responsibility for their online transactions.
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
