
import React, { useState } from 'react';
import { Recipe } from '../types';
import { speakStep } from '../services/gemini';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
  onFinish: () => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    await speakStep(recipe.steps[currentStep]);
    setIsSpeaking(false);
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;
  const isLastStep = currentStep === recipe.steps.length - 1;

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for PC / Toggleable for Mobile */}
      <div className={`w-full md:w-1/3 bg-slate-900 text-white p-6 md:p-8 flex flex-col transition-transform duration-300 md:translate-x-0 ${showOverview ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:relative inset-0 z-[110] md:z-0`}>
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-bold">Quit</span>
          </button>
          <button onClick={() => setShowOverview(false)} className="md:hidden text-slate-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight">{recipe.name}</h2>
        
        <div className="space-y-4 mt-4 overflow-y-auto flex-1">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Preparation Checklist</h3>
          {recipe.steps.map((step, idx) => (
            <button 
              key={idx}
              onClick={() => { setCurrentStep(idx); setShowOverview(false); }}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${idx === currentStep ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
            >
              <div className="flex gap-4">
                <span className={`font-black text-xl ${idx === currentStep ? 'opacity-100' : 'opacity-20'}`}>{idx + 1}</span>
                <p className="text-sm font-medium leading-relaxed line-clamp-2">{step}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main step focus area */}
      <div className="flex-1 p-6 md:p-16 lg:p-24 bg-slate-50 flex flex-col relative overflow-y-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => setShowOverview(true)} className="md:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-black text-slate-400 tabular-nums">{currentStep + 1} / {recipe.steps.length}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Instruction</span>
            <p className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-4">
              {recipe.steps[currentStep]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="px-10 py-6 bg-indigo-600 text-white rounded-3xl shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl font-black w-full sm:w-auto"
            >
              {isSpeaking ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46L14.12 9.88c.69.69 1.13 1.63 1.13 2.62s-.44 1.93-1.13 2.62l1.42 1.42c1.06-1.06 1.71-2.52 1.71-4.04s-.65-2.98-1.71-4.04z" /></svg>
              )}
              {isSpeaking ? 'Listening...' : 'Read Step'}
            </button>

            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="flex-1 sm:w-24 h-24 md:h-24 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-20 shadow-sm"
              >
                <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              {!isLastStep ? (
                <button 
                  onClick={() => setCurrentStep(prev => Math.min(recipe.steps.length - 1, prev + 1))}
                  className="flex-1 sm:w-24 h-24 md:h-24 bg-slate-900 rounded-3xl flex items-center justify-center hover:bg-black shadow-xl transition-all"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </button>
              ) : (
                <button 
                  onClick={onFinish}
                  className="flex-[2] h-24 bg-emerald-600 text-white font-black text-2xl rounded-3xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                  FINISH
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-slate-400 font-bold text-sm">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           Hands messy? Just tap "Read Step".
        </div>
      </div>
    </aside>
  );
};

export default CookingMode;
