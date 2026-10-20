import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  onSubmit: (payload: any) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, entityId, onSubmit }) => {
  const [reportType, setReportType] = useState('Suspicious website');
  const [description, setDescription] = useState('');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        entity_id: entityId,
        report_type: reportType,
        description,
        evidence_summary: evidenceSummary,
        user_name: userName,
        user_email: userEmail
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-md border border-slate-200 w-full max-w-lg p-6 shadow-xl relative space-y-4">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Submit User Incident Report</h3>
            <p className="text-xs text-slate-500 font-medium">Reports go through human analyst moderation before publishing.</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-600">Thank you for helping protect the community. Our compliance team will audit this item.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Report Concern Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
              >
                <option value="Suspicious website">Suspicious website</option>
                <option value="Fake business">Fake business</option>
                <option value="Fake job">Fake job offer</option>
                <option value="Fake rental">Fake rental listing</option>
                <option value="Suspicious investment">Suspicious investment scheme</option>
                <option value="Payment fraud">Payment / wire fraud</option>
                <option value="Impersonation">Corporate impersonation</option>
                <option value="Other concern">Other concern</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Detailed Incident Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, including dates, communication channels, or unfulfilled promises..."
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Evidence Summary / Source Links</label>
              <input
                type="text"
                value={evidenceSummary}
                onChange={(e) => setEvidenceSummary(e.target.value)}
                placeholder="Paste relevant URLs, payment transaction IDs, or document links..."
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Optional or Name"
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Your Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="For moderation updates"
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-wider text-[11px] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-[11px] transition cursor-pointer disabled:bg-slate-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
