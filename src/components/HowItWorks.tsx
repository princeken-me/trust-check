import React from 'react';
import { Search, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Submit what you want to check',
      description: 'Paste any website domain, business name, phone number, email address, job offer URL, rental listing, or suspicious text message into the universal checker.',
      icon: Search
    },
    {
      step: '02',
      title: 'TrustCheck evaluates signals',
      description: 'Our automated intelligence engine scans domain registries, corporate filings, SSL certificates, threat databases, and community moderation signals.',
      icon: Cpu
    },
    {
      step: '03',
      title: 'Review evidence & risk indicators',
      description: 'Inspect clear, non-judgmental risk classifications (0-100 composite score), verified identity badges, evidence records, and community reports.',
      icon: AlertCircle
    },
    {
      step: '04',
      title: 'Make an informed decision',
      description: 'Proceed with confidence, exercise heightened caution, request additional proof, or avoid unverified transactions entirely.',
      icon: CheckCircle2
    }
  ];

  return (
    <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded border border-blue-200">
            Consumer Protection Protocol
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How TrustCheck Works</h2>
          <p className="text-xs text-slate-600 font-medium">
            An objective, data-driven trust intelligence pipeline designed to safeguard online transactions and interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-slate-50 rounded-md border border-slate-200 p-5 space-y-3 relative shadow-2xs hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-300 font-mono tracking-tighter">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
