
import React, { useState } from 'react';
import { AppView, DietaryRestriction } from '../types';

interface SidebarProps {
  view: AppView;
  setView: (v: AppView) => void;
  restriction: DietaryRestriction;
  setRestriction: (r: DietaryRestriction) => void;
  shoppingCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, restriction, setRestriction, shoppingCount }) => {
  const [showFilters, setShowFilters] = useState(false);
  const restrictions = Object.values(DietaryRestriction);

  const navItems = [
    { id: 'SCANNER' as AppView, label: 'Fridge', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
    )},
    { id: 'PANTRY' as AppView, label: 'Pantry', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { id: 'RECIPES' as AppView, label: 'Recipes', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    )},
    { id: 'SHOPPING' as AppView, label: 'List', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    )},
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="md:hidden glass fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
          <span className="font-bold text-slate-900">ChefVision</span>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </header>

      {/* MOBILE FILTER OVERLAY */}
      {showFilters && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl z-30 p-6 shadow-2xl animate-in slide-in-from-top border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dietary Filters</h3>
          <div className="flex flex-wrap gap-2">
            {restrictions.map(r => (
              <button
                key={r}
                onClick={() => { setRestriction(r); setShowFilters(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${restriction === r ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden glass fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4 z-40 border-t border-slate-200/50">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 relative ${view === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {item.id === 'SHOPPING' && shoppingCount > 0 && (
              <span className="absolute top-0 right-1/4 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {shoppingCount}
              </span>
            )}
            {view === item.id && <div className="absolute -bottom-2 w-1 h-1 bg-indigo-600 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 glass shadow-xl z-20 sticky top-0 h-screen flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">ChefVision</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-50 text-slate-600'}`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
              {item.id === 'SHOPPING' && shoppingCount > 0 && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${view === 'SHOPPING' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                  {shoppingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-200/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dietary Filters</h3>
          <div className="space-y-1">
            {restrictions.map(r => (
              <label key={r} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="restriction" 
                  checked={restriction === r}
                  onChange={() => setRestriction(r)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className={`text-sm ${restriction === r ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{r}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
