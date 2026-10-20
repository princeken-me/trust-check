import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Building2, ShieldAlert, Scale, FileCheck, MessageSquare, 
  Award, Briefcase, Database, SearchCode, Bell, FileText, Users, BarChart3, 
  Settings, History, Plus, Search, Filter, CheckCircle2, XCircle, AlertTriangle, 
  Eye, Edit3, Trash2, Archive, RotateCcw, Lock, RefreshCw, ExternalLink, 
  ChevronRight, UserX, UserCheck, Check, ArrowUpRight, ArrowDownRight, Layers,
  Globe, Shield, Clock, HelpCircle, FilePlus, Zap
} from 'lucide-react';
import { 
  UserRole, Entity, TrustScore, RiskSignal, Evidence, UserReport, 
  VerificationRequest, ReviewExperience, DataSource, ResearchTask, 
  ContentItem, SystemSettings, AdminActivityLog 
} from '../types/index.js';
import { 
  fetchEntities, fetchAdminReports, fetchAdminVerifications, 
  fetchAdminLogs, fetchDataSources, fetchResearchQueue,
  dispatchResearchJob, processResearchJob, fetchDuplicateScan, triggerScheduler
} from '../services/api.js';

interface AdminControlCenterProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  currentRole,
  setCurrentRole,
  onNavigateTab
}) => {
  // Navigation tabs inside Admin Control Center
  const [activeTab, setActiveTab] = useState<
    'overview' | 'entities' | 'scores' | 'signals' | 'evidence' | 
    'reports' | 'reviews' | 'verifications' | 'businesses' | 'sources' | 
    'research' | 'alerts' | 'content' | 'users' | 'analytics' | 'settings' | 'audit'
  >('overview');

  // Permission checks
  const isSuperAdmin = currentRole === 'Super Admin';
  const isAdmin = currentRole === 'Admin' || isSuperAdmin;
  const isAnalyst = currentRole === 'Analyst' || isAdmin;
  const isModerator = currentRole === 'Moderator' || isAnalyst;
  const isVerifiedBusiness = currentRole === 'Verified Business';
  const isRegularUser = currentRole === 'Regular User';

  // Global State Stores
  const [entities, setEntities] = useState<Entity[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  // Mocked state for extra modules
  const [reviews, setReviews] = useState<ReviewExperience[]>([
    {
      id: 'rev-101',
      entity_id: 'ent-apex-01',
      user_id: 'usr-101',
      user_name: 'David K.',
      rating: 1,
      title: 'Did not receive freight tracking updates',
      content: 'I booked a shipping container via Apex Global Logistics and the tracking code was invalid for 5 days. Support refused to respond.',
      moderation_status: 'pending',
      created_at: '2026-07-28T14:30:00Z'
    },
    {
      id: 'rev-102',
      entity_id: 'ent-veritas-02',
      user_id: 'usr-102',
      user_name: 'Elena Rostova',
      rating: 5,
      title: 'Verified official corporate registry',
      content: 'Confirmed registration with Companies House UK. Legitimate corporate legal standing.',
      moderation_status: 'approved',
      moderated_by: 'usr-analyst-1',
      moderated_at: '2026-07-27T09:12:00Z',
      created_at: '2026-07-27T08:00:00Z'
    }
  ]);

  const [researchTasks, setResearchTasks] = useState<ResearchTask[]>([
    {
      id: 'res-301',
      entity_id: 'ent-resell-03',
      entity_name: 'Resell Prime Deals Global',
      research_type: 'Domain research',
      status: 'completed',
      assigned_to: 'Senior Analyst Desk',
      sources_selected: ['ICANN WHOIS', 'SecurityTrails DNS History', 'Companies House'],
      findings: 'Domain created 3 days ago under privacy proxy in Iceland. Identical shop layout cloned from 4 previous fraudulent store domains.',
      created_at: '2026-07-28T11:00:00Z',
      completed_at: '2026-07-28T14:15:00Z'
    },
    {
      id: 'res-302',
      entity_id: 'ent-apex-01',
      entity_name: 'Apex Global Logistics',
      research_type: 'Business verification',
      status: 'in_progress',
      assigned_to: 'Verification Auditor',
      sources_selected: ['US Federal Maritime Commission', 'D&B Hoovers', 'OpenCorporates'],
      created_at: '2026-07-29T07:45:00Z'
    }
  ]);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 'cnt-1',
      content_type: 'faq',
      title: 'How does TrustCheck calculate composite trust scores?',
      category: 'Scoring Methodology',
      body: 'TrustCheck evaluates domain longevity, TLS certificates, corporate registry numbers, threat feeds, and community reports.',
      is_published: true,
      author: 'Compliance Desk',
      created_at: '2026-06-01T00:00:00Z'
    },
    {
      id: 'cnt-2',
      content_type: 'safety_guide',
      title: '5 Warning Signs of Fake Employment & Remote Job Scams',
      category: 'Consumer Protection',
      body: 'Be cautious of interviews conducted strictly via messaging apps, requests to deposit cashier checks, or mandatory upfront equipment purchases.',
      is_published: true,
      author: 'Security Analyst Team',
      created_at: '2026-06-15T00:00:00Z'
    }
  ]);

  const [sysSettings, setSysSettings] = useState<SystemSettings>({
    site_name: 'TrustCheck Intelligence',
    slogan: 'Before you trust it, check it.',
    contact_email: 'compliance@trustcheck.org',
    support_phone: '+1 (800) 555-0199',
    max_upload_size_mb: 15,
    score_sensitivity: 'standard',
    auto_moderation_threshold: 85,
    maintenance_mode: false,
    public_reports_enabled: true,
    audit_logging_enabled: true
  });

  const [alertsList, setAlertsList] = useState([
    { id: 'alt-1', type: 'high_risk', title: 'New High Risk Signal', entity: 'Resell Prime Deals Global', detail: 'Identical scam shop clone detected', time: '10 mins ago' },
    { id: 'alt-2', type: 'report', title: 'Pending Report Spike', entity: 'Apex Global Freight', detail: '3 new incident reports received in last 2 hours', time: '1 hour ago' },
    { id: 'alt-3', type: 'verification', title: 'New Claim Request', entity: 'Veritas Financial Advisory', detail: 'Uploaded SEC Form ADV documentation', time: '3 hours ago' },
  ]);

  // Filters & Modal States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEntityForAction, setSelectedEntityForAction] = useState<Entity | null>(null);
  const [modalMode, setModalMode] = useState<'create_entity' | 'override_score' | 'add_signal' | 'create_research' | 'create_content' | null>(null);

  // Form Fields
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState('Website');
  const [newEntityDesc, setNewEntityDesc] = useState('');
  const [overrideScoreValue, setOverrideScoreValue] = useState<number>(50);
  const [overrideReason, setOverrideReason] = useState('');
  const [newSignalName, setNewSignalName] = useState('');
  const [newSignalSeverity, setNewSignalSeverity] = useState<'critical' | 'high' | 'medium' | 'low' | 'info'>('high');
  const [newSignalDesc, setNewSignalDesc] = useState('');
  const [researchEntityId, setResearchEntityId] = useState('');
  const [researchTypeSelect, setResearchTypeSelect] = useState('Website review');
  const [contentTitle, setContentTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentType, setContentType] = useState<'faq' | 'safety_guide' | 'announcement'>('faq');

  const [queueLogs, setQueueLogs] = useState<any[]>([]);
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [schedulerStatus, setSchedulerStatus] = useState<string | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);

  // Load backend data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ents, reps, vers, logs, srcs, qData, dupData] = await Promise.all([
        fetchEntities(),
        fetchAdminReports(),
        fetchAdminVerifications(),
        fetchAdminLogs(),
        fetchDataSources(),
        fetchResearchQueue().catch(() => ({ tasks: [], logs: [] })),
        fetchDuplicateScan().catch(() => ({ total_matches: 0, matches: [] }))
      ]);
      setEntities(ents);
      setReports(reps);
      setVerifications(vers);
      setActivityLogs(logs);
      setDataSources(srcs);
      if (qData.tasks && qData.tasks.length > 0) setResearchTasks(qData.tasks);
      if (qData.logs) setQueueLogs(qData.logs);
      if (dupData.matches) setDuplicateMatches(dupData.matches);
    } catch (err) {
      console.error('Error loading admin control center data:', err);
    }
  };

  const addAuditLog = (action: string, targetType: string, targetId: string, oldVal?: any, newVal?: any) => {
    const log: AdminActivityLog = {
      id: `log-${Date.now()}`,
      admin_id: 'usr-admin-current',
      admin_name: `${currentRole} Admin`,
      action,
      target_type: targetType,
      target_id: targetId,
      old_values: oldVal,
      new_values: newVal,
      ip_address: '192.168.1.104',
      created_at: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    const newEnt: Entity = {
      id: `ent-${Date.now()}`,
      name: newEntityName,
      slug: newEntityName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      entity_type: newEntityType as any,
      description: newEntityDesc || 'Manually added entity profile for compliance screening.',
      status: 'active',
      verification_status: 'unverified',
      trust_status: 'neutral',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_score: {
        id: `ts-${Date.now()}`,
        entity_id: `ent-${Date.now()}`,
        score: 65,
        risk_level: 'Generally Low Risk',
        trust_signals_count: 2,
        risk_signals_count: 1,
        confidence: 70,
        score_explanation: 'Initial baseline evaluation',
        calculated_date: new Date().toISOString()
      }
    };

    setEntities(prev => [newEnt, ...prev]);
    addAuditLog('Created Entity', 'Entity', newEnt.id, null, { name: newEnt.name, type: newEnt.entity_type });
    setModalMode(null);
    setNewEntityName('');
    setNewEntityDesc('');
  };

  const handleOverrideScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntityForAction || !overrideReason.trim()) return;

    let newRiskLevel: any = 'Moderate Risk';
    if (overrideScoreValue >= 80) newRiskLevel = 'Strong Trust Signals';
    else if (overrideScoreValue >= 60) newRiskLevel = 'Generally Low Risk';
    else if (overrideScoreValue >= 40) newRiskLevel = 'Moderate Risk';
    else if (overrideScoreValue >= 20) newRiskLevel = 'High Risk';
    else newRiskLevel = 'Suspicious';

    const oldScore = selectedEntityForAction.current_score?.score || 50;

    setEntities(prev => prev.map(ent => {
      if (ent.id === selectedEntityForAction.id) {
        return {
          ...ent,
          current_score: {
            ...ent.current_score!,
            score: overrideScoreValue,
            risk_level: newRiskLevel,
            score_explanation: `Manual Admin Override: ${overrideReason}`,
            calculated_date: new Date().toISOString()
          }
        };
      }
      return ent;
    }));

    addAuditLog(
      'Manual Trust Score Override', 
      'TrustScore', 
      selectedEntityForAction.id, 
      { score: oldScore }, 
      { score: overrideScoreValue, reason: overrideReason }
    );

    setModalMode(null);
    setOverrideReason('');
    setSelectedEntityForAction(null);
  };

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntityForAction || !newSignalName.trim()) return;

    addAuditLog(
      'Added Risk Signal', 
      'RiskSignal', 
      selectedEntityForAction.id, 
      null, 
      { name: newSignalName, severity: newSignalSeverity }
    );

    alert(`Risk signal "${newSignalName}" added to entity ${selectedEntityForAction.name}. Trust score recalculation queued.`);
    setModalMode(null);
    setNewSignalName('');
    setNewSignalDesc('');
    setSelectedEntityForAction(null);
  };

  const handleCreateResearchTask = (e: React.FormEvent) => {
    e.preventDefault();
    const ent = entities.find(e => e.id === researchEntityId) || entities[0];
    if (!ent) return;

    const newTask: ResearchTask = {
      id: `res-${Date.now()}`,
      entity_id: ent.id,
      entity_name: ent.name,
      research_type: researchTypeSelect as any,
      status: 'pending',
      assigned_to: 'Compliance Desk Analyst',
      sources_selected: ['ICANN WHOIS', 'OpenCorporates', 'SEC EDGAR'],
      created_at: new Date().toISOString()
    };

    setResearchTasks(prev => [newTask, ...prev]);
    addAuditLog('Created Research Task', 'ResearchTask', newTask.id, null, { type: newTask.research_type, entity: ent.name });
    setModalMode(null);
  };

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim() || !contentBody.trim()) return;

    const newCnt: ContentItem = {
      id: `cnt-${Date.now()}`,
      content_type: contentType,
      title: contentTitle,
      body: contentBody,
      is_published: true,
      author: `${currentRole}`,
      created_at: new Date().toISOString()
    };

    setContentItems(prev => [newCnt, ...prev]);
    addAuditLog('Published Public Content', 'ContentItem', newCnt.id, null, { title: newCnt.title });
    setModalMode(null);
    setContentTitle('');
    setContentBody('');
  };

  const handleApproveReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'actioned', moderation_notes: 'Approved & non-binding risk signal added' } : r));
    addAuditLog('Approved Incident Report', 'UserReport', reportId);
  };

  const handleRejectReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'dismissed', moderation_notes: 'Dismissed due to insufficient evidence' } : r));
    addAuditLog('Rejected Incident Report', 'UserReport', reportId);
  };

  const handleApproveVerification = (reqId: string) => {
    setVerifications(prev => prev.map(v => v.id === reqId ? { ...v, status: 'approved', review_notes: 'Identity & Corporate documentation verified' } : v));
    addAuditLog('Approved Verification Claim', 'VerificationRequest', reqId);
  };

  const handleRejectVerification = (reqId: string) => {
    setVerifications(prev => prev.map(v => v.id === reqId ? { ...v, status: 'rejected', review_notes: 'Insufficient document proof' } : v));
    addAuditLog('Rejected Verification Claim', 'VerificationRequest', reqId);
  };

  // Regular User Guard
  if (isRegularUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Access Restricted: Administrative Desk</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            The TrustCheck Admin Control Center is restricted to authorized Analysts, Moderators, Admins, and Super Admins.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded max-w-sm mx-auto text-xs space-y-2 shadow-2xs">
          <span className="font-bold text-slate-800 block">Switch Role (Dev Testing):</span>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentRole('Analyst')}
              className="px-3 py-1.5 rounded bg-blue-600 text-white font-bold text-xs"
            >
              Switch to Analyst
            </button>
            <button
              onClick={() => setCurrentRole('Super Admin')}
              className="px-3 py-1.5 rounded bg-slate-900 text-white font-bold text-xs"
            >
              Switch to Super Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold shadow-2xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase">TrustCheck Operational Control Center</h1>
            <p className="text-[10px] text-slate-400 font-mono">Environment: Operational • Security Clearance: {currentRole}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1 rounded border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Auto-Moderator Running</span>
          </div>

          <button
            onClick={loadData}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Refresh Operational Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Navigation Admin Sub-Tabs */}
        <div className="bg-white rounded-md border border-slate-200 p-2 shadow-2xs overflow-x-auto flex items-center space-x-1 scrollbar-none">
          {[
            { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
            { id: 'entities', label: '2. Entities', icon: Building2 },
            { id: 'scores', label: '3. Trust Scores', icon: Scale },
            { id: 'signals', label: '4. Risk Signals', icon: ShieldAlert },
            { id: 'evidence', label: '5. Evidence', icon: FileCheck },
            { id: 'reports', label: '6. Reports Queue', icon: MessageSquare, badge: reports.filter(r => r.status === 'pending').length },
            { id: 'reviews', label: '7. Reviews Desk', icon: StarIcon },
            { id: 'verifications', label: '8. Verification', icon: Award, badge: verifications.filter(v => v.status === 'pending').length },
            { id: 'businesses', label: '9. Businesses', icon: Briefcase },
            { id: 'sources', label: '10. Data Sources', icon: Database },
            { id: 'research', label: '11. Research Center', icon: SearchCode },
            { id: 'alerts', label: '12. Alerts', icon: Bell, badge: alertsList.length },
            { id: 'content', label: '13. Content', icon: FileText },
            { id: 'users', label: '14. User Roles', icon: Users },
            { id: 'analytics', label: '15. Analytics', icon: BarChart3 },
            { id: 'settings', label: '16. System Settings', icon: Settings },
            { id: 'audit', label: '17. Audit Log', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            MODULE 1: OVERVIEW DASHBOARD
           =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 12 Core KPI Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Entities', val: entities.length + 1240, sub: 'Cataloged in database' },
                { label: 'Websites Checked', val: '842,104', sub: 'Domain Whois & SSL' },
                { label: 'Total Businesses', val: '312,940', sub: 'Corporate registries' },
                { label: 'Verified Businesses', val: '4,812', sub: 'Claimed identity profile' },
                { label: 'Reports Received', val: reports.length + 95, sub: 'Total consumer reports' },
                { label: 'Reports Pending', val: reports.filter(r => r.status === 'pending').length, sub: 'Needs analyst review', alert: true },
                { label: 'Under Review', val: '14', sub: 'Active investigation' },
                { label: 'High-Risk Entities', val: '1,420', sub: 'Score < 30 / 100', warning: true },
                { label: 'Moderate-Risk Entities', val: '3,890', sub: 'Score 30-65 / 100' },
                { label: 'Score Changes Today', val: '184', sub: 'Recalculated in 24h' },
                { label: 'Verification Requests', val: verifications.length, sub: 'Document reviews' },
                { label: 'Evidence Awaiting Review', val: '28', sub: 'Unverified evidence items' },
              ].map((kpi, idx) => (
                <div key={idx} className={`bg-white rounded-md border p-4 shadow-2xs space-y-1 ${kpi.alert ? 'border-rose-300 bg-rose-50/20' : kpi.warning ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.label}</span>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.val}</div>
                  <p className="text-[11px] text-slate-500 font-medium">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Simulated Analytical Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Daily Verification Checks & Incident Reports */}
              <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Telemetry: Checks vs. Reports (7 Days)</h3>
                  <span className="text-xs text-slate-500 font-mono">Live Ingestion Stream</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                  {[
                    { day: 'Mon', checks: 65, reports: 12 },
                    { day: 'Tue', checks: 82, reports: 18 },
                    { day: 'Wed', checks: 95, reports: 14 },
                    { day: 'Thu', checks: 110, reports: 24 },
                    { day: 'Fri', checks: 140, reports: 31 },
                    { day: 'Sat', checks: 90, reports: 15 },
                    { day: 'Sun', checks: 125, reports: 28 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        <div style={{ height: `${bar.checks}%` }} className="w-3.5 bg-blue-600 rounded-t" title={`Checks: ${bar.checks * 100}`}></div>
                        <div style={{ height: `${bar.reports * 2.5}%` }} className="w-3.5 bg-rose-500 rounded-t" title={`Reports: ${bar.reports}`}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{bar.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-600 rounded-xs"></span>
                    <span>Daily Verification Checks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-rose-500 rounded-xs"></span>
                    <span>Incident Reports Submitted</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Risk Classification Distribution */}
              <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Risk Classification Breakdown</h3>
                  <span className="text-xs text-slate-500 font-mono">1.2M Index</span>
                </div>
                
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Strong Trust Signals (80-100)</span>
                      <span>52% (624,000)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[52%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Generally Low Risk (60-79)</span>
                      <span>28% (336,000)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                      <div className="bg-blue-600 h-full w-[28%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>Moderate Risk (40-59)</span>
                      <span>12% (144,000)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                      <div className="bg-amber-500 h-full w-[12%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>High Risk & Suspicious (0-39)</span>
                      <span>8% (96,000)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                      <div className="bg-rose-600 h-full w-[8%]"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 font-medium italic border-t border-slate-100">
                  Note: High-risk classifications require analyst evidence review prior to public indexing.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================
            MODULE 2: ENTITY MANAGEMENT
           =================================================================== */}
        {activeTab === 'entities' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Entity Directory Management</h2>
                <p className="text-xs text-slate-500 font-medium">Create, edit, merge duplicates, archive, or restore entity records.</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setModalMode('create_entity')}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Entity</span>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by entity name, slug, domain, or ID..."
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="flagged">Flagged</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Entity Table */}
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Entity Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Current Score</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {filteredEntities.map((ent) => (
                    <tr key={ent.id} className="hover:bg-slate-50/80">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{ent.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ent.id}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                          {ent.entity_type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                          (ent.current_score?.score || 50) < 40 ? 'bg-rose-100 text-rose-800' :
                          (ent.current_score?.score || 50) < 70 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ent.current_score?.score ?? 50} / 100
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-slate-600">{ent.verification_status}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ent.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          ent.status === 'flagged' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ent.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedEntityForAction(ent);
                            setOverrideScoreValue(ent.current_score?.score || 50);
                            setModalMode('override_score');
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                        >
                          Override Score
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEntityForAction(ent);
                            setModalMode('add_signal');
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] cursor-pointer"
                        >
                          Add Signal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 3: TRUST SCORE MANAGEMENT
           =================================================================== */}
        {activeTab === 'scores' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Trust Score Evaluation & Manual Override Desk</h2>
              <p className="text-xs text-slate-500 font-medium">
                View calculated composite scores, evaluate risk factors, and log manual override justifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {entities.map((ent) => (
                <div key={ent.id} className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50/50 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {ent.entity_type}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{ent.id}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{ent.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{ent.description}</p>
                  </div>

                  <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Calculated Score</span>
                      <span className="text-xl font-extrabold text-slate-900">{ent.current_score?.score ?? 50} / 100</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-bold text-xs text-slate-800">
                      {ent.current_score?.risk_level || 'Moderate Risk'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded font-mono">
                    <strong>Explanation:</strong> {ent.current_score?.score_explanation || 'Algorithmic baseline'}
                  </div>

                  {isAnalyst && (
                    <button
                      onClick={() => {
                        setSelectedEntityForAction(ent);
                        setOverrideScoreValue(ent.current_score?.score || 50);
                        setModalMode('override_score');
                      }}
                      className="w-full py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Manual Score Override
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 4: RISK SIGNAL MANAGEMENT
           =================================================================== */}
        {activeTab === 'signals' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Risk & Trust Signal Management</h2>
                <p className="text-xs text-slate-500 font-medium">Add, confirm, dispute, or adjust severity levels for detected risk signals.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'sig-1', entity: 'Resell Prime Deals Global', signal: 'Short Domain Registration Age', sev: 'high', cat: 'domain', conf: 95, state: 'confirmed' },
                { id: 'sig-2', entity: 'Apex Global Logistics', signal: 'Unverified Corporate Registration Number', sev: 'medium', cat: 'identity', conf: 80, state: 'disputed' },
                { id: 'sig-3', entity: 'High Yield Crypto Fund', signal: 'Unrealistic Returns Claimed (>30% monthly)', sev: 'critical', cat: 'financial', conf: 99, state: 'confirmed' },
              ].map((s) => (
                <div key={s.id} className="p-4 rounded border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.sev === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.sev} severity
                      </span>
                      <span className="font-bold text-blue-600">{s.entity}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{s.signal}</h4>
                    <p className="text-slate-500">Category: {s.cat} • Signal Confidence: {s.conf}%</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                      {s.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 5: EVIDENCE MANAGEMENT
           =================================================================== */}
        {activeTab === 'evidence' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Evidence Audit Vault</h2>
              <p className="text-xs text-slate-500 font-medium">Review collected documents, public registries, screenshots, and evidence reliability ratings.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Evidence Source</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Target Entity</th>
                    <th className="p-3">Reliability</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {[
                    { id: 'ev-1', src: 'ICANN WHOIS Database', type: 'Public Record', ent: 'Resell Prime Deals', rel: 5, status: 'verified' },
                    { id: 'ev-2', src: 'User Payment Receipt PDF', type: 'Screenshot / Document', ent: 'Apex Global Logistics', rel: 4, status: 'unverified' },
                    { id: 'ev-3', src: 'Companies House UK Filing', type: 'Government Registry', ent: 'Veritas Financial Advisory', rel: 5, status: 'verified' },
                  ].map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{ev.src}</td>
                      <td className="p-3">{ev.type}</td>
                      <td className="p-3 text-blue-600 font-bold">{ev.ent}</td>
                      <td className="p-3">{ev.rel} / 5 Stars</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[10px] uppercase cursor-pointer">
                          Inspect File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 6: REPORT MODERATION QUEUE
           =================================================================== */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Incident Report Moderation Queue</h2>
                <p className="text-xs text-slate-500 font-medium">Review community incident submissions. All approved reports provide non-binding evidence.</p>
              </div>
              <span className="px-3 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs">
                {reports.filter(r => r.status === 'pending').length} Pending Review
              </span>
            </div>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50/50 text-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[10px] uppercase">
                        {rep.report_type}
                      </span>
                      <span className="font-bold text-slate-900">Target Entity ID: {rep.entity_id}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{rep.created_at}</span>
                  </div>

                  <p className="text-slate-700 font-medium leading-relaxed">{rep.description}</p>
                  {rep.evidence_summary && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                      <strong>Submitted Evidence:</strong> {rep.evidence_summary}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500 font-medium">Submitter: {rep.user_email || 'Anonymous Community Member'}</span>
                    <div className="flex items-center space-x-2">
                      {rep.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRejectReport(rep.id)}
                            className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 font-bold text-xs cursor-pointer"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleApproveReport(rep.id)}
                            className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                          >
                            Approve Report
                          </button>
                        </>
                      ) : (
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] bg-slate-200 px-3 py-1 rounded">
                          Status: {rep.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 7: REVIEW MODERATION
           =================================================================== */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">User Experience & Review Moderation</h2>
              <p className="text-xs text-slate-500 font-medium">Approve, flag, or hide user review submissions prior to public indexing.</p>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.title}</span>
                      <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                    </div>
                    <span className="text-slate-400 font-mono">{rev.created_at}</span>
                  </div>
                  <p className="text-slate-700">{rev.content}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">By {rev.user_name} • Status: {rev.moderation_status}</span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => setReviews(prev => prev.map(r => r.id === rev.id ? {...r, moderation_status: 'approved'} : r))}
                        className="px-3 py-1 rounded bg-slate-900 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => setReviews(prev => prev.map(r => r.id === rev.id ? {...r, moderation_status: 'rejected'} : r))}
                        className="px-3 py-1 rounded bg-rose-100 text-rose-800 font-bold text-[10px] cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 8: VERIFICATION CENTER
           =================================================================== */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Corporate Identity Verification Center</h2>
              <p className="text-xs text-slate-500 font-medium">Verify official corporate documentation, identity claims, and issue Verified badges.</p>
            </div>

            <div className="space-y-4">
              {verifications.map((v) => (
                <div key={v.id} className="border border-slate-200 rounded p-5 space-y-3 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{v.organization_name}</h3>
                    <span className="font-mono text-slate-400 text-[11px]">{v.submitted_at}</span>
                  </div>
                  <p className="text-slate-600"><strong>Submitted Documentation Summary:</strong> {v.documentation_summary}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-500">Attached files: {v.documentation_files.join(', ')}</span>
                    <div className="space-x-2">
                      {v.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRejectVerification(v.id)}
                            className="px-3 py-1.5 rounded bg-white text-rose-700 border border-rose-200 font-bold text-xs cursor-pointer"
                          >
                            Reject Application
                          </button>
                          <button
                            onClick={() => handleApproveVerification(v.id)}
                            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                          >
                            Approve & Badge Entity
                          </button>
                        </>
                      ) : (
                        <span className="font-bold text-slate-800 uppercase text-[11px] bg-slate-200 px-3 py-1 rounded">
                          Result: {v.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 9: BUSINESS MANAGEMENT
           =================================================================== */}
        {activeTab === 'businesses' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Registered Businesses Directory</h2>
            <div className="divide-y divide-slate-200">
              {[
                { name: 'Apex Global Freight Ltd.', reg: 'UK-0941294', claim: 'Claimed by CEO', status: 'verified' },
                { name: 'Veritas Financial Advisory', reg: 'SEC-49102', claim: 'Unclaimed Profile', status: 'unverified' },
              ].map((b, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{b.name}</span>
                    <span className="text-slate-500">{b.reg} • {b.claim}</span>
                  </div>
                  <button className="px-3 py-1 rounded bg-slate-900 text-white font-bold text-[10px] cursor-pointer">
                    Manage Business Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 10: DATA SOURCES MANAGEMENT
           =================================================================== */}
        {activeTab === 'sources' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Trusted Data Source Integrations</h2>
                <p className="text-xs text-slate-500 font-medium">Manage corporate registries, threat intelligence feeds, and WHOIS query nodes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {dataSources.map((ds) => (
                <div key={ds.id} className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 text-sm">{ds.source_name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] uppercase">Active</span>
                  </div>
                  <p className="text-slate-500 font-mono text-[11px]">{ds.url_api}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-600">
                    <span>Country: {ds.country}</span>
                    <span>Reliability: {ds.reliability_rating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 11: TRUST INTELLIGENCE ENGINE & RESEARCH CENTER
           =================================================================== */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                      Engine Core v2.4
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">Trust Intelligence Engine & Research Desk</h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Proprietary automation engine for entity resolution, multi-source evidence extraction, risk signal detection, and confidence calculation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      setSchedulerStatus('Executing background scheduler sweep...');
                      try {
                        const res = await triggerScheduler();
                        setSchedulerStatus(res.result?.summary || 'Scheduler completed successfully.');
                        addAuditLog('Triggered Engine Scheduler Sweep', 'Scheduler', 'cron-task', null, res.result);
                      } catch (err: any) {
                        setSchedulerStatus(`Scheduler failed: ${err.message}`);
                      }
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Scheduled Sweep</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const res = await fetchDuplicateScan();
                        setDuplicateMatches(res.matches || []);
                        addAuditLog('Executed System Duplicate Scan', 'DuplicateDetectionEngine', 'scan', null, { matches_found: res.total_matches });
                      } catch (err: any) {
                        alert(`Duplicate scan error: ${err.message}`);
                      }
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Scan Platform Duplicates</span>
                  </button>

                  {isAnalyst && (
                    <button
                      onClick={() => setModalMode('create_research')}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dispatch Research Job</span>
                    </button>
                  )}
                </div>
              </div>

              {schedulerStatus && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded font-mono text-xs text-blue-900 flex items-center justify-between">
                  <span>ℹ️ {schedulerStatus}</span>
                  <button onClick={() => setSchedulerStatus(null)} className="text-blue-700 font-bold hover:underline text-[10px]">Dismiss</button>
                </div>
              )}

              {/* Data Flow Architecture Step Map */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-md space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  Trust Intelligence Data Flow Architecture:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-medium">
                  {['User Input', 'Identify Entity', 'Collect Approved Info', 'Extract Facts', 'Match Entity', 'Collect Evidence', 'Detect Trust Signals', 'Detect Risk Signals', 'Check History', 'Calculate Score', 'Calculate Confidence', 'Human Review', 'Publish Report'].map((step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="bg-slate-800 px-2 py-1 rounded text-slate-200 border border-slate-700">
                        {idx + 1}. {step}
                      </span>
                      {idx < arr.length - 1 && <span className="text-slate-500 font-bold">➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Queue & Worker Jobs Table */}
            <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Laravel-Style Research Job Queue & Workers</h3>
                  <p className="text-slate-500 font-medium">Asynchronous processing tasks with automatic retry handling and execution telemetry.</p>
                </div>
                <span className="font-mono text-slate-500 text-xs">Total Jobs: {researchTasks.length}</span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Job ID</th>
                      <th className="p-3">Target Entity</th>
                      <th className="p-3">Research Scope</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Sources Selected</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    {researchTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{task.id}</td>
                        <td className="p-3 font-bold text-slate-900">{task.entity_name}</td>
                        <td className="p-3">{task.research_type}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                            task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'failed' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px]">{task.sources_selected.join(', ')}</td>
                        <td className="p-3 text-right space-x-2">
                          {task.status !== 'completed' && (
                            <button
                              onClick={async () => {
                                try {
                                  const res = await processResearchJob(task.id);
                                  setResearchTasks(prev => prev.map(t => t.id === task.id ? res.task : t));
                                  addAuditLog('Processed Research Queue Job', 'ResearchTask', task.id, null, res.task);
                                } catch (err: any) {
                                  alert(`Job execution error: ${err.message}`);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Process Worker
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Duplicate Detection Matrix Desk */}
            <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Duplicate & Pattern Matching Matrix</h3>
                  <p className="text-slate-500 font-medium">Detects shared contact details, identical domains, similar listings, or duplicate reports.</p>
                </div>
                <span className="font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-bold">
                  Matches Detected: {duplicateMatches.length}
                </span>
              </div>

              {duplicateMatches.length === 0 ? (
                <div className="p-6 text-center text-slate-500 italic bg-slate-50 rounded border border-slate-200">
                  No duplicate patterns detected in current database snapshot. Click "Scan Platform Duplicates" to initiate full cross-check.
                </div>
              ) : (
                <div className="space-y-3">
                  {duplicateMatches.map((m, i) => (
                    <div key={i} className="p-4 rounded border border-amber-200 bg-amber-50/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">
                          Match Type: {m.match_type.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold font-mono text-[10px]">
                          Similarity Score: {m.similarity_score}%
                        </span>
                      </div>
                      <p className="text-slate-800 text-xs font-medium">{m.notes}</p>
                      <div className="text-[11px] font-mono text-slate-500 pt-1">
                        Matched Value: {m.matched_value} • Entities: {m.entity_id_a} ↔ {m.entity_id_b}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Findings Review Desk */}
            <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Automated Findings Analyst Review Desk</h3>
                <p className="text-slate-500 font-medium">Review findings generated by the engine. Approve, edit, reject, or request further evidence prior to public publishing.</p>
              </div>

              <div className="space-y-4">
                {entities.slice(0, 4).map((ent) => (
                  <div key={ent.id} className="p-5 rounded-md border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <span className="font-extrabold text-slate-900 text-base">{ent.name}</span>
                        <span className="ml-2 px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                          {ent.entity_type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="text-slate-600 font-bold">Preliminary Score:</span>
                        <span className={`px-2.5 py-1 rounded font-extrabold text-white text-xs ${
                          (ent.current_score?.score || 70) >= 80 ? 'bg-emerald-600' :
                          (ent.current_score?.score || 70) >= 50 ? 'bg-amber-600' : 'bg-rose-600'
                        }`}>
                          {ent.current_score?.score || 75} / 100
                        </span>
                        <span className="text-slate-500 text-[11px]">(Confidence: {ent.current_score?.confidence || 85}%)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 uppercase text-[10px] text-emerald-700 block">Trust Signals Evaluated</span>
                        <p className="text-slate-600">Verified SSL certificate, domain history &gt; 2 years, verified corporate listing.</p>
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 uppercase text-[10px] text-rose-700 block">Risk Signals Evaluated</span>
                        <p className="text-slate-600">No unresolved legal claims. Minor unverified contact address indicator.</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
                      <div className="text-slate-500 italic text-[11px]">
                        Recommended Action: <strong>{ent.verification_status === 'verified' ? 'Publish Trust Report' : 'Request Official Documentation'}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            addAuditLog('Approved Intelligence Findings', 'Entity', ent.id, null, { status: 'approved' });
                            alert(`Findings approved for ${ent.name}. Published trust report updated.`);
                          }}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] cursor-pointer"
                        >
                          Approve Finding
                        </button>

                        <button
                          onClick={() => {
                            setSelectedEntityForAction(ent);
                            setModalMode('override_score');
                          }}
                          className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-[10px] cursor-pointer"
                        >
                          Edit / Override
                        </button>

                        <button
                          onClick={() => {
                            addAuditLog('Marked Entity Finding Disputed', 'Entity', ent.id, null, { status: 'disputed' });
                            alert(`Marked entity ${ent.name} as Disputed.`);
                          }}
                          className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase text-[10px] cursor-pointer"
                        >
                          Mark Disputed
                        </button>

                        <button
                          onClick={() => {
                            addAuditLog('Rejected Finding Signal', 'Entity', ent.id, null, { status: 'rejected' });
                            alert(`Finding dismissed for ${ent.name}.`);
                          }}
                          className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold uppercase text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            MODULE 12: ALERT CENTER
           =================================================================== */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Platform System Alert Center</h2>
            <div className="space-y-3 text-xs">
              {alertsList.map((alt) => (
                <div key={alt.id} className="p-4 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{alt.title}</span>
                    <span className="text-blue-600 font-bold">{alt.entity}</span> • <span className="text-slate-600">{alt.detail}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{alt.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 13: CONTENT MANAGEMENT
           =================================================================== */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Public Content & Safety Guides CMS</h2>
                <p className="text-xs text-slate-500 font-medium">Publish FAQs, safety guides, and platform consumer protection advisories.</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setModalMode('create_content')}
                  className="px-4 py-2 rounded bg-slate-900 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Publish New Article
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {contentItems.map((cnt) => (
                <div key={cnt.id} className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{cnt.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">Published</span>
                  </div>
                  <p className="text-slate-600">{cnt.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 14: USER MANAGEMENT
           =================================================================== */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">User Role & Permission Governance</h2>
              <p className="text-xs text-slate-500 font-medium">Manage user accounts, administrative role assignments, and suspensions.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {[
                    { name: 'Super Admin User', email: 'admin@trustcheck.org', role: 'Super Admin', status: 'active' },
                    { name: 'Senior Compliance Analyst', email: 'analyst@trustcheck.org', role: 'Analyst', status: 'active' },
                    { name: 'Community Moderator', email: 'mod@trustcheck.org', role: 'Moderator', status: 'active' },
                    { name: 'Apex Logistics Corporate Rep', email: 'corporate@apexglobal.com', role: 'Verified Business', status: 'active' },
                  ].map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 font-bold text-blue-600">{u.role}</td>
                      <td className="p-3 capitalize">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 15: ANALYTICS
           =================================================================== */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-6 shadow-2xs text-xs">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Advanced Risk Intelligence Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">Most Checked Categories</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>1. E-Commerce Storefronts (42%)</li>
                  <li>2. Remote Job Listings (24%)</li>
                  <li>3. High Yield Investment (18%)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">Most Active Jurisdictions</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>1. United States (38%)</li>
                  <li>2. United Kingdom (22%)</li>
                  <li>3. Germany (12%)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase">Top Risk Signals</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>1. Domain Age &lt; 30 Days (35%)</li>
                  <li>2. Upfront Payment Requirement (28%)</li>
                  <li>3. Cloned Terms & Privacy Pages (15%)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 16: SYSTEM SETTINGS
           =================================================================== */}
        {activeTab === 'settings' && isSuperAdmin && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-6 shadow-2xs text-xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Platform Global Parameters & Settings</h2>
              <p className="text-slate-500 font-medium">Configure site identity, scoring sensitivity, upload limits, and maintenance modes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={sysSettings.site_name}
                  onChange={(e) => setSysSettings({ ...sysSettings, site_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Compliance Email</label>
                <input
                  type="email"
                  value={sysSettings.contact_email}
                  onChange={(e) => setSysSettings({ ...sysSettings, contact_email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Max Upload Limit (MB)</label>
                <input
                  type="number"
                  value={sysSettings.max_upload_size_mb}
                  onChange={(e) => setSysSettings({ ...sysSettings, max_upload_size_mb: parseInt(e.target.value) || 10 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Score Engine Sensitivity</label>
                <select
                  value={sysSettings.score_sensitivity}
                  onChange={(e) => setSysSettings({ ...sysSettings, score_sensitivity: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="conservative">Conservative</option>
                  <option value="standard">Standard</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  addAuditLog('Updated Global System Settings', 'SystemSettings', 'global', null, sysSettings);
                  alert('System settings saved successfully');
                }}
                className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs transition cursor-pointer"
              >
                Save System Configuration
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODULE 17: AUDIT LOG
           =================================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Immutable Administrative Audit Log</h2>
              <p className="text-xs text-slate-500 font-medium">Comprehensive record of all score overrides, entity modifications, and report approvals.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Administrator</th>
                    <th className="p-3">Action Executed</th>
                    <th className="p-3">Target ID</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">{log.created_at}</td>
                      <td className="p-3 font-bold text-blue-600">{log.admin_name}</td>
                      <td className="p-3 font-bold">{log.action}</td>
                      <td className="p-3 text-slate-600">{log.target_id}</td>
                      <td className="p-3 text-slate-400">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ===================================================================
          MODALS
         =================================================================== */}
      
      {/* 1. Modal: Create Entity */}
      {modalMode === 'create_entity' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">Create New Entity Record</h3>
            <form onSubmit={handleCreateEntity} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder="e.g. Apex Global Logistics Ltd."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Entity Type</label>
                <select
                  value={newEntityType}
                  onChange={(e) => setNewEntityType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  {['Website', 'Business', 'Seller', 'Job Offer', 'Rental Listing', 'Investment Opportunity'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newEntityDesc}
                  onChange={(e) => setNewEntityDesc(e.target.value)}
                  placeholder="Provide brief background description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold cursor-pointer"
                >
                  Create Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Manual Score Override */}
      {modalMode === 'override_score' && selectedEntityForAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              Manual Trust Score Override: {selectedEntityForAction.name}
            </h3>
            <form onSubmit={handleOverrideScore} className="space-y-4">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>New Override Trust Score (0-100)</span>
                  <span className="font-mono text-blue-600 text-sm">{overrideScoreValue} / 100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={overrideScoreValue}
                  onChange={(e) => setOverrideScoreValue(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Mandatory Override Justification / Audit Explanation *</label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State clear reasons (e.g., Verified official corporate filing received / Confirmed fraud cluster match)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-rose-600 text-white font-bold cursor-pointer"
                >
                  Confirm Override & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Add Signal */}
      {modalMode === 'add_signal' && selectedEntityForAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">
              Attach Risk Signal to {selectedEntityForAction.name}
            </h3>
            <form onSubmit={handleAddSignal} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Signal Name *</label>
                <input
                  type="text"
                  required
                  value={newSignalName}
                  onChange={(e) => setNewSignalName(e.target.value)}
                  placeholder="e.g. Cloned Privacy Policy Text"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Severity</label>
                <select
                  value={newSignalSeverity}
                  onChange={(e) => setNewSignalSeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold cursor-pointer"
                >
                  Save Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Create Research Task */}
      {modalMode === 'create_research' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">Initiate Research Task</h3>
            <form onSubmit={handleCreateResearchTask} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Entity</label>
                <select
                  value={researchEntityId}
                  onChange={(e) => setResearchEntityId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.entity_type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Research Scope Type</label>
                <select
                  value={researchTypeSelect}
                  onChange={(e) => setResearchTypeSelect(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                >
                  {['Website review', 'Business verification', 'Domain research', 'Job verification', 'Rental listing review', 'Investment opportunity review', 'Duplicate detection'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold cursor-pointer"
                >
                  Start Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Create Content */}
      {modalMode === 'create_content' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">Publish Public CMS Article</h3>
            <form onSubmit={handleCreateContent} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="e.g. How to Verify Online Storefront Security"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Content Body *</label>
                <textarea
                  required
                  rows={4}
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  placeholder="Write clear advisory content..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal icon component for Star rating
function StarIcon(props: any) {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
