import React, { useState } from 'react';
import { FileCode, Database, Code, ShieldCheck, Terminal, BookOpen, Layers, Cpu, Copy, Check } from 'lucide-react';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'folder' | 'relationships' | 'migrations' | 'models' | 'services' | 'auth' | 'commands' | 'datamodel'>('folder');
  const [copied, setCopied] = useState(false);

  const copySetup = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-indigo-600">
          <FileCode className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TrustCheck Platform Specification & Architecture</h1>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          Complete structural reference covering database schema, relationships, models, services, authorization policy, and setup commands.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'folder', label: '1. Folder Structure', icon: Layers },
          { id: 'relationships', label: '2. Database Relationships', icon: Database },
          { id: 'migrations', label: '3. Migration List', icon: Code },
          { id: 'models', label: '4. Model List', icon: Cpu },
          { id: 'services', label: '5. Service List', icon: ShieldCheck },
          { id: 'auth', label: '6. Authorization Structure', icon: ShieldCheck },
          { id: 'commands', label: '7. Setup Commands', icon: Terminal },
          { id: 'datamodel', label: '8. Data Model Explanation', icon: BookOpen },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Folder Structure */}
      {activeTab === 'folder' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Complete Modular Folder Structure</span>
          </h2>
          <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`trustcheck/
├── server/                        # Express + Node Backend Services & DB Engine
│   ├── config/                    # Roles, Classifications & Policy Config
│   ├── db/
│   │   ├── db.ts                  # Lowdb JSON Persistence Manager & Migration Runner
│   │   └── seeders.ts             # Global Entity Seed Data (22 tables)
│   ├── services/
│   │   ├── TrustScoreService.ts    # 0-100 Score & Non-Judgmental Risk Classification
│   │   ├── RiskSignalService.ts   # Automated Risk Indicators Evaluator
│   │   ├── TrustSignalService.ts  # Evidence-backed Positive Trust Evaluator
│   │   ├── EvidenceService.ts     # Evidence Ingestion & Verification
│   │   ├── EntityMatchingService.ts # Entity Matching & Search Resolver
│   │   ├── ReportModerationService.ts # Moderator Audit & Workflow Engine
│   │   ├── VerificationService.ts # Corporate Identity Verification Engine
│   │   └── TrustIntelligenceEngine.ts # Silent AI/Gemini Background Researcher
│   └── server.ts                  # REST API Server Entry & Vite Middleware
├── laravel/                       # Laravel 11 Export Companion Framework
│   ├── app/
│   │   ├── Models/                # Entity, User, RiskSignal, TrustScore Eloquent Models
│   │   └── Services/              # TrustScoreService.php
│   └── database/
│       └── migrations/            # 2026_07_29_000001_create_trustcheck_tables.php (22 Tables)
├── src/                           # React 19 Frontend
│   ├── components/
│   │   ├── Navbar.tsx             # Header, Navigation & Active Role Switcher
│   │   ├── HeroSearch.tsx         # Universal Query Search ("Before you trust it, check it.")
│   │   ├── ScoreGauge.tsx         # Trust Score Dial & Risk Classification Gauge
│   │   ├── SignalList.tsx         # Risk Signals vs Trust Signals Breakdown
│   │   ├── EvidenceGallery.tsx    # Evidence Repository Cards
│   │   ├── EntityProfile.tsx      # Comprehensive Entity Profile Page
│   │   ├── ModerationDashboard.tsx# Operations Desk (Reports, Verifications, Sources, Logs)
│   │   ├── WatchlistPanel.tsx     # Monitored Entities Watchlist
│   │   ├── ReportModal.tsx        # User Report Submission Dialog
│   │   ├── VerificationModal.tsx  # Business Verification Application Dialog
│   │   └── ArchitectureSpecView.tsx # Interactive Architectural Deliverables Viewer
│   ├── services/
│   │   └── api.ts                 # Frontend API Client
│   ├── types/
│   │   └── index.ts               # Shared TypeScript Interfaces (22 Entities & Enums)
│   ├── App.tsx                    # Main Layout State & Router
│   ├── index.css                  # Tailwind CSS Entry
│   └── main.tsx                   # React Entry
├── metadata.json                  # Application Metadata
└── package.json                   # Dependencies & Build Scripts`}
          </pre>
        </div>
      )}

      {/* Tab 2: Database Relationships */}
      {activeTab === 'relationships' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Database Schema Relationships (22 Core Tables)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Entity Relationships (1:1)</span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">websites</code> (HasOne website_data)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">businesses</code> (HasOne business_data)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">verified_entities</code> (HasOne verified_record)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">trust_scores</code> (HasOne current_score)</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Entity Relationships (1:N)</span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">risk_signals</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">trust_signals</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">evidence</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">user_reports</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">trust_score_history</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">verification_requests</code> (HasMany)</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">User Relationships</span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><code className="text-blue-700 font-mono">users</code> → <code className="text-amber-800 font-mono">check_requests</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">users</code> → <code className="text-amber-800 font-mono">user_reports</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">users</code> → <code className="text-amber-800 font-mono">watchlists</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">users</code> → <code className="text-amber-800 font-mono">alerts</code> (HasMany)</li>
                <li><code className="text-blue-700 font-mono">users</code> → <code className="text-amber-800 font-mono">admin_activity_logs</code> (HasMany admin_id)</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Specific Type Extensions</span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">social_profiles</code></li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">job_offers</code></li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">rental_listings</code></li>
                <li><code className="text-blue-700 font-mono">entities</code> → <code className="text-amber-800 font-mono">investment_opportunities</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Migration List */}
      {activeTab === 'migrations' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Migration Files Index</h2>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-3 font-mono">
            <div className="text-blue-700 font-bold">/laravel/database/migrations/2026_07_29_000001_create_trustcheck_tables.php</div>
            <p className="text-slate-600 font-sans">Contains full schema definition for all 22 core tables with indexes, foreign keys, unique constraints, and enums.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 pt-2 font-mono text-[11px]">
              <span>1. users</span><span>2. entities</span><span>3. websites</span><span>4. businesses</span>
              <span>5. social_profiles</span><span>6. job_offers</span><span>7. rental_listings</span><span>8. investment_opportunities</span>
              <span>9. check_requests</span><span>10. risk_signals</span><span>11. trust_signals</span><span>12. evidence</span>
              <span>13. user_reports</span><span>14. trust_scores</span><span>15. trust_score_history</span><span>16. verification_requests</span>
              <span>17. verified_entities</span><span>18. reviews_and_experiences</span><span>19. watchlists</span><span>20. alerts</span>
              <span>21. admin_activity_logs</span><span>22. data_sources</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Model List */}
      {activeTab === 'models' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Eloquent / TypeScript Models List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'User', desc: 'Authentication, Roles (Super Admin, Analyst, Moderator, Verified Business, Regular User)' },
              { name: 'Entity', desc: 'Core central entity representing Websites, Businesses, Jobs, Rentals, Sellers, Investments' },
              { name: 'Website', desc: 'Domain registration, WHOIS, SSL HTTPS status, registrar, domain age' },
              { name: 'Business', desc: 'Corporate registration numbers, address, verified claimed status' },
              { name: 'RiskSignal', desc: 'Structured risk indicators with severity (critical, high, medium, low)' },
              { name: 'TrustSignal', desc: 'Positive trust factors with significance (high, medium, standard)' },
              { name: 'Evidence', desc: 'Audited evidence items (Public record, Website page, Screenshot, Document)' },
              { name: 'TrustScore', desc: '0-100 trust score, risk classification, and transparent explanation' },
              { name: 'UserReport', desc: 'Community incident reports undergoing moderation' },
              { name: 'VerificationRequest', desc: 'Corporate identity verification claim applications' },
              { name: 'AdminActivityLog', desc: 'Audit logging for moderator and admin actions' },
              { name: 'DataSource', desc: 'Trusted government, WHOIS, and regulatory API sources' },
            ].map((m, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded border border-slate-200 font-mono">
                <span className="text-blue-700 font-bold block text-sm">{m.name}</span>
                <span className="text-slate-600 font-sans text-xs">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Service List */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">7 Core Backend Intelligence Services</h2>
          <div className="space-y-3 text-xs">
            {[
              { name: 'TrustScoreService', desc: 'Calculates composite 0-100 trust scores from weighted risk and trust signals. Assigns non-judgmental risk classifications.' },
              { name: 'RiskSignalService', desc: 'Evaluates domain age, HTTPS, upfront fee patterns, unrealistic promises, and duplicate listing photos.' },
              { name: 'TrustSignalService', desc: 'Evaluates positive trust indicators (established domain age, verified physical office, state registration).' },
              { name: 'EvidenceService', desc: 'Creates and verifies evidence citations linked directly to signals and entity profiles.' },
              { name: 'EntityMatchingService', desc: 'Matches incoming user queries (URLs, phones, emails, business names) against existing entities or candidate profiles.' },
              { name: 'ReportModerationService', desc: 'Manages user report moderation desk workflows and generates admin audit log entries.' },
              { name: 'VerificationService', desc: 'Processes business identity verification requests, reviewer decisions, and Verified Identity status lifecycle.' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
                <div className="font-bold text-blue-700 text-sm font-mono">{s.name}</div>
                <p className="text-slate-700">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Authorization Structure */}
      {activeTab === 'auth' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono">
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Check Entities</th>
                  <th className="py-2 px-3">Submit Reports</th>
                  <th className="py-2 px-3">Claim Verification</th>
                  <th className="py-2 px-3">Moderate Reports</th>
                  <th className="py-2 px-3">Grant Verification</th>
                  <th className="py-2 px-3">Manage Sources / Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr><td className="py-2 px-3 font-bold text-slate-900">Regular User</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-400">No</td><td className="text-slate-400">No</td><td className="text-slate-400">No</td><td className="text-slate-400">No</td></tr>
                <tr><td className="py-2 px-3 font-bold text-slate-900">Verified Business</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-400">No</td><td className="text-slate-400">No</td><td className="text-slate-400">No</td></tr>
                <tr><td className="py-2 px-3 font-bold text-slate-900">Moderator Desk</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-400">No</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-400">No</td><td className="text-slate-500">Read-Only</td></tr>
                <tr><td className="py-2 px-3 font-bold text-slate-900">Risk Analyst</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-400">No</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-slate-500">Read-Only</td></tr>
                <tr><td className="py-2 px-3 font-bold text-slate-900">Super Admin</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td><td className="text-emerald-600 font-bold">Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Setup Commands */}
      {activeTab === 'commands' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Project Initial Setup Commands</span>
            </h2>
            <button
              onClick={() => copySetup(`npm install\nnpm run dev`)}
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-xs text-slate-700 font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Commands'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 p-4 rounded text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto">
{`# 1. Install Node dependencies
npm install

# 2. Run local Express + Vite Development Server (Port 3000)
npm run dev

# 3. Build for Production Bundle
npm run build

# 4. Start Production Server
npm start

# (Optional Laravel 11 CLI Commands if running PHP backend)
# php artisan migrate
# php artisan db:seed`}
          </pre>
        </div>
      )}

      {/* Tab 8: Data Model Explanation */}
      {activeTab === 'datamodel' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 text-xs leading-relaxed text-slate-700 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Explanation of the TrustCheck Data Model</span>
          </h2>
          <div className="space-y-3">
            <p>
              The <strong>TrustCheck Data Model</strong> is engineered around a central <code className="text-blue-700 font-mono font-bold">Entity</code> abstract model. An Entity represents anything online or offline that a user may want to verify before transacting or trusting: a website domain, registered business, marketplace seller, job offer listing, rental property, or investment opportunity.
            </p>
            <p>
              Rather than assigning binary labels ("scammer" vs "legitimate"), TrustCheck collects objective, verifiable <strong>Risk Signals</strong> (e.g. newly registered domain, missing address, upfront payment demands) and <strong>Trust Signals</strong> (e.g. government business registration, established WHOIS history, valid SSL certificate). Each signal is explicitly linked to an item in the <strong>Evidence Repository</strong>.
            </p>
            <p>
              The <code className="text-blue-700 font-mono font-bold">TrustScoreService</code> calculates a composite score from 0 to 100 based on weighted signal severities and assigns a careful, non-judgmental <strong>Risk Classification</strong> (e.g. <em>Strong Trust Signals</em>, <em>Generally Low Risk</em>, <em>Moderate Risk</em>, <em>High Risk</em>, <em>Suspicious</em>, or <em>Verified Identity</em>). Every score is accompanied by a transparent human-readable explanation of why the classification was assigned.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
