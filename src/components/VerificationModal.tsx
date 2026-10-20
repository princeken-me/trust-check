import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  onSubmit: (payload: any) => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  entityId,
  onSubmit
}) => {
  const [organizationName, setOrganizationName] = useState('');
  const [documentationSummary, setDocumentationSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        entity_id: entityId,
        organization_name: organizationName,
        documentation_summary: documentationSummary
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      alert('Verification application failed. Please try again.');
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
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Claim & Verify Entity Identity</h3>
            <p className="text-xs text-slate-500 font-medium">Request formal Verified Identity status backed by business documentation.</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Verification Submitted</h4>
            <p className="text-xs text-slate-600">Our compliance desk will verify your legal documentation and assign the Verified Identity badge.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Official Legal Business / Organization Name</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Apex Global Logistics Solutions Inc."
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Corporate Registration & Documentation Summary</label>
              <textarea
                required
                rows={3}
                value={documentationSummary}
                onChange={(e) => setDocumentationSummary(e.target.value)}
                placeholder="State registration number, tax authority filings, corporate domain ownership proof..."
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Verification Protocol:</span>
              <p className="font-medium">Submitted documentation will be verified against official state, corporate, or domain registrar APIs.</p>
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
                disabled={isSubmitting || !organizationName.trim()}
                className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px] transition cursor-pointer disabled:bg-slate-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Verification Request'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
