import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { HeroSearch } from './components/HeroSearch.js';
import { CategoryShortcuts } from './components/CategoryShortcuts.js';
import { HowItWorks } from './components/HowItWorks.js';
import { SpecializedCheckers } from './components/SpecializedCheckers.js';
import { EntityProfile } from './components/EntityProfile.js';
import { EntityDirectory } from './components/EntityDirectory.js';
import { ModerationDashboard } from './components/ModerationDashboard.js';
import { WatchlistPanel } from './components/WatchlistPanel.js';
import { ArchitectureSpecView } from './components/ArchitectureSpecView.js';
import { ReportPage } from './components/ReportPage.js';
import { UserAccountView } from './components/UserAccountView.js';
import { AboutView } from './components/AboutView.js';
import { LegalView } from './components/LegalView.js';
import { ContactView } from './components/ContactView.js';
import { AdminControlCenter } from './components/AdminControlCenter.js';
import { SeoHead } from './components/SeoHead.js';
import { ReportModal } from './components/ReportModal.js';
import { VerificationModal } from './components/VerificationModal.js';
import { 
  checkEntity, fetchEntityById, fetchWatchlist, toggleWatchlist, 
  submitReport, submitVerificationRequest, fetchAdminReports 
} from './services/api.js';
import { UserRole } from './types/index.js';
import { ChevronRight, ShieldCheck, Home as HomeIcon } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('search');
  const [currentRole, setCurrentRole] = useState<UserRole>('Regular User');
  
  const [selectedEntityData, setSelectedEntityData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [pendingReportsCount, setPendingReportsCount] = useState<number>(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Website');

  // Modal states
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [modalEntityId, setModalEntityId] = useState<string>('');

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) {
      setCurrentTab('admin');
      setCurrentRole('Super Admin');
    }
    loadWatchlistData();
    loadReportsCount();
  }, []);

  const loadWatchlistData = async () => {
    try {
      const items = await fetchWatchlist();
      setWatchlist(items);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const loadReportsCount = async () => {
    try {
      const reports = await fetchAdminReports();
      const pending = reports.filter((r: any) => r.status === 'pending' || r.status === 'under_review').length;
      setPendingReportsCount(pending);
    } catch (err) {
      console.error('Error fetching admin reports count:', err);
    }
  };

  const handleSearch = async (query: string, inputType: string) => {
    setIsLoading(true);
    try {
      const result = await checkEntity(query, inputType);
      setSelectedEntityData(result);
      setCurrentTab('profile');
    } catch (err: any) {
      alert(`Search failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEntity = async (entityId: string) => {
    setIsLoading(true);
    try {
      const result = await fetchEntityById(entityId);
      setSelectedEntityData(result);
      setCurrentTab('profile');
    } catch (err) {
      alert('Could not fetch entity profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategoryShortcut = (category: string) => {
    setActiveCategoryFilter(category);
    setCurrentTab('checkers');
  };

  const handleToggleWatchlist = async (entityId: string) => {
    try {
      await toggleWatchlist(entityId);
      await loadWatchlistData();
    } catch (err) {
      alert('Failed updating watchlist');
    }
  };

  const isEntityWatched = (entityId: string) => {
    return watchlist.some((item) => item.entity_id === entityId || item.entity?.id === entityId);
  };

  const handleOpenReportModal = (entityId: string) => {
    setModalEntityId(entityId);
    setReportModalOpen(true);
  };

  const handleOpenVerificationModal = (entityId: string) => {
    setModalEntityId(entityId);
    setVerificationModalOpen(true);
  };

  const handleReportSubmit = async (payload: any) => {
    await submitReport(payload);
    await loadReportsCount();
  };

  const handleVerificationSubmit = async (payload: any) => {
    await submitVerificationRequest(payload);
  };

  // Human-readable breadcrumb labels
  const getBreadcrumbLabel = (tab: string) => {
    switch(tab) {
      case 'search': return 'Universal Checker';
      case 'checkers': return 'Specialized Category Checkers';
      case 'directory': return 'Global Entity Directory';
      case 'profile': return selectedEntityData?.entity?.name || 'Trust Report';
      case 'report': return 'Report Online Incident';
      case 'verification': return 'Corporate Business Verification';
      case 'account': return 'Consumer Account & Watchlist';
      case 'watchlist': return 'Monitored Watchlist';
      case 'about': return 'About TrustCheck';
      case 'legal': return 'Legal & Governance Policies';
      case 'contact': return 'Contact Compliance Desk';
      case 'admin': return 'Admin Control Center';
      case 'moderation': return 'Moderation Case Management';
      case 'architecture': return 'System Architecture Specification';
      default: return tab;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SeoHead
        title={
          currentTab === 'profile' && selectedEntityData?.entity?.name
            ? `${selectedEntityData.entity.name} - Verification & Trust Score (${selectedEntityData.score?.score || 75}/100)`
            : getBreadcrumbLabel(currentTab)
        }
        description={
          currentTab === 'profile' && selectedEntityData?.entity?.description
            ? `Read public trust report and risk signal analysis for ${selectedEntityData.entity.name}. ${selectedEntityData.entity.description}`
            : 'TrustCheck - Global Trust Intelligence & Verification Engine. Verify websites, businesses, job offers, rental listings, and online identities.'
        }
        schemaData={
          currentTab === 'profile' && selectedEntityData?.entity
            ? {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: selectedEntityData.entity.name,
                url: selectedEntityData.entity.website || 'https://trustcheck.org',
                description: selectedEntityData.entity.description,
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: selectedEntityData.score?.score ? (selectedEntityData.score.score / 20).toFixed(1) : '4.0',
                  reviewCount: selectedEntityData.score?.trust_signals_count || 5,
                  bestRating: '5',
                  worstRating: '1'
                }
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'TrustCheck',
                url: 'https://trustcheck.org',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://trustcheck.org/?q={search_term_string}',
                  'query-input': 'required name=search_term_string'
                }
              }
        }
      />
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        watchlistCount={watchlist.length}
        pendingReportsCount={pendingReportsCount}
      />

      {/* Global Breadcrumbs Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <button 
            onClick={() => setCurrentTab('search')}
            className="hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          {currentTab !== 'search' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">{getBreadcrumbLabel(currentTab)}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content View Switcher */}
      <main className="flex-1">
        
        {/* 1. HOME / UNIVERSAL CHECKER */}
        {currentTab === 'search' && (
          <div>
            <HeroSearch onSearch={handleSearch} isLoading={isLoading} />
            <CategoryShortcuts 
              onSelectCategory={handleSelectCategoryShortcut} 
              activeCategory={activeCategoryFilter}
            />
            <HowItWorks />
            <div className="py-4">
              <EntityDirectory onSelectEntity={handleSelectEntity} />
            </div>
          </div>
        )}

        {/* 2. SPECIALIZED CHECKERS */}
        {currentTab === 'checkers' && (
          <SpecializedCheckers 
            onSearch={handleSearch} 
            isLoading={isLoading}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {/* 3. GLOBAL DIRECTORY */}
        {currentTab === 'directory' && (
          <EntityDirectory onSelectEntity={handleSelectEntity} />
        )}

        {/* 4. TRUST REPORT PROFILE */}
        {currentTab === 'profile' && selectedEntityData && (
          <EntityProfile
            data={selectedEntityData}
            onBack={() => setCurrentTab('search')}
            onToggleWatchlist={handleToggleWatchlist}
            isWatched={isEntityWatched(selectedEntityData.entity.id)}
            onOpenReportModal={handleOpenReportModal}
            onOpenVerificationModal={handleOpenVerificationModal}
          />
        )}

        {/* 5. INCIDENT REPORT PAGE */}
        {currentTab === 'report' && (
          <ReportPage onRefreshReports={loadReportsCount} />
        )}

        {/* 6. CORPORATE VERIFICATION PAGE */}
        {currentTab === 'verification' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
            <div className="bg-white rounded-md border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TrustCheck Corporate Business Verification</h1>
              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
                Legitimate organizations, domain owners, and licensed entities can submit corporate documentation to earn the official <strong>Verified Identity</strong> badge and enhance public trust signals.
              </p>
              <button
                onClick={() => handleOpenVerificationModal(selectedEntityData?.entity?.id || 'ent-apex-01')}
                className="px-6 py-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-2xs cursor-pointer"
              >
                Start Verification Claim
              </button>
            </div>
          </div>
        )}

        {/* 7. USER ACCOUNT & WATCHLIST */}
        {currentTab === 'account' && (
          <UserAccountView
            watchlist={watchlist}
            onSelectEntity={handleSelectEntity}
            onRemoveWatchlist={handleToggleWatchlist}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'watchlist' && (
          <WatchlistPanel
            items={watchlist}
            onSelectEntity={handleSelectEntity}
            onRemove={handleToggleWatchlist}
          />
        )}

        {/* 8. ABOUT PAGE */}
        {currentTab === 'about' && (
          <AboutView />
        )}

        {/* 9. LEGAL PAGES */}
        {currentTab === 'legal' && (
          <LegalView />
        )}

        {/* 10. CONTACT PAGE */}
        {currentTab === 'contact' && (
          <ContactView />
        )}

        {/* 11. ADMIN CONTROL CENTER (/admin) */}
        {currentTab === 'admin' && (
          <AdminControlCenter
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* 12. STAFF MODERATION DASHBOARD */}
        {currentTab === 'moderation' && (
          <ModerationDashboard
            currentRole={currentRole}
            onRefreshData={loadReportsCount}
          />
        )}

        {/* 13. SYSTEM ARCHITECTURE SPEC */}
        {currentTab === 'architecture' && (
          <ArchitectureSpecView />
        )}

      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-8 text-slate-600 text-xs mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">TrustCheck</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              "Before you trust it, check it."
              <br />
              Global trust intelligence and consumer risk verification platform.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Verification Engines</div>
            <ul className="space-y-1 text-slate-600 text-xs">
              <li><button onClick={() => setCurrentTab('checkers')} className="hover:text-blue-600">Website Domain Auditor</button></li>
              <li><button onClick={() => setCurrentTab('checkers')} className="hover:text-blue-600">Business Registry Search</button></li>
              <li><button onClick={() => setCurrentTab('checkers')} className="hover:text-blue-600">Job Offer Scam Auditor</button></li>
              <li><button onClick={() => setCurrentTab('checkers')} className="hover:text-blue-600">Rental Property Verification</button></li>
              <li><button onClick={() => setCurrentTab('checkers')} className="hover:text-blue-600">Investment Yield Screening</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Public Services</div>
            <ul className="space-y-1 text-slate-600 text-xs">
              <li><button onClick={() => setCurrentTab('directory')} className="hover:text-blue-600">Global Entity Index</button></li>
              <li><button onClick={() => setCurrentTab('report')} className="hover:text-blue-600 text-rose-600 font-medium">Report Incident</button></li>
              <li><button onClick={() => setCurrentTab('verification')} className="hover:text-blue-600">Claim Corporate Profile</button></li>
              <li><button onClick={() => setCurrentTab('account')} className="hover:text-blue-600">Monitored Watchlist</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Governance & Legal</div>
            <ul className="space-y-1 text-slate-600 text-xs">
              <li><button onClick={() => setCurrentTab('about')} className="hover:text-blue-600">About TrustCheck</button></li>
              <li><button onClick={() => setCurrentTab('legal')} className="hover:text-blue-600">Terms of Service</button></li>
              <li><button onClick={() => setCurrentTab('legal')} className="hover:text-blue-600">Privacy Policy</button></li>
              <li><button onClick={() => setCurrentTab('legal')} className="hover:text-blue-600">Report & Moderation Policy</button></li>
              <li><button onClick={() => setCurrentTab('contact')} className="hover:text-blue-600">Contact Compliance Desk</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium gap-4">
          <div>© 2026 TrustCheck Intelligence. All rights reserved.</div>
          <div className="text-center sm:text-right text-[10px] text-slate-400">
            TrustCheck provides data-driven evidence scores. Scores are non-binding risk assessments.
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        entityId={modalEntityId}
        onSubmit={handleReportSubmit}
      />

      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        entityId={modalEntityId}
        onSubmit={handleVerificationSubmit}
      />

    </div>
  );
}

export default App;
