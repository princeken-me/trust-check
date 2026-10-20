import React from 'react';
import { ShieldCheck, AlertCircle, Cpu, Scale, CheckCircle2, Lock } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-4 text-center">
        <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About TrustCheck</h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          TrustCheck is an independent trust intelligence and consumer protection platform designed to help people make more informed decisions before clicking, paying, or sharing personal information online.
        </p>
      </div>

      {/* Critical Core Disclaimer */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-md p-6 space-y-2 text-xs text-rose-950 shadow-2xs">
        <div className="flex items-center space-x-2 text-rose-700 font-bold uppercase tracking-wider text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Core Disclaimer & Platform Scope</span>
        </div>
        <p className="leading-relaxed font-medium">
          <strong>TrustCheck does not guarantee that an entity is safe or fraudulent.</strong> TrustCheck evaluates available public information, WHOIS signals, corporate filings, threat intelligence feeds, and community reports to generate non-binding trust assessments. Users must always exercise personal due diligence.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Automated Analysis</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Our engine ingests domain creation timestamps, TLS certificate transparency logs, corporate registry numbers, and payment architecture signals.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Human Moderation</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Community reports pass through human compliance analyst moderation to prevent malicious reporting or competitor defamation.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-3 shadow-2xs">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Badging</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Legitimate organizations can claim their profiles and submit verified corporate documentation to validate official identity.
          </p>
        </div>
      </div>

      {/* Mission statement */}
      <div className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Our Objective & Commitment</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          In an era of sophisticated social engineering, cloned storefronts, and phantom job listings, TrustCheck provides clear, accessible, and evidence-backed transparency indicators. We remain completely independent of advertiser influence to preserve objective trust scoring.
        </p>
      </div>

    </div>
  );
};
