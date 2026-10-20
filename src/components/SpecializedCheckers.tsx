import React, { useState } from 'react';
import { 
  Globe, Briefcase, Home, TrendingUp, ShieldCheck, Phone, CreditCard, AlertTriangle, 
  CheckCircle2, ArrowRight, Shield, FileText, Upload, Info 
} from 'lucide-react';

interface SpecializedCheckersProps {
  onSearch: (query: string, inputType: string) => void;
  isLoading: boolean;
  onOpenReportModal: (entityId: string) => void;
}

export const SpecializedCheckers: React.FC<SpecializedCheckersProps> = ({
  onSearch,
  isLoading,
  onOpenReportModal
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'business' | 'job' | 'rental' | 'investment'>('url');

  // Form states
  const [urlInput, setUrlInput] = useState('');
  const [businessInput, setBusinessInput] = useState('');
  const [businessCountry, setBusinessCountry] = useState('Global');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobFeeAlert, setJobFeeAlert] = useState(false);

  const [rentalUrl, setRentalUrl] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [rentalLandlord, setRentalLandlord] = useState('');

  const [investOrg, setInvestOrg] = useState('');
  const [investReturn, setInvestReturn] = useState('');
  const [investUrl, setInvestUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) onSearch(urlInput.trim(), 'url');
  };

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessInput.trim()) onSearch(businessInput.trim(), 'business');
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = jobUrl || `${jobTitle} at ${jobCompany}`;
    if (query.trim()) onSearch(query.trim(), 'listing');
  };

  const handleRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = rentalUrl || `Rental: ${rentalLandlord} ${rentalPrice}`;
    if (query.trim()) onSearch(query.trim(), 'rental');
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = investUrl || investOrg;
    if (query.trim()) onSearch(query.trim(), 'investment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-2">
        <div className="flex items-center space-x-2 text-blue-600">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Specialized Verification Checkers</h1>
        </div>
        <p className="text-xs text-slate-600 font-medium">
          Targeted forensic analysis engines optimized for website domains, corporate entities, employment offers, rental listings, and investment platforms.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'url', label: 'Website Domain Checker', icon: Globe },
          { id: 'business', label: 'Business & Corporate Registry', icon: ShieldCheck },
          { id: 'job', label: 'Employment Offer Verification', icon: Briefcase },
          { id: 'rental', label: 'Rental & Real Estate Audit', icon: Home },
          { id: 'investment', label: 'Investment Yield Auditor', icon: TrendingUp },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <IconComp className="w-4 h-4 text-blue-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Website Checker */}
      {activeTab === 'url' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Website & Domain Risk Intelligence</h2>
            <p className="text-xs text-slate-500 font-medium">
              Checks domain registration age, SSL certificate validity, WHOIS privacy masks, hosting infrastructure, and active consumer reports.
            </p>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Website Domain or Full URL
              </label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://apexglobalfreight.com or ebay-motors-deals-online.org"
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? 'Scanning Domain...' : 'Audit Website Security & Signals'}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Domain Age & Registration</span>
              <p className="text-slate-600">Verifies WHOIS creation dates. Newly registered domains (&lt; 90 days) receive lower baseline trust scores.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">HTTPS & SSL Infrastructure</span>
              <p className="text-slate-600">Audits TLS encryption standards, certificate issuer transparency, and cryptographic key strength.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Identity Correlation</span>
              <p className="text-slate-600">Cross-references domain names against verified state corporate registries and trademark databases.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Business Checker */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Corporate & Business Profile Verification</h2>
            <p className="text-xs text-slate-500 font-medium">
              Evaluates corporate registration records, physical office location consistency, tax identification status, and customer dispute history.
            </p>
          </div>

          <form onSubmit={handleBusinessSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Business Legal / Trade Name
                </label>
                <input
                  type="text"
                  required
                  value={businessInput}
                  onChange={(e) => setBusinessInput(e.target.value)}
                  placeholder="e.g. Apex Global Logistics Solutions Inc."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Jurisdiction / Country
                </label>
                <select
                  value={businessCountry}
                  onChange={(e) => setBusinessCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
                >
                  <option value="Global">Global / International</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !businessInput.trim()}
              className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? 'Searching Corporate Registries...' : 'Check Business Record'}
            </button>
          </form>

          <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-900 flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Are you a corporate representative?</span>
              <p className="text-amber-800">
                Registered business owners can request official <strong>Verified Identity</strong> status by submitting corporate filing paperwork.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Job Offer Checker */}
      {activeTab === 'job' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Job Offer & Employment Scam Auditor</h2>
            <p className="text-xs text-slate-500 font-medium">
              Detects fraudulent remote work offers, fake recruiter credentials, equipment purchase check scams, and mandatory upfront fee demands.
            </p>
          </div>

          <form onSubmit={handleJobSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Remote Data Specialist"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Claimed Hiring Company
                </label>
                <input
                  type="text"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  placeholder="e.g. Apex Global Logistics"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Job Listing URL or Recruiter Email
              </label>
              <input
                type="text"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="Paste URL from LinkedIn, Indeed, or recruiter email address..."
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center space-x-3">
              <input
                type="checkbox"
                id="feeCheck"
                checked={jobFeeAlert}
                onChange={(e) => setJobFeeAlert(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="feeCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                The recruiter asked for upfront payment, equipment check deposit, or training fee (Critical Risk Signal)
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!jobUrl && !jobTitle)}
              className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? 'Analyzing Employment Offer...' : 'Audit Job Listing'}
            </button>
          </form>

          <div className="p-4 rounded border border-rose-200 bg-rose-50 text-xs text-rose-900 space-y-1">
            <span className="font-bold flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Employment Risk Alert</span>
            </span>
            <p className="text-rose-800">
              Legitimate employers never ask candidates to wire money for home office equipment checks or pay for mandatory background checks via gift cards.
            </p>
          </div>
        </div>
      )}

      {/* 4. Rental Checker */}
      {activeTab === 'rental' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Rental Listing & Property Scam Verification</h2>
            <p className="text-xs text-slate-500 font-medium">
              Screens apartment and vacation rental listings for duplicate photos across multiple cities, phantom landlord identities, and wire transfer deposit scams.
            </p>
          </div>

          <form onSubmit={handleRentalSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Rental Listing URL or Address
              </label>
              <input
                type="text"
                required
                value={rentalUrl}
                onChange={(e) => setRentalUrl(e.target.value)}
                placeholder="e.g. https://craigslist.org/apa/123456789.html or Downtown Penthouse #1402"
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Monthly Rent Amount ($)
                </label>
                <input
                  type="text"
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(e.target.value)}
                  placeholder="e.g. $1,800/mo"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Landlord / Agent Contact Info
                </label>
                <input
                  type="text"
                  value={rentalLandlord}
                  onChange={(e) => setRentalLandlord(e.target.value)}
                  placeholder="e.g. agent-john@fast-lease.net"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !rentalUrl.trim()}
              className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? 'Scanning Listing Databases...' : 'Audit Rental Property'}
            </button>
          </form>
        </div>
      )}

      {/* 5. Investment Checker */}
      {activeTab === 'investment' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Investment Yield & Opportunity Auditor</h2>
            <p className="text-xs text-slate-500 font-medium">
              Verifies regulatory SEC/FCA registration filings, inspects unrealistic guaranteed return claims, and flags high-yield Ponzi structures.
            </p>
          </div>

          <form onSubmit={handleInvestSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Platform Name or Website URL
              </label>
              <input
                type="text"
                required
                value={investOrg}
                onChange={(e) => setInvestOrg(e.target.value)}
                placeholder="e.g. Crypto Yield Vault or Apex Global Capital"
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Claimed Returns / Yield Promise
              </label>
              <input
                type="text"
                value={investReturn}
                onChange={(e) => setInvestReturn(e.target.value)}
                placeholder="e.g. 5% Daily Guaranteed Return"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !investOrg.trim()}
              className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:bg-slate-300"
            >
              {isLoading ? 'Searching Regulatory Registries...' : 'Audit Investment Entity'}
            </button>
          </form>

          {/* Regulatory Disclaimer Notice */}
          <div className="bg-slate-100 p-4 rounded border border-slate-300 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">Regulatory & Financial Notice</span>
            <p>
              TrustCheck provides informational data matching based on public securities filings and domain signals. 
              <strong> TrustCheck does not provide financial, legal, or investment advice.</strong>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
