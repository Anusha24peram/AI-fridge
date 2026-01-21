
import React, { useState } from 'react';
import { Ingredient } from '../types';

interface PantryManagerProps {
  items: Ingredient[];
  setItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const PantryManager: React.FC<PantryManagerProps> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: Ingredient = {
      id: `${Date.now()}-${Math.random()}`,
      name: newItemName.trim(),
      quantity: newQuantity.trim() || undefined,
      expiryDate: newExpiry || undefined
    };

    setItems(prev => [newItem, ...prev]);
    setNewItemName('');
    setNewQuantity('');
    setNewExpiry('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getExpiryStatus = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { label: '⚠️ EXPIRED', color: 'text-rose-700 bg-rose-100 border-rose-200 shadow-sm' };
    if (days === 0) return { label: '⚠️ EXPIRES TODAY', color: 'text-amber-700 bg-amber-100 border-amber-200' };
    if (days <= 3) return { label: `⚠️ Expiring in ${days}d`, color: 'text-amber-700 bg-amber-50 border-amber-100' };
    return { label: `Expires in ${days}d`, color: 'text-slate-500 bg-slate-50' };
  };

  return (
    <div className="max-w-4xl mx-auto pt-16 md:pt-0">
      <div className="mb-8 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pantry Management</h2>
        <p className="text-slate-500">Keep track of your staples and quantities to avoid food waste.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8 mx-4 md:mx-0">
        <form onSubmit={handleAddItem} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-[2]">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Ingredient Name</label>
              <input 
                type="text" 
                placeholder="e.g. Flour, Olive Oil" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Quantity</label>
              <input 
                type="text" 
                placeholder="e.g. 500g, 2 units" 
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Expiry Date (Optional)</label>
              <input 
                type="date" 
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="md:pt-6 flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Add to Pantry
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 md:px-0 pb-10">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-medium">Your pantry is empty. Add items above to get personalized recipe suggestions.</p>
          </div>
        ) : (
          items.map(item => {
            const status = getExpiryStatus(item.expiryDate);
            const isUrgent = item.expiryDate && (new Date(item.expiryDate).getTime() - Date.now() <= 3 * 24 * 60 * 60 * 1000);
            
            return (
              <div key={item.id} className={`bg-white p-5 rounded-2xl border transition-all flex items-center justify-between group ${isUrgent ? 'border-amber-400 shadow-amber-100 shadow-md ring-1 ring-amber-400/20' : 'border-slate-200 hover:border-indigo-400 hover:shadow-md'}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 capitalize">{item.name}</h4>
                    {item.quantity && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                  {status && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black mt-2 inline-block w-fit border ${status.color}`}>
                      {status.label}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PantryManager;
