import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Upload, FileText, CheckCircle2, Lock } from 'lucide-react';
import { submitReport } from '../services/api.js';

interface ReportPageProps {
  onRefreshReports?: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onRefreshReports }) => {
  const [reportType, setReportType] = useState('Suspicious website');
  const [targetEntityName, setTargetEntityName] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const reportTypes = [
    'Suspicious website',
    'Fake business',
    'Fake job offer',
    'Fake rental listing',
    'Suspicious investment',
    'Fake seller / Scam store',
    'Payment request fraud',
    'Impersonation / Phishing',
    'Other concern'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !targetEntityName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitReport({
        entity_id: `ent-rep-${Date.now()}`,
        report_type: reportType,
        description: `Target: ${targetEntityName} | ${description}`,
        evidence_summary: evidenceSummary,
        user_name: userName,
        user_email: userEmail
      });

      setSubmittedSuccess(true);
      if (onRefreshReports) onRefreshReports();
    } catch (err: any) {
      alert(`Failed submitting report: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-3">
        <div className="flex items-center space-x-3 text-rose-600">
          <div className="w-10 h-10 rounded bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report Online Incident or Suspicious Activity</h1>
            <p className="text-xs text-slate-600 font-medium">
              Submit reports regarding deceptive websites, fraudulent job offers, imposter accounts, or payment requests.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Human Moderation Policy:</strong> All community reports pass through compliance analyst review before publication or trust index recalculation.
          </span>
        </div>
      </div>

      {submittedSuccess ? (
        <div className="bg-white rounded-md border border-slate-200 p-10 text-center space-y-4 shadow-sm">
          <ShieldCheck className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Incident Report Submitted to Moderation</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
            Thank you for helping protect consumers worldwide. Your incident reference ID is <span className="font-mono font-bold text-slate-900">INC-{Date.now().toString().slice(-6)}</span>.
          </p>
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setTargetEntityName('');
              setDescription('');
              setEvidenceSummary('');
            }}
            className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Report Concern Type *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              >
                {reportTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Target Entity Name, Website, Phone, or Email *
              </label>
              <input
                type="text"
                required
                value={targetEntityName}
                onChange={(e) => setTargetEntityName(e.target.value)}
                placeholder="e.g. quick-deals-finance.net or +1 (800) 555-0199"
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Detailed Incident Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details: What happened? What were you asked to pay or sign? Dates, promises, or unfulfilled orders..."
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Evidence Summary & Document Links
              </label>
              <input
                type="text"
                value={evidenceSummary}
                onChange={(e) => setEvidenceSummary(e.target.value)}
                placeholder="Paste transaction hashes, screenshot URLs, public drive links, or payment receipts..."
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            {/* Simulated File Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded p-6 text-center space-y-2 bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Attach Screenshot or File Evidence</div>
              <p className="text-[11px] text-slate-500 font-medium">PNG, JPG, PDF up to 10MB (Stored securely in moderation sandbox)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Leave empty to remain anonymous"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Your Email (For Moderation Updates)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !description.trim() || !targetEntityName.trim()}
              className="px-8 py-3 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300 shadow-sm"
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
