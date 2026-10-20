import React from 'react';
import { 
  Globe, Briefcase, Home, TrendingUp, ShieldCheck, UserCheck, Phone, CreditCard 
} from 'lucide-react';

interface CategoryShortcutsProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const CategoryShortcuts: React.FC<CategoryShortcutsProps> = ({ onSelectCategory, activeCategory }) => {
  const categories = [
    { id: 'Website', label: 'Website Checker', icon: Globe, desc: 'URL, domain age, SSL & WHOIS' },
    { id: 'Business', label: 'Business & Seller', icon: ShieldCheck, desc: 'Corporate registry & verified status' },
    { id: 'Job Offer', label: 'Job Offer', icon: Briefcase, desc: 'Employer identity & fee warnings' },
    { id: 'Rental Listing', label: 'Rental Listing', icon: Home, desc: 'Property, landlord & duplicate checks' },
    { id: 'Investment Opportunity', label: 'Investment', icon: TrendingUp, desc: 'Regulatory filings & yield risk' },
    { id: 'Social Profile', label: 'Social Profile', icon: UserCheck, desc: 'Impersonation & account signals' },
    { id: 'Phone Number', label: 'Phone / Email', icon: Phone, desc: 'Contact risk & scam history' },
    { id: 'Payment Account', label: 'Payment Request', icon: CreditCard, desc: 'Escrow & wire transfer risk' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Specialized Verification Categories</h3>
          <p className="text-xs text-slate-500 font-medium">Select a category to tailor risk evaluation algorithms to your specific transaction context.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3 rounded-md border text-left transition cursor-pointer flex flex-col justify-between space-y-2 group ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded flex items-center justify-center ${
                isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 group-hover:text-blue-600'
              }`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">{cat.label}</div>
                <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500 font-medium'}`}>
                  {cat.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
