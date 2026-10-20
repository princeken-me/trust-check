import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Bookmark, ShieldAlert, FileText, UserCheck, Layers, 
  AlertTriangle, Info, Mail, User, Menu, X, Cpu 
} from 'lucide-react';
import { UserRole } from '../types/index.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  watchlistCount: number;
  pendingReportsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentRole,
  setCurrentRole,
  watchlistCount,
  pendingReportsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStaff = ['Super Admin', 'Admin', 'Analyst', 'Moderator'].includes(currentRole);

  const navItems = [
    { id: 'search', label: 'Universal Checker', icon: Search },
    { id: 'checkers', label: 'Specialized Tools', icon: Cpu },
    { id: 'directory', label: 'Global Directory', icon: Layers },
    { id: 'report', label: 'Report Incident', icon: AlertTriangle, highlight: true },
    { id: 'verification', label: 'Claim Profile', icon: UserCheck },
    { id: 'account', label: 'Account & Watchlist', icon: User, badge: watchlistCount },
    { id: 'about', label: 'About', icon: Info },
    { id: 'legal', label: 'Legal Policies', icon: FileText },
    { id: 'contact', label: 'Contact Desk', icon: Mail },
  ];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setCurrentTab('search')}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">TrustCheck</h1>
              <span className="h-4 w-px bg-slate-300 mx-3 hidden xl:block"></span>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest hidden xl:block">Global Risk Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                      : item.highlight
                      ? 'text-rose-700 hover:bg-rose-50 border border-transparent font-bold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {isStaff && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Control Center</span>
                {pendingReportsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {pendingReportsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentTab('architecture')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                currentTab === 'architecture'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                  : 'text-indigo-700/80 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Spec</span>
            </button>
          </nav>

          {/* Right Role Switcher & Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Regular User" className="bg-white text-slate-900">Regular User</option>
                <option value="Verified Business" className="bg-white text-slate-900">Verified Business</option>
                <option value="Moderator" className="bg-white text-slate-900">Moderator Desk</option>
                <option value="Analyst" className="bg-white text-slate-900">Risk Analyst</option>
                <option value="Super Admin" className="bg-white text-slate-900">Super Admin</option>
              </select>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold cursor-pointer ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {isStaff && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-white bg-slate-900 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span>Admin Control Center</span>
              </div>
              {pendingReportsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

