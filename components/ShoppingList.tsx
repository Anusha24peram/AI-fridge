
import React from 'react';

interface ShoppingListProps {
  items: string[];
  onRemove: (item: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemove }) => {
  return (
    <div className="max-w-2xl mx-auto pt-16 md:pt-0">
      <div className="mb-10 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Shopping List</h2>
        <p className="text-slate-500">Essential items to pick up for your next kitchen session.</p>
      </div>

      {items.length === 0 ? (
        <div className="mx-4 md:mx-0 bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Everything's in stock!</h3>
          <p className="text-slate-500">Add missing items directly from recipe cards to see them here.</p>
        </div>
      ) : (
        <div className="mx-4 md:mx-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-lg border-2 border-indigo-100 flex items-center justify-center bg-white group-hover:border-indigo-400 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-sm opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                  <span className="font-bold text-slate-700 capitalize text-lg">{item}</span>
                </div>
                <button 
                  onClick={() => onRemove(item)}
                  className="text-slate-300 p-2 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-900 p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">{items.length}</span>
              <span className="text-white font-bold tracking-wide uppercase text-xs opacity-70">Total Items</span>
            </div>
            <button className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
              DONE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
