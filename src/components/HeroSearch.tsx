import React, { useState } from 'react';
import { Search, Globe, Briefcase, Home, TrendingUp, Phone, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string, inputType: string) => void;
  isLoading: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('url');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), selectedType);
    }
  };

  const setExample = (text: string, type: string) => {
    setQuery(text);
    setSelectedType(type);
    onSearch(text, type);
  };

  return (
    <div className="bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-3xl mx-auto text-center space-y-5">
        
        {/* Neutral Trust Positioning Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>TrustCheck Intelligence Engine • Global Risk Intelligence</span>
        </div>

        {/* Input Type Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {[
            { id: 'url', label: 'Website URL', icon: Globe },
            { id: 'business', label: 'Business / Seller', icon: ShieldCheck },
            { id: 'listing', label: 'Job Offer', icon: Briefcase },
            { id: 'rental', label: 'Rental Listing', icon: Home },
            { id: 'investment', label: 'Investment', icon: TrendingUp },
            { id: 'contact', label: 'Phone / Email', icon: Phone },
          ].map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar - Matching exact theme styling */}
        <form onSubmit={handleSubmit} className="w-full relative pt-2">
          <div className="w-full relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                selectedType === 'url' ? 'Enter website URL, Business Name, or Phone Number...' :
                selectedType === 'business' ? 'Enter business or seller name...' :
                selectedType === 'listing' ? 'Paste job offer link or title...' :
                selectedType === 'rental' ? 'Enter property rental listing link or address...' :
                selectedType === 'investment' ? 'Enter platform name or opportunity URL...' :
                'Enter phone number or email address...'
              }
              className="w-full py-5 px-6 pr-36 rounded-lg bg-white border-2 border-blue-100 shadow-md focus:outline-none focus:border-blue-500 text-base sm:text-lg text-slate-800 placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-8 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition flex items-center justify-center space-x-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-500 italic font-medium">"Before you trust it, check it."</p>

        {/* Preset Example Quick Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Try verifying:</span>
          <button
            onClick={() => setExample('https://resell-prime-deals-global.net', 'url')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-rose-700 border border-slate-200 font-medium transition cursor-pointer shadow-2xs"
          >
            resell-prime-deals-global.net (Suspicious)
          </button>
          <button
            onClick={() => setExample('https://apexglobalfreight.com', 'url')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-emerald-700 border border-slate-200 font-medium transition cursor-pointer shadow-2xs"
          >
            Apex Global Freight (Verified)
          </button>
          <button
            onClick={() => setExample('Downtown Penthouse #1402', 'rental')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition cursor-pointer shadow-2xs"
          >
            Downtown Penthouse Rental
          </button>
        </div>

        {/* Legal Disclaimer Principle */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-500 max-w-xl mx-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            TrustCheck provides evidence-backed risk signal indicators based on public data.
          </span>
        </div>

      </div>
    </div>
  );
};
