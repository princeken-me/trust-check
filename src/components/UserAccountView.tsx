import React, { useState } from 'react';
import { 
  User, Bookmark, Bell, History, ShieldAlert, CheckCircle2, AlertTriangle, Eye, ArrowRight 
} from 'lucide-react';

interface UserAccountViewProps {
  watchlist: any[];
  onSelectEntity: (entityId: string) => void;
  onRemoveWatchlist: (entityId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({
  watchlist,
  onSelectEntity,
  onRemoveWatchlist,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'watchlist' | 'checks' | 'alerts' | 'reports'>('watchlist');

  // Mocked user activity items
  const recentChecks = [
    { id: 'c1', query: 'https://apexglobalfreight.com', type: 'Website', date: 'Today at 09:15', status: '72/100 Moderate Risk' },
    { id: 'c2', query: 'resell-prime-deals-global.net', type: 'Website', date: 'Yesterday', status: '15/100 High Risk' },
    { id: 'c3', query: 'Downtown Penthouse #1402', type: 'Rental', date: 'Jul 26, 2026', status: '64/100 Moderate' },
  ];

  const alerts = [
    { id: 'a1', title: 'New Risk Signal Detected', entity: 'Apex Global Logistics', date: '2 hours ago', unread: true, message: 'WHOIS registry record changed expiration date.' },
    { id: 'a2', title: 'Moderation Case Approved', entity: 'Resell Prime Deals', date: '1 day ago', unread: false, message: 'User incident report confirmed by compliance desk.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* User Header */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
            JD
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Consumer Account Portal</h1>
            <p className="text-xs text-slate-500 font-medium">masterfixboss@gmail.com • Regular User Profile</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('report')}
            className="px-3.5 py-2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
          >
            Submit Incident Report
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('watchlist')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'watchlist'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Monitored Watchlist ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checks')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'checks'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Recent Checks History</span>
        </button>

        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeSubTab === 'alerts'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Security Alerts</span>
        </button>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-4">
          {watchlist.length === 0 ? (
            <div className="bg-white rounded-md border border-slate-200 p-8 text-center space-y-2 text-xs text-slate-500">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium">No monitored entities in your watchlist.</p>
              <button
                onClick={() => onNavigateTab('search')}
                className="text-blue-600 hover:underline font-bold"
              >
                Search directory to add entities to monitor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item) => {
                const ent = item.entity;
                if (!ent) return null;
                return (
                  <div key={item.id} className="bg-white rounded-md border border-slate-200 p-5 space-y-3 shadow-2xs flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ent.entity_type}
                        </span>
                        <button
                          onClick={() => onRemoveWatchlist(ent.id)}
                          className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{ent.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{ent.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Monitored 24/7</span>
                      <button
                        onClick={() => onSelectEntity(ent.id)}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Inspect Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'checks' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Search & Verification Logs</h3>
          <div className="divide-y divide-slate-200">
            {recentChecks.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">{c.query}</span>
                  <span className="text-slate-500">{c.type} • {c.date}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'alerts' && (
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Entity Alert Notifications</h3>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="p-4 rounded border border-slate-200 bg-slate-50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{a.date}</span>
                </div>
                <div className="font-medium text-blue-600">{a.entity}</div>
                <p className="text-slate-600">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
