import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, UserCheck, Activity, Database, Check, X, Eye, 
  Clock, ShieldCheck, AlertTriangle 
} from 'lucide-react';
import { 
  fetchAdminReports, moderateReport, fetchAdminVerifications, 
  reviewVerification, fetchAdminLogs, fetchDataSources 
} from '../services/api.js';
import { UserRole } from '../types/index.js';

interface ModerationDashboardProps {
  currentRole: UserRole;
  onRefreshData?: () => void;
}

export const ModerationDashboard: React.FC<ModerationDashboardProps> = ({ currentRole, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'verifications' | 'sources' | 'logs'>('reports');
  const [reports, setReports] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'reports') {
        const data = await fetchAdminReports();
        setReports(data);
      } else if (activeTab === 'verifications') {
        const data = await fetchAdminVerifications();
        setVerifications(data);
      } else if (activeTab === 'sources') {
        const data = await fetchDataSources();
        setSources(data);
      } else if (activeTab === 'logs') {
        const data = await fetchAdminLogs();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerateReport = async (reportId: string, action: 'actioned' | 'dismissed') => {
    const notes = prompt(`Enter moderation notes for actioning report ${reportId}:`, 'Audited and verified incident details.');
    if (notes !== null) {
      await moderateReport(reportId, action, notes);
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  const handleReviewVerification = async (requestId: string, approved: boolean) => {
    const notes = prompt(`Enter compliance notes for verification ${requestId}:`, approved ? 'Approved business identity documents.' : 'Insufficient corporate registration proof.');
    if (notes !== null) {
      await reviewVerification(requestId, approved, notes);
      await loadData();
      if (onRefreshData) onRefreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
              {currentRole} Access
            </span>
            <span className="text-xs text-slate-500 font-medium">• Operations & Moderation Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">TrustCheck Moderation & Compliance</h1>
          <p className="text-xs text-slate-600 font-medium">Audit user incident reports, review corporate verification claims, manage data sources, and inspect admin logs.</p>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200 shadow-2xs transition cursor-pointer self-start sm:self-auto"
        >
          Refresh Queues
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>User Reports Queue ({reports.filter(r => r.status === 'pending' || r.status === 'under_review').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verification Desk ({verifications.filter(v => v.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Sources Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Admin Audit Logs</span>
        </button>
      </div>

      {/* Reports Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">User Incident Reports Queue</h2>
          
          {reports.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">No reports in moderation queue.</div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{report.report_type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      report.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      report.status === 'actioned' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-normal">{report.description}</p>
                  
                  {report.evidence_summary && (
                    <div className="text-slate-700 bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px]">
                      Evidence: {report.evidence_summary}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                    <span className="font-medium">Submitted by: {report.user_name} ({report.user_email})</span>
                    
                    {report.status === 'pending' || report.status === 'under_review' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleModerateReport(report.id, 'actioned')}
                          className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Approve & Action</span>
                        </button>
                        <button
                          onClick={() => handleModerateReport(report.id, 'dismissed')}
                          className="px-3 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono">Moderated Notes: {report.moderation_notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verification Desk */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Business Verification Applications</h2>

          {verifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-200">No verification applications pending.</div>
          ) : (
            <div className="space-y-3">
              {verifications.map((vReq) => (
                <div key={vReq.id} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{vReq.organization_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      vReq.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      vReq.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {vReq.status}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium">Documentation Summary: {vReq.documentation_summary}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                    <span className="font-mono">Submitted: {new Date(vReq.submitted_at).toLocaleDateString()}</span>
                    
                    {vReq.status === 'pending' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReviewVerification(vReq.id, true)}
                          className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Grant Verified Status</span>
                        </button>
                        <button
                          onClick={() => handleReviewVerification(vReq.id, false)}
                          className="px-3 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject Application</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono">Review Notes: {vReq.review_notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Data Sources */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">Trusted Global Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((src) => (
              <div key={src.id} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{src.source_name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700">
                    {src.source_type}
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-[11px] truncate">{src.url_api}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-medium">
                  <span>Reliability: {src.reliability_rating}/5 Stars</span>
                  <span>Country: {src.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Activity Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900">System Admin Activity Audit Trail</h2>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-blue-700 font-bold">{log.admin_name}</span>
                  <span className="text-slate-600"> executed </span>
                  <span className="text-amber-800 font-bold">{log.action}</span>
                  <span className="text-slate-600"> on {log.target_type} ({log.target_id})</span>
                </div>
                <span className="text-slate-500 text-[10px] font-bold">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
