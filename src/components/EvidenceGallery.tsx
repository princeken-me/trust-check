import React from 'react';
import { FileCheck, ExternalLink, ShieldCheck, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import { Evidence } from '../types/index.js';

interface EvidenceGalleryProps {
  evidence: Evidence[];
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ evidence }) => {
  return (
    <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Evidence Repository & Footprint</h3>
            <p className="text-xs text-slate-500 font-medium">{evidence.length} audited records & documentation items</p>
          </div>
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">
          No external evidence items linked to this entity profile yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidence.map((item) => (
            <div key={item.id} className="bg-slate-50 rounded border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                  {item.evidence_type}
                </span>
                <span className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span className="capitalize">{item.verification_status}</span>
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Collected {new Date(item.collected_date).toLocaleDateString()}</span>
                </span>

                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:underline font-bold"
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
