import React from 'react';
import { Bookmark, ShieldCheck, Trash2, Bell, ExternalLink } from 'lucide-react';
import { Watchlist } from '../types/index.js';

interface WatchlistPanelProps {
  items: Watchlist[];
  onSelectEntity: (entityId: string) => void;
  onRemove: (entityId: string) => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ items, onSelectEntity, onRemove }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Bookmark className="w-5 h-5" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monitored Entities Watchlist</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Receive automated alerts whenever trust scores, verification statuses, or new user reports are registered.</p>
        </div>
        <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-md text-xs border border-slate-200">
          {items.length} Saved Entities
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-slate-500 space-y-3 shadow-2xs">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Your Watchlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Search for any website, business, job offer, or rental listing and click "Add to Watchlist" to track updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const ent = item.entity;
            if (!ent) return null;

            return (
              <div key={item.id} className="bg-white rounded-md border border-slate-200 p-5 space-y-4 hover:border-blue-400 transition flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {ent.entity_type}
                    </span>
                    <button
                      onClick={() => onRemove(ent.id)}
                      className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectEntity(ent.id)}
                    className="font-bold text-slate-900 text-base hover:text-blue-600 cursor-pointer transition truncate"
                  >
                    {ent.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{ent.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span>Score & Signal Alerts Active</span>
                  </div>

                  <button
                    onClick={() => onSelectEntity(ent.id)}
                    className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
