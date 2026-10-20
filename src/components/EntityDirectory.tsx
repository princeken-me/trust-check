import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { fetchEntities } from '../services/api.js';
import { Entity } from '../types/index.js';

interface EntityDirectoryProps {
  onSelectEntity: (entityId: string) => void;
}

export const EntityDirectory: React.FC<EntityDirectoryProps> = ({ onSelectEntity }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEntities();
  }, [selectedType, searchQuery]);

  const loadEntities = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEntities(selectedType || undefined, undefined, searchQuery || undefined);
      setEntities(data);
    } catch (err) {
      console.error('Failed loading directory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-md border border-slate-200 p-6 shadow-2xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Entity Index & Directory</h1>
        <p className="text-xs text-slate-600 font-medium">
          Browse verified websites, registered businesses, job listings, rental properties, and investment platforms.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-2xs">
        
        {/* Search Filter */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name or domain..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: '', label: 'All Entities' },
            { id: 'Website', label: 'Websites' },
            { id: 'Business', label: 'Businesses' },
            { id: 'Job Offer', label: 'Job Offers' },
            { id: 'Rental Listing', label: 'Rentals' },
            { id: 'Investment Opportunity', label: 'Investments' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                selectedType === t.id
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      </div>

      {/* Entity Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-medium">Loading catalog...</div>
      ) : entities.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 bg-white rounded-md border border-slate-200">
          No matching entities found. Try adjusting your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((ent) => (
            <div
              key={ent.id}
              onClick={() => onSelectEntity(ent.id)}
              className="bg-white rounded-md border border-slate-200 p-5 space-y-3 hover:border-blue-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {ent.entity_type}
                  </span>

                  {ent.verification_status === 'verified' ? (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">Unverified</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition truncate">
                  {ent.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">{ent.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{ent.country || 'Global'}</span>
                <span className="flex items-center space-x-1 text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
